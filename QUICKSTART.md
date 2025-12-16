# 🚀 Mini Jira - Quick Start Guide

Get your Mini Jira application up and running in **5 minutes**!

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] PHP 8.2+ installed (`php -v`)
- [ ] Composer installed (`composer -V`)
- [ ] Node.js 18+ installed (`node -v`)
- [ ] MySQL 8.0+ installed and running
- [ ] Git installed

## 📦 Installation

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Setup Database

**Edit `.env` file:**
```env
DB_DATABASE=mini_jira
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**Create database:**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE mini_jira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Run migrations:**
```bash
php artisan migrate
```

**Optional - Seed with demo data:**
```bash
php artisan db:seed
```

Demo credentials:
- Email: `admin@example.com`
- Password: `password`

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access Application

Open your browser: **http://localhost:8000**

---

## 🎯 What You'll See

### Without Seed Data
- Clean installation
- Registration page to create your first account
- Empty dashboard ready for your data

### With Seed Data
- Sample organization "Acme Inc"
- Sample project "Website Redesign"
- Sample board with tasks
- Test user accounts

---

## 🔑 Key Features to Try

1. **Create Organization**
   - Navigate to Organizations
   - Click "Create Organization"
   - Add team members

2. **Create Project**
   - Select an organization
   - Create a new project
   - Set up project members

3. **Create Board**
   - Open a project
   - Set up Kanban columns
   - Customize workflow

4. **Manage Tasks**
   - Create tasks with different types (Story, Task, Bug, Epic)
   - Assign priorities and statuses
   - Drag and drop between columns
   - Add comments and attachments

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment configuration |
| `routes/web.php` | Application routes |
| `resources/js/app.jsx` | Frontend entry point |
| `resources/views/app.blade.php` | HTML template |

---

## 🐛 Troubleshooting

### Issue: Database connection error
**Solution:**
```bash
# Verify MySQL is running
sudo systemctl status mysql  # Linux
brew services list  # macOS

# Check credentials in .env
```

### Issue: "Mix manifest not found"
**Solution:**
```bash
npm run dev
# Or for production:
npm run build
```

### Issue: Permission errors
**Solution:**
```bash
chmod -R 775 storage bootstrap/cache
```

### Issue: Class not found
**Solution:**
```bash
composer dump-autoload
```

---

## 📚 Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Project overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details
   - [SETUP.md](SETUP.md) - Full setup guide
   - [STRUCTURE.md](STRUCTURE.md) - Project structure

2. **Explore Code**
   - Check `src/Domain/` for business logic
   - Review `resources/js/Pages/` for frontend pages
   - Look at `app/Policies/` for authorization

3. **Run Tests**
   ```bash
   php artisan test
   ```

4. **Customize**
   - Update branding in `resources/js/Layouts/`
   - Modify colors in `tailwind.config.js`
   - Add custom features

---

## 🤝 Need Help?

- Check [SETUP.md](SETUP.md) for detailed instructions
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
- Check existing GitHub issues
- Contact the development team

---

## 🎉 You're All Set!

Your Mini Jira application is now running. Start creating organizations, projects, and tasks!

**Happy coding! 🚀**
