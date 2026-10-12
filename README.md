# Student Expense Tracker 🎓💸

A beginner-friendly fullstack native Android application built for college students to track expenses effortlessly.

- **Mobile Frontend**: Native Android App built with **React Native**, **Expo**, and **TypeScript**.
- **Backend API**: REST API built with **Node.js**, **Express**, and **JavaScript (CommonJS)**.
- **Database**: **MongoDB Atlas** (Mongoose).
- **Security**: Passwords hashed using `bcryptjs`, session handling via `jsonwebtoken` (JWT), and token persistence via `expo-secure-store`.
- **Theme**: Soft pastel study palette (Light Blue `#F4F8FF`, Mint Green `#E8F5EE`, Lavender `#E9E7FF`, Warm Cream `#FFF3E5`).
- **Currency**: Indian Rupees (₹).

---

## 📁 1. Project Structure

```text
expense/
├── mobile/                        # Native Android app (React Native + Expo + TypeScript)
│   ├── src/
│   │   ├── components/            # Reusable UI (Card, Button, Input, CategoryBadge, ExpenseCard)
│   │   ├── screens/               # 7 App Screens (Signup, Login, Dashboard, Add, Edit, History, Profile)
│   │   ├── services/              # api.ts (Centralized API client + secure storage)
│   │   ├── config.ts              # API base URL & storage keys configuration
│   │   ├── theme.ts               # Soft pastel color tokens & spacing
│   │   └── types.ts               # TypeScript data models (User, Expense, Category)
│   ├── App.tsx                    # Main navigation coordinator & state
│   ├── app.json                   # Expo application metadata & plugins
│   ├── eas.json                   # EAS Build configuration for generating standalone Android APK
│   ├── package.json               # Mobile dependencies & scripts
│   └── tsconfig.json              # TypeScript configuration
│
├── backend/                       # REST API backend (Node.js + Express + CommonJS)
│   ├── middleware/
│   │   ├── auth.js                # JWT token verification middleware
│   │   └── checkDb.js             # Database readiness guard
│   ├── models/
│   │   ├── User.js                # Mongoose User schema (hashed password protection)
│   │   └── Expense.js             # Mongoose Expense schema (Food, Travel, Education, Shopping, Other)
│   ├── routes/
│   │   ├── auth.js                # /api/auth (signup, login, me)
│   │   └── expenses.js            # /api/expenses (CRUD + monthly summary with user ownership)
│   ├── db.js                      # MongoDB Atlas connection handler
│   ├── server.js                  # Express server entry point
│   ├── test-backend.js            # Automated endpoint testing script
│   ├── package.json               # Backend dependencies & npm scripts
│   └── .env.example               # Template environment variables
│
├── .gitignore                     # Ignores node_modules, build outputs, and .env files
└── README.md                      # Complete project documentation and guide
```

---

## 📋 2. Prerequisites & Installation

