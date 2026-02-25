# Manual Deployment Guide

## 🚨 Critical Issue: Database Mode

Your Firebase project (`gen-lang-client-0394791038`) is currently set to **Datastore Mode**.
**The application requires "Firestore Native Mode".**

### Solution

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Go to **Firestore Database**.
4. If possible, switch to "Native Mode". If the database is already created and locked in Datastore mode, you typically need to create a **new project** and select **Firestore Native** during setup.

---

## 💻 Code Deployment

Once you have a project in Native Mode, follow these steps to deploy from a standard environment (or use this machine if you fix the Node.js path issues).

### 1. Configure Environment

Enable the necessary features (Gmail):

```bash
firebase functions:config:set gmail.email="YOUR_GMAIL" gmail.password="YOUR_APP_PASSWORD"
```

### 2. Deploy Everything

```bash
firebase deploy
```

---

## 🛠 Troubleshooting "Module Not Found"

If you see `MODULE_NOT_FOUND` or path errors on Windows:

1. Delete `node_modules` and `package-lock.json` in the `functions` folder.
2. Run `npm install` inside `functions`.
3. Ensure your Node.js version matches the project (v20 or v22).
