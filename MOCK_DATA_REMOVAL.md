# 🎭 Mock Data Setup - Easy Removal Guide

## Current Status: MOCK DATA ACTIVE ✅

The application is currently running with mock/dummy data since no database is configured. This allows you to explore the application immediately without setting up MySQL.

## What's Using Mock Data

The following files contain mock data that should be removed when connecting to a real database:

### 1. Mock Data Provider
**File**: `app/Http/Controllers/Mock/MockData.php`
- Contains all dummy data (users, organizations, projects, tasks)
- **Action**: DELETE THIS ENTIRE FILE when ready for production

### 2. Controllers Using Mock Data
Look for comments marked with `TODO: Remove when DB connected`:

**Files to update**:
- `app/Http/Controllers/DashboardController.php` - Lines with MockData import
- `app/Http/Controllers/Organization/OrganizationController.php` - Mock organizations
- `app/Http/Controllers/Project/ProjectController.php` - Mock projects
- `app/Http/Middleware/HandleInertiaRequests.php` - Mock user data

**What to do**: 
- Remove the MockData import line
- Delete the mock data sections (clearly marked with comments)
- Uncomment the real database query code below each mock section

### 3. Routes Configuration
**File**: `routes/web.php`
- Line: `Route::middleware([])->group(function () {`
- **Action**: Change `[]` to `['auth']` to enable authentication

### 4. Welcome Page (Optional)
**File**: `resources/js/Pages/Welcome.jsx`
- Shows mock data information
- **Action**: Update or remove this page as needed

## 🔄 How to Switch to Real Database

### Step 1: Configure Database
Edit your `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_jira
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Step 2: Create Database
```bash
mysql -u root -p
CREATE DATABASE mini_jira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Run Migrations
```bash
php artisan migrate
```

### Step 4: Seed Database (Optional)
```bash
php artisan db:seed
```

### Step 5: Remove Mock Data

#### 5.1 Delete Mock Data File
```bash
rm app/Http/Controllers/Mock/MockData.php
```

#### 5.2 Update DashboardController
**File**: `app/Http/Controllers/DashboardController.php`

Remove:
```php
use App\Http\Controllers\Mock\MockData; // TODO: Remove when DB connected
```

Replace the entire mock data section with the commented-out database code.

#### 5.3 Update OrganizationController
**File**: `app/Http/Controllers/Organization/OrganizationController.php`

Remove mock data import and replace with real queries.

#### 5.4 Update ProjectController
**File**: `app/Http/Controllers/Project/ProjectController.php`

Remove mock data import and replace with real queries.

#### 5.5 Update HandleInertiaRequests Middleware
**File**: `app/Http/Middleware/HandleInertiaRequests.php`

Remove the mock user section and use `$request->user()` directly.

#### 5.6 Enable Authentication Middleware
**File**: `routes/web.php`

Change:
```php
Route::middleware([])->group(function () { // Change to ['auth'] when DB connected
```

To:
```php
Route::middleware(['auth'])->group(function () {
```

### Step 6: Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
composer dump-autoload
```

### Step 7: Restart Servers
```bash
# Stop current servers (Ctrl+C in each terminal)
# Then restart:
php artisan serve
npm run dev
```

## ✅ Verification Checklist

After switching to real database, verify:

- [ ] `MockData.php` file is deleted
- [ ] No imports of `MockData` in any controller
- [ ] Authentication middleware is active (`['auth']` in routes)
- [ ] Database migrations ran successfully
- [ ] User registration works
- [ ] Login works
- [ ] Dashboard shows real data
- [ ] Can create organizations
- [ ] Can create projects
- [ ] Can create tasks

## 🎯 Quick Removal Script

You can use this bash script for quick cleanup:

```bash
#!/bin/bash
# save as remove-mock-data.sh and run: bash remove-mock-data.sh

echo "🗑️  Removing mock data..."

# Delete mock data file
rm -f app/Http/Controllers/Mock/MockData.php

echo "✅ Mock data file deleted"
echo "⚠️  Manual steps required:"
echo "   1. Remove MockData imports from controllers"
echo "   2. Uncomment database queries in controllers"
echo "   3. Enable auth middleware in routes/web.php"
echo "   4. Run: composer dump-autoload"
echo ""
echo "📖 See MOCK_DATA_REMOVAL.md for detailed instructions"
```

## 🚨 Important Notes

1. **Don't delete mock data until database is working** - You'll get errors if you remove mock data without a working database
2. **Keep backups** - The mock data file serves as example data structure
3. **Test thoroughly** - After removal, test all features to ensure database queries work
4. **Auth required** - Once you enable auth middleware, you'll need to register/login to access pages

## 📞 Need Help?

If you encounter issues:
1. Check that database credentials are correct in `.env`
2. Verify migrations ran: `php artisan migrate:status`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Ensure all cache is cleared

---

**Current Mode**: 🎭 MOCK DATA (No Database Required)
**Production Mode**: 🗄️ REAL DATABASE (After following steps above)
