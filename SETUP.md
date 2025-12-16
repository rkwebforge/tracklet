# Mini Jira - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** 8.2 or higher
- **Composer** 2.x
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher (or PostgreSQL 13+)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url> mini-jira
cd mini-jira
```

### 2. Install PHP Dependencies

```bash
composer install
```

This will install:
- Laravel framework
- Inertia.js Laravel adapter
- Laravel Fortify for authentication
- Other backend dependencies

### 3. Install Frontend Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- Inertia.js React adapter
- Vite for build tooling
- Tailwind CSS for styling
- Other frontend dependencies

### 4. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 5. Configure Database

Edit `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_jira
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE mini_jira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 6. Run Migrations

```bash
php artisan migrate
```

This creates all necessary tables:
- users
- organizations
- organization_members
- projects
- project_members
- boards
- board_columns
- tasks
- task_comments
- task_attachments

### 7. Seed Database (Optional)

```bash
php artisan db:seed
```

This will create:
- Demo users
- Sample organizations
- Sample projects with boards
- Sample tasks

### 8. Build Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

### 9. Start Development Server

```bash
php artisan serve
```

Visit: **http://localhost:8000**

---

## 🛠️ Development Setup

### Running in Development Mode

**Terminal 1** - Backend Server:
```bash
php artisan serve
```

**Terminal 2** - Frontend Build (Hot Module Replacement):
```bash
npm run dev
```

This setup enables:
- Hot module replacement for React components
- Automatic CSS rebuilding with Tailwind
- Fast refresh without page reload

### Database Seeding

Create a user and sample data:

```bash
php artisan db:seed --class=DemoDataSeeder
```

Default demo credentials:
- **Email**: admin@example.com
- **Password**: password

### Running Tests

**All tests**:
```bash
php artisan test
```

**Specific test suite**:
```bash
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
```

**With coverage**:
```bash
php artisan test --coverage
```

---

## 🔧 Configuration

### Fortify Configuration

Laravel Fortify handles authentication. The configuration is in `config/fortify.php`.

Key features enabled:
- Registration
- Login
- Password reset
- Email verification (optional)

To customize authentication views, check:
- `resources/js/Pages/Auth/Login.jsx`
- `resources/js/Pages/Auth/Register.jsx`
- `resources/js/Pages/Auth/ForgotPassword.jsx`

### Inertia Configuration

Inertia.js is configured in:
- Backend: `app/Http/Middleware/HandleInertiaRequests.php`
- Frontend: `resources/js/app.jsx`

Shared data (available to all pages):
- `auth.user` - Current authenticated user
- `flash.success` - Success messages
- `flash.error` - Error messages

### Tailwind Configuration

Customize Tailwind in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "No application encryption key has been specified"

**Solution**:
```bash
php artisan key:generate
```

### Issue: "Class not found"

**Solution**: Regenerate autoload files
```bash
composer dump-autoload
```

### Issue: Database connection errors

**Solution**: 
1. Verify database credentials in `.env`
2. Ensure MySQL server is running
3. Check if database exists

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: Frontend not updating

**Solution**:
1. Clear browser cache
2. Restart Vite dev server
3. Clear Laravel view cache:

```bash
php artisan view:clear
php artisan cache:clear
```

### Issue: Permission denied errors

**Solution**: Set correct permissions
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Issue: npm install fails

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🚢 Production Deployment

### 1. Optimize Application

```bash
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Environment Configuration

Update `.env` for production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Use strong random key
APP_KEY=

# Production database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=mini_jira
DB_USERNAME=production_user
DB_PASSWORD=strong_password

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 3. Web Server Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mini-jira/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/mini-jira/public

    <Directory /var/www/mini-jira/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 4. SSL Certificate

Install SSL certificate with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 5. Queue Worker

For background jobs, set up supervisor:

```bash
sudo apt install supervisor
```

Create `/etc/supervisor/conf.d/mini-jira-worker.conf`:

```ini
[program:mini-jira-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/mini-jira/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/mini-jira/storage/logs/worker.log
```

Start supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start mini-jira-worker:*
```

### 6. Task Scheduling

Add to crontab:

```bash
crontab -e
```

Add line:

```cron
* * * * * cd /var/www/mini-jira && php artisan schedule:run >> /dev/null 2>&1
```

---

## 📊 Monitoring & Logging

### Application Logs

Logs are stored in `storage/logs/laravel.log`

View logs:
```bash
tail -f storage/logs/laravel.log
```

### Performance Monitoring

Install Laravel Telescope for development:

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access at: `http://your-app.com/telescope`

### Error Tracking

Consider integrating:
- **Sentry** for error tracking
- **New Relic** for APM
- **DataDog** for infrastructure monitoring

---

## 🔄 Backup Strategy

### Database Backup

```bash
# Backup
mysqldump -u username -p mini_jira > backup_$(date +%Y%m%d).sql

# Restore
mysql -u username -p mini_jira < backup_20241216.sql
```

### Automated Backups

Use Laravel Backup package:

```bash
composer require spatie/laravel-backup
php artisan backup:run
```

---

## 🤝 Contributing

### Code Style

**PHP**: Follow PSR-12 standards

```bash
composer require --dev laravel/pint
./vendor/bin/pint
```

**JavaScript**: Use ESLint and Prettier

```bash
npm run lint
npm run format
```

### Commit Messages

Follow conventional commits:

```
feat: add task drag and drop
fix: resolve board column sorting issue
docs: update README with deployment instructions
refactor: extract task card component
test: add organization policy tests
```

---

## 📚 Additional Resources

- [Project README](README.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [API Documentation](#) (if applicable)
- [Deployment Guide](#)

---

**Need Help?**
- Check existing issues on GitHub
- Read the [FAQ](#)
- Contact the development team

---

**Last Updated**: December 2025
