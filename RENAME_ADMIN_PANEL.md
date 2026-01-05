# Rename admin-panel to reception

## Issue
The `admin-panel` folder cannot be renamed automatically because it's currently in use by another process (likely your IDE or a dev server).

## Solution

### Option 1: Manual Rename (Easiest)
1. **Close Cursor/VS Code** or close the workspace
2. **Stop any running dev servers** in the `admin-panel` folder
3. **Open Windows Explorer**
4. Navigate to: `C:\Users\Ilhamov Akbar\Desktop\uchqun`
5. **Right-click** the `admin-panel` folder
6. Select **Rename**
7. Type: `reception`
8. Press **Enter**

### Option 2: Command Line (After Closing Processes)
1. Close all processes using the folder
2. Open PowerShell
3. Run:
   ```powershell
   cd "C:\Users\Ilhamov Akbar\Desktop\uchqun"
   Rename-Item -Path "admin-panel" -NewName "reception"
   ```

### Option 3: Use the Script
1. Close all processes
2. Run:
   ```powershell
   cd "C:\Users\Ilhamov Akbar\Desktop\uchqun"
   .\rename-directories.ps1
   ```

## After Renaming

After successfully renaming, you may need to:
- Restart your IDE to refresh the workspace
- Update any configuration files that reference `admin-panel`
- Update import paths in code if they reference the old folder name
- Update package.json scripts if they reference the old path
- Update any build/deployment configurations

## Verification

After renaming, you should have:
```
uchqun/
├── admin/          (formerly super-admin - still needs renaming)
├── reception/      (formerly admin-panel) ✅
├── backend/
├── parents/
└── teacher/
```

## Note
The backend already uses the `reception` role name, so this rename aligns the frontend folder with the backend naming convention.



