# VitaCare - Quick Start Guide

## 🚀 Fast Startup Instructions

### Backend (Already Running ✅)
The backend is running successfully on port 5000!

### Frontend Startup (Manual Steps)

#### Option 1: Quick Start (Recommended)
1. Open a **NEW PowerShell terminal**
2. Navigate to frontend:
   ```powershell
   cd C:\Users\subas\Desktop\Nebula\vitacare-frontend
   ```

3. Set optimization variables:
   ```powershell
   $env:GENERATE_SOURCEMAP="false"
   $env:BROWSER="none"
   ```

4. Start the server:
   ```powershell
   npm start
   ```

5. **Wait 2-3 minutes** for compilation (this is normal for first run)

6. Look for this output:
   ```
   Compiled successfully!

   You can now view vitacare-frontend in the browser.

   Local:            http://localhost:3000
   On Your Network:  http://192.168.x.x:3000
   ```

7. Open browser and go to: **http://localhost:3000**

---

#### Option 2: Check for Errors
If it's not starting, run this to see errors:
```powershell
cd C:\Users\subas\Desktop\Nebula\vitacare-frontend
npm start 2>&1 | Tee-Object -FilePath errors.txt
```

Then check `errors.txt` file for issues.

---

## 🐛 Common Issues & Solutions

### Issue 1: "Nothing happens" or "Takes too long"
**Cause**: React needs to compile 1,436 packages on first run
**Solution**: Be patient - it can take 2-5 minutes. Look for:
- `Starting the development server...`
- `Compiling...`
- CPU usage should be high during this time

### Issue 2: Port 3000 already in use
**Solution**:
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# OR use different port
$env:PORT="3001"
npm start
```

### Issue 3: Memory errors
**Solution**:
```powershell
# Increase Node memory
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm start
```

### Issue 4: Module not found errors
**Solution**:
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## ✅ How to Verify It's Working

### Check if Backend is Running:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
```
Expected: Status 200, "OK" response

### Check if Frontend Started:
Look for these terminal messages:
```
webpack compiled successfully
Compiled successfully!
```

### Check if Port is Listening:
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
```

---

## 🎯 Expected Output

When frontend starts successfully, you should see:

```
PS C:\Users\subas\Desktop\Nebula\vitacare-frontend> npm start

> vitacare-frontend@1.0.0 start
> react-scripts start

(node:XXXX) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning...
(node:XXXX) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning...

Starting the development server...

Compiled successfully!

You can now view vitacare-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

---

## 🔗 Quick Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Register Page**: http://localhost:3000/register
- **Login Page**: http://localhost:3000/login

---

## 📊 Current Status

✅ **Backend**: Running on port 5000
✅ **MongoDB**: Connected
✅ **Dependencies**: Installed (1,436 packages)
⏳ **Frontend**: Needs manual start (follow Option 1 above)

---

## 💡 Pro Tips

1. **First run is slow** - Subsequent starts will be faster (30-60 seconds)
2. **Keep terminals open** - Don't close backend terminal
3. **Watch for errors** - Red text in terminal means there's an issue
4. **Clear cache if needed**: 
   ```powershell
   npm run build
   Remove-Item -Recurse -Force build
   ```

---

Need help? Check the errors.txt file or look for red error messages in the terminal!
