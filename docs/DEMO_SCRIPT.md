# 5–7 Minute Viva Demo Script

### Opening
“मेरा project CareCompanion है। इसका उद्देश्य उन families की मदद करना है जिनके parents या relatives दूसरे शहर में रहते हैं और hospital visit के समय family member खुद available नहीं हो पाता।”

### Problem
“Existing hospital systems appointments और records manage करते हैं, लेकिन remote family member के लिए एक trusted local non-clinical support person arrange करने का workflow नहीं देते।”

### Demo
- Login as customer.
- Find companion.
- Select a companion.
- Enter patient + hospital + appointment details.
- Create request.
- Explain automatic estimated pricing.
- Login as companion.
- Accept request.
- Mark In Progress.
- Add update: “Patient registration completed and waiting for consultation.”
- Mark Completed.
- Login as customer and show update history.

### Technical explanation
“The frontend calls REST APIs. Express validates requests and JWT identifies the logged-in user. SQLite persists users, companion profiles, bookings and updates. Passwords are bcrypt-hashed.”

### Closing
“The academic prototype demonstrates the complete marketplace workflow. For production I would add KYC, background verification, real payments, notifications, privacy controls and emergency escalation.”
