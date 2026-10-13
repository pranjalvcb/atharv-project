const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mca-final-project-secret-change-me';
const DB_FILE = path.join(__dirname, '..', 'carecompanion-data.json');

const emptyDb = { users: [], companions: [], bookings: [], updates: [], counters: { users: 1, companions: 1, bookings: 1, updates: 1 } };
function loadDb() {
  if (!fs.existsSync(DB_FILE)) { fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2)); }
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return JSON.parse(JSON.stringify(emptyDb)); }
}
let db = loadDb();
function saveDb() { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
function nextId(type) { const id = db.counters[type]++; saveDb(); return id; }
function findUserByEmail(email) { return db.users.find(u => u.email.toLowerCase() === String(email || '').toLowerCase()); }
function publicUser(u) { return { id:u.id, name:u.name, email:u.email, phone:u.phone, city:u.city, role:u.role }; }

function seed() {
  if (db.users.length) return;
  const hash = bcrypt.hashSync('demo123', 10);
  const addUser = (name,email,phone,city,role) => { const u={id:nextId('users'),name,email,password:hash,phone,city,role,created_at:new Date().toISOString()}; db.users.push(u); return u; };
  const customer = addUser('Demo Customer','customer@care.local','9876543210','Bijnor','customer');
  const c1 = addUser('Amit Sharma','amit@care.local','9810011122','Delhi','companion');
  const c2 = addUser('Neha Verma','neha@care.local','9810011133','Delhi','companion');
  const c3 = addUser('Rahul Singh','rahul@care.local','9810011144','Delhi','companion');
  addUser('System Admin','admin@care.local','9000000000','Delhi','admin');
  const addCompanion = (user,bio,experience,hourly_rate,rating,verified,availability,languages) => db.companions.push({id:nextId('companions'),user_id:user.id,bio,experience,hourly_rate,rating,verified,availability,languages});
  addCompanion(c1,'Calm and patient-focused companion with strong hospital coordination skills.',4,300,4.9,1,'Available','Hindi, English');
  addCompanion(c2,'Experienced in appointment coordination, paperwork and family communication.',6,350,4.8,1,'Available','Hindi, English');
  addCompanion(c3,'Reliable local companion for day visits and diagnostic appointments.',3,250,4.7,1,'Busy','Hindi');
  saveDb();
}
seed();

app.use(cors());
app.use(express.json());
function auth(req,res,next){
  const h=req.headers.authorization||'';
  if(!h.startsWith('Bearer ')) return res.status(401).json({error:'Login required'});
  try { req.user=jwt.verify(h.slice(7),JWT_SECRET); next(); } catch { res.status(401).json({error:'Invalid or expired session'}); }
}
function sign(user){ return jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},JWT_SECRET,{expiresIn:'7d'}); }
function getBooking(id){ return db.bookings.find(b=>b.id===Number(id)); }
function companionWithUser(c){ const u=db.users.find(x=>x.id===c.user_id); return {...c,name:u?.name||'',phone:u?.phone||'',city:u?.city||''}; }

