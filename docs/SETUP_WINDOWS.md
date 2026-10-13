# Windows Setup — CareCompanion

## Requirements
- Node.js 18+ (Node 20 or 22 LTS is recommended)
- npm

## Install
Open PowerShell inside the project folder:

```powershell
npm install
```

## Start
```powershell
npm start
```

Open:
`http://localhost:5000`

## Demo accounts
Customer: `customer@care.local` / `demo123`
Companion: `amit@care.local` / `demo123`
Admin: `admin@care.local` / `demo123`

## Important
This version intentionally does **not** use `better-sqlite3`, so Windows does not need Visual Studio C++ Build Tools just to install the project. Data is stored locally in `server/carecompanion-data.json` and persists between restarts.