### Required Software
1. **Node.js** (v18 or v20+ recommended) — [Download Node.js](https://nodejs.org/)
2. **Git** — [Download Git](https://git-scm.com/)
3. **Expo Go** application on your physical Android smartphone (free on [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)).

### Initial Installation
If setting up for the first time on a new computer:

```powershell
# In terminal 1: install backend packages
cd backend
npm install

# In terminal 2: install mobile packages
cd mobile
npm install
```

---

## 🍃 3. How to Configure MongoDB Atlas (Free Cloud Database)

1. **Create an Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Deploy a Free Cluster**:
   - Select the **M0 Free** tier cluster.
   - Choose your nearest cloud provider region (e.g. AWS Mumbai / `ap-south-1`).
   - Click **Create Cluster**.
3. **Create a Database User**:
   - Under **Security** -> **Database Access**, click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a username (e.g., `studentAdmin`) and a secure password.
   - Set privileges to **Read and write to any database**.
   - Click **Add User**.
4. **Configure IP Whitelist**:
   - Under **Security** -> **Network Access**, click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`). *(This allows your local PC and phone on home Wi-Fi to reach the database).*
   - Click **Confirm**.
5. **Get Your Connection String**:
   - In **Database** -> click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://studentAdmin:<db_password>@cluster0.abcde.mongodb.net/expense_tracker?retryWrites=true&w=majority
     ```
6. **Set up `.env` in Backend**:
   - In `backend/`, copy `.env.example` to `.env`:
     ```powershell
     cd backend
     Copy-Item .env.example .env
     ```
   - Open `backend/.env` in your editor and paste your connection string (replace `<db_password>` with your real user password):
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://studentAdmin:MyPassword123@cluster0.abcde.mongodb.net/expense_tracker?retryWrites=true&w=majority
     JWT_SECRET=super_secret_college_jwt_key_2026
     ```

---

## 🚀 4. How to Run the Backend on Windows

Open PowerShell and run:

```powershell
# Navigate to the backend folder
cd d:\expense\backend

# Start the development server (auto-reloads on edits)
npm run dev
```

You will see:
```text
✅ [MongoDB Atlas] Connected successfully to host: cluster0...
🚀 Server is running on port 5000
📡 Health check: http://localhost:5000/api/health
```

### Run Automated Backend Checks
In a separate terminal, test all routes anytime:
```powershell
cd d:\expense\backend
npm test
```

---

## 📱 5. How to Run and Test the Mobile App on Android

### Connecting Phone / Emulator to the Backend

Because the mobile app runs on your phone or Android emulator, it needs to know your computer's IP address:

1. **Find your computer's local Wi-Fi IP**:
   - Open PowerShell and type: `ipconfig`
   - Look for **IPv4 Address** under your Wi-Fi adapter (e.g. `192.168.1.15` or `10.241.46.164`).
2. **Update `mobile/src/config.ts`**:
   - Ensure `LOCAL_LAN_IP` matches your computer's IPv4 address.
   - *If using Android Studio Emulator*, set the URL to `http://10.0.2.2:5000/api`.

### Start the Expo Server

Open a terminal and run:

```powershell
# Navigate to the mobile folder
cd d:\expense\mobile

# Start Expo
npm start
```

### Testing on Your Device
1. Make sure your phone and computer are connected to the **same Wi-Fi network**.
2. Open **Expo Go** on your Android phone.
3. Tap **Scan QR code** and scan the code from your computer terminal screen.
4. The JavaScript bundle will compile and launch the **Student Expense Tracker** directly on your phone!

---

## 🧪 6. Testing Checklist for All 7 Screens

| # | Screen | What to Test | Expected Behavior |
| :- | :----- | :----------- | :---------------- |
| 1 | **Signup** | Enter name, email, password (< 6 chars) | Validation message shows password must be at least 6 characters. |
| 2 | **Signup** | Enter valid details and submit | User is registered, JWT saved to device, redirected to Dashboard. |
| 3 | **Login** | Enter wrong email or password | Error banner displays `Invalid email or password`. |
| 4 | **Login** | Enter correct credentials | Successfully logs in and restores user session. |
| 5 | **Dashboard** | View top summary card | Displays current month name (e.g. October 2026) and total in ₹. |
| 6 | **Add Expense** | Enter 0 or negative amount | Validation blocks submission with `Amount must be a positive number greater than 0`. |
| 7 | **Add Expense** | Select category (Food, Travel, Education, Shopping, Other) | Expense appears on Dashboard and History. |
| 8 | **Expense History** | Tap category filter pills (e.g., "Education") | Only education expenses appear; counter and sum update live. |
| 9 | **Edit Expense** | Tap ✏️ Edit on any expense, change title/amount, save | Changes are reflected immediately. |
| 10 | **Delete Expense**| Tap 🗑️ Delete and confirm prompt | Expense is removed from database and UI. |
| 11 | **Profile** | View details & tap Log Out | Secure token is deleted from device and app returns to Login. |

---

## 🛠️ 7. Common Errors and Solutions

### 1. `Network request failed` on Android phone
- **Cause**: Phone and PC are not on the same Wi-Fi, or Windows Firewall is blocking port 5000.
- **Solution**:
  1. Ensure both devices share the exact same Wi-Fi network.
  2. In Windows Defender Firewall, allow incoming connections on port 5000 (or temporarily set Wi-Fi network profile to "Private").
  3. Verify the IP in `mobile/src/config.ts` matches `ipconfig`.

### 2. `MongoDB Atlas is not connected yet` (HTTP 503)
- **Cause**: `MONGO_URI` is missing or has placeholder text in `backend/.env`.
- **Solution**: Follow section 3 to paste your real MongoDB Atlas connection string into `backend/.env`.

### 3. `Invalid or malformed authorization token` (HTTP 401)
- **Cause**: Session expired or token cleared.
- **Solution**: Log out and log back in to generate a fresh JWT token.

---

## 📦 8. How to Build an Installable Android APK using Expo EAS Build

With Expo EAS Build, you can compile a standalone `.apk` file that installs directly onto any Android phone without needing Expo Go or Android Studio!

### Step 1: Create a Free Expo Account
If you haven't already, sign up for a free account at [expo.dev](https://expo.dev/signup).

### Step 2: Install EAS CLI Globally
Open PowerShell and run:
```powershell
npm install -g eas-cli
```

### Step 3: Log in to EAS
```powershell
eas login
```
*(Enter your Expo username and password).*

### Step 4: Verify `mobile/eas.json`
The project already includes `mobile/eas.json` configured for direct APK generation:
```json
{
  "cli": { "appVersionSource": "remote" },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Step 5: Start the Cloud Build
Navigate to `mobile/` and run:
```powershell
cd d:\expense\mobile
eas build -p android --profile preview
```

### Step 6: Download & Install
1. EAS will ask: `Generate a new Android Keystore?` -> Press **Yes (Y)** (EAS handles code signing automatically in the cloud).
2. The build runs in Expo's cloud servers (takes ~5–10 minutes).
3. When finished, terminal will output a download URL and a QR code.
4. Scan the QR code or open the link on your Android phone to download your standalone **`StudentExpenseTracker.apk`**!