app.get('/api/health',(req,res)=>res.json({ok:true,project:'CareCompanion'}));
app.post('/api/register',(req,res)=>{
  const {name,email,password,phone,city}=req.body;
  if(!name||!email||!password) return res.status(400).json({error:'Name, email and password are required'});
  if(findUserByEmail(email)) return res.status(400).json({error:'Email already registered'});
  const u={id:nextId('users'),name,email,password:bcrypt.hashSync(password,10),phone:phone||'',city:city||'',role:'customer',created_at:new Date().toISOString()};
  db.users.push(u); saveDb(); res.json({token:sign(u),user:publicUser(u)});
});
app.post('/api/login',(req,res)=>{
  const u=findUserByEmail(req.body.email);
  if(!u||!bcrypt.compareSync(req.body.password||'',u.password)) return res.status(401).json({error:'Invalid email or password'});
  res.json({token:sign(u),user:publicUser(u)});
});
app.get('/api/me',auth,(req,res)=>res.json(req.user));
app.get('/api/companions',auth,(req,res)=>{
  const city=(req.query.city||'').trim().toLowerCase();
  let rows=db.companions.map(companionWithUser).filter(x=>!city||x.city.toLowerCase()===city);
  rows.sort((a,b)=>b.rating-a.rating); res.json(rows);
});
app.post('/api/bookings',auth,(req,res)=>{
  const {companion_id,patient_name,hospital,hospital_city,appointment_date,appointment_time,service_type,notes}=req.body;
  if(!companion_id||!patient_name||!hospital||!hospital_city||!appointment_date||!appointment_time||!service_type) return res.status(400).json({error:'Please fill all required booking fields'});
  const c=db.companions.find(x=>x.id===Number(companion_id)); if(!c)return res.status(404).json({error:'Companion not found'});
  const hours=service_type==='Full Day Support'?8:service_type==='Half Day Support'?4:2;
  const total=hours*c.hourly_rate;
  const b={id:nextId('bookings'),customer_id:req.user.id,companion_id:Number(companion_id),patient_name,hospital,hospital_city,appointment_date,appointment_time,service_type,notes:notes||'',status:'Requested',total_amount:total,created_at:new Date().toISOString()};
  db.bookings.push(b); saveDb(); res.json({id:b.id,total_amount:total});
});
function bookingView(b){ const c=db.companions.find(x=>x.id===b.companion_id); const u=c&&db.users.find(x=>x.id===c.user_id); return {...b,companion_name:u?.name||'',companion_phone:u?.phone||'',companion_city:u?.city||'',rating:c?.rating||0,verified:c?.verified||0}; }
app.get('/api/bookings',auth,(req,res)=>{
  let rows=db.bookings;
  if(req.user.role==='customer') rows=rows.filter(b=>b.customer_id===req.user.id);
  else if(req.user.role==='companion') rows=rows.filter(b=>{const c=db.companions.find(x=>x.id===b.companion_id);return c?.user_id===req.user.id;});
  res.json(rows.slice().sort((a,b)=>b.id-a.id).map(bookingView));
});
app.patch('/api/bookings/:id/status',auth,(req,res)=>{
  const b=getBooking(req.params.id); if(!b)return res.status(404).json({error:'Booking not found'});
  const c=db.companions.find(x=>x.id===b.companion_id);
  const allowed=['Requested','Accepted','In Progress','Completed','Cancelled'];
  if(req.user.role==='customer'&&b.customer_id!==req.user.id || req.user.role==='companion'&&c?.user_id!==req.user.id || !['customer','companion','admin'].includes(req.user.role)) return res.status(403).json({error:'Not allowed'});
  if(!allowed.includes(req.body.status))return res.status(400).json({error:'Invalid status'});
  b.status=req.body.status; saveDb(); res.json({success:true});
});
function canAccessBooking(user,b){ if(user.role==='admin')return true; if(user.role==='customer')return b.customer_id===user.id; const c=db.companions.find(x=>x.id===b.companion_id); return c?.user_id===user.id; }
app.get('/api/bookings/:id/updates',auth,(req,res)=>{
  const b=getBooking(req.params.id); if(!b)return res.status(404).json({error:'Not found'}); if(!canAccessBooking(req.user,b))return res.status(403).json({error:'Not allowed'});
  res.json(db.updates.filter(x=>x.booking_id===b.id).sort((a,b)=>b.id-a.id).map(x=>({...x,author_name:db.users.find(u=>u.id===x.author_id)?.name||'User'})));
});
app.post('/api/bookings/:id/updates',auth,(req,res)=>{
  const b=getBooking(req.params.id); if(!b)return res.status(404).json({error:'Not found'}); if(!canAccessBooking(req.user,b))return res.status(403).json({error:'Not allowed'}); if(!req.body.message)return res.status(400).json({error:'Message required'});
  const u={id:nextId('updates'),booking_id:b.id,author_id:req.user.id,message:req.body.message,created_at:new Date().toISOString()}; db.updates.push(u); saveDb(); res.json({id:u.id});
});
app.get('/api/admin/stats',auth,(req,res)=>{ if(req.user.role!=='admin')return res.status(403).json({error:'Admin only'}); res.json({users:db.users.filter(x=>x.role==='customer').length,companions:db.companions.length,bookings:db.bookings.length,revenue:db.bookings.filter(x=>x.status==='Completed').reduce((s,x)=>s+x.total_amount,0)}); });

app.use(express.static(path.join(__dirname,'../../client')));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'../../client/index.html')));
app.listen(PORT,()=>console.log(`CareCompanion running at http://localhost:${PORT}`));
