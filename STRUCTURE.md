# Mini Jira - Project Structure Overview

## 🎯 Quick Reference

This document provides a bird's-eye view of the entire project structure with explanations for each major component.

---

## 📁 Complete Folder Structure

```
mini-jira/
│
├── .github/                              # GitHub configuration
│   └── copilot-instructions.md           # Project context for development
│
├── app/                                  # Laravel HTTP & Application Layer
│   ├── Http/
│   │   ├── Controllers/                  # Inertia Controllers (thin layer)
│   │   │   ├── Controller.php            # Base controller
│   │   │   ├── DashboardController.php   # Dashboard
│   │   │   ├── Auth/                     # Authentication (Fortify)
│   │   │   ├── Organization/             # Organization management
│   │   │   │   ├── OrganizationController.php
│   │   │   │   └── MemberController.php
│   │   │   ├── Project/                  # Project management
│   │   │   │   └── ProjectController.php
│   │   │   ├── Board/                    # Board management
│   │   │   │   └── BoardController.php
│   │   │   └── Task/                     # Task management
│   │   │       ├── TaskController.php
│   │   │       └── CommentController.php
│   │   │
│   │   ├── Middleware/                   # Custom middleware
│   │   │   └── HandleInertiaRequests.php # Inertia shared data
│   │   │
│   │   └── Requests/                     # Form request validation
│   │       ├── Organization/
│   │       │   ├── CreateOrganizationRequest.php
│   │       │   └── UpdateOrganizationRequest.php
│   │       ├── Project/
│   │       ├── Board/
│   │       └── Task/
│   │
│   ├── Models/                           # Application models
│   │   └── User.php                      # User model (Authenticatable)
│   │
│   ├── Policies/                         # Authorization policies
│   │   ├── OrganizationPolicy.php
│   │   ├── ProjectPolicy.php
│   │   ├── BoardPolicy.php
│   │   └── TaskPolicy.php
│   │
│   └── Providers/                        # Service providers
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php       # Register policies
│       ├── FortifyServiceProvider.php    # Fortify config
│       └── RouteServiceProvider.php
│
├── src/                                  # Clean Architecture Layers
│   ├── Domain/                           # DOMAIN LAYER (Business Logic)
│   │   ├── Organization/
│   │   │   ├── Models/
│   │   │   │   ├── Organization.php      # Organization entity
│   │   │   │   └── OrganizationMember.php
│   │   │   ├── Enums/
│   │   │   │   └── MemberRole.php        # Admin, Manager, Member
│   │   │   └── Contracts/
│   │   │       └── OrganizationRepositoryInterface.php
│   │   │
│   │   ├── Project/
│   │   │   ├── Models/
│   │   │   │   ├── Project.php           # Project entity
│   │   │   │   └── ProjectMember.php
│   │   │   ├── Enums/
│   │   │   │   └── ProjectStatus.php
│   │   │   └── Contracts/
│   │   │       └── ProjectRepositoryInterface.php
│   │   │
│   │   ├── Board/
│   │   │   ├── Models/
│   │   │   │   ├── Board.php             # Kanban board entity
│   │   │   │   └── BoardColumn.php
│   │   │   └── Contracts/
│   │   │       └── BoardRepositoryInterface.php
│   │   │
│   │   └── Task/
│   │       ├── Models/
│   │       │   ├── Task.php              # Task entity
│   │       │   ├── TaskComment.php
│   │       │   └── TaskAttachment.php
│   │       ├── Enums/
│   │       │   ├── TaskPriority.php      # Low, Medium, High, Critical
│   │       │   ├── TaskStatus.php        # Backlog, Todo, In Progress, Done
│   │       │   └── TaskType.php          # Story, Task, Bug, Epic
│   │       └── Contracts/
│   │           └── TaskRepositoryInterface.php
│   │
│   ├── Application/                      # APPLICATION LAYER (Use Cases)
│   │   ├── Organization/
│   │   │   ├── Services/
│   │   │   │   ├── CreateOrganizationService.php
│   │   │   │   ├── UpdateOrganizationService.php
│   │   │   │   ├── DeleteOrganizationService.php
│   │   │   │   └── ManageMembersService.php
│   │   │   └── DTOs/
│   │   │       ├── CreateOrganizationDTO.php
│   │   │       └── UpdateOrganizationDTO.php
│   │   │
│   │   ├── Project/
│   │   │   ├── Services/
│   │   │   │   ├── CreateProjectService.php
│   │   │   │   ├── UpdateProjectService.php
│   │   │   │   └── ManageProjectMembersService.php
│   │   │   └── DTOs/
│   │   │
│   │   ├── Board/
│   │   │   ├── Services/
│   │   │   │   ├── CreateBoardService.php
│   │   │   │   ├── ManageColumnsService.php
│   │   │   │   └── ReorderTasksService.php
│   │   │   └── DTOs/
│   │   │
│   │   └── Task/
│   │       ├── Services/
│   │       │   ├── CreateTaskService.php
│   │       │   ├── UpdateTaskService.php
│   │       │   ├── AssignTaskService.php
│   │       │   ├── MoveTaskService.php
│   │       │   └── CommentService.php
│   │       └── DTOs/
│   │
│   └── Infrastructure/                   # INFRASTRUCTURE LAYER
│       ├── Persistence/
│       │   └── Eloquent/
│       │       ├── OrganizationRepository.php
│       │       ├── ProjectRepository.php
│       │       ├── BoardRepository.php
│       │       └── TaskRepository.php
│       └── External/                     # External service integrations
│
├── bootstrap/                            # Laravel bootstrap
│   └── app.php                           # Application bootstrap
│
├── config/                               # Configuration files
│   ├── app.php                           # Application config
│   ├── database.php                      # Database config
│   ├── fortify.php                       # Authentication config
│   └── inertia.php                       # Inertia.js config
│
├── database/
│   ├── migrations/                       # Database migrations
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_01_000001_create_organizations_table.php
│   │   ├── 2024_01_01_000002_create_organization_members_table.php
│   │   ├── 2024_01_01_000003_create_projects_table.php
│   │   ├── 2024_01_01_000004_create_boards_table.php
│   │   └── 2024_01_01_000005_create_tasks_table.php
│   │
│   ├── seeders/                          # Database seeders
│   │   ├── DatabaseSeeder.php
│   │   ├── RoleAndPermissionSeeder.php
│   │   ├── OrganizationSeeder.php
│   │   └── DemoDataSeeder.php
│   │
│   └── factories/                        # Model factories
│       ├── OrganizationFactory.php
│       ├── ProjectFactory.php
│       ├── BoardFactory.php
│       └── TaskFactory.php
│
├── public/                               # Web root (public files)
│   ├── index.php                         # Application entry point
│   ├── build/                            # Compiled assets (generated)
│   └── storage/                          # Public storage symlink
│
├── resources/                            # Frontend resources
│   ├── js/
│   │   ├── app.jsx                       # Inertia app entry point
│   │   ├── bootstrap.js                  # Bootstrap Axios
│   │   │
│   │   ├── Layouts/                      # Page layouts
│   │   │   ├── AppLayout.jsx             # Authenticated app layout
│   │   │   ├── AuthLayout.jsx            # Authentication pages layout
│   │   │   └── GuestLayout.jsx           # Public pages layout
│   │   │
│   │   ├── Pages/                        # Inertia Pages (Routes → Components)
│   │   │   ├── Welcome.jsx               # Landing page
│   │   │   │
│   │   │   ├── Auth/                     # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   └── Index.jsx             # Main dashboard
│   │   │   │
│   │   │   ├── Organization/
│   │   │   │   ├── Index.jsx             # List organizations
│   │   │   │   ├── Show.jsx              # View organization
│   │   │   │   ├── Create.jsx            # Create organization
│   │   │   │   ├── Edit.jsx              # Edit organization
│   │   │   │   └── Members.jsx           # Manage members
│   │   │   │
│   │   │   ├── Project/
│   │   │   │   ├── Index.jsx             # List projects
│   │   │   │   ├── Show.jsx              # View project
│   │   │   │   ├── Create.jsx            # Create project
│   │   │   │   └── Edit.jsx              # Edit project
│   │   │   │
│   │   │   ├── Board/
│   │   │   │   ├── Show.jsx              # Kanban board view
│   │   │   │   └── Settings.jsx          # Board settings
│   │   │   │
│   │   │   └── Task/
│   │   │       ├── Show.jsx              # Task details (modal)
│   │   │       └── Create.jsx            # Create task (modal)
│   │   │
│   │   ├── Components/                   # Reusable components
│   │   │   ├── UI/                       # Generic UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   └── Alert.jsx
│   │   │   │
│   │   │   ├── Organization/             # Organization components
│   │   │   │   ├── OrganizationCard.jsx
│   │   │   │   ├── MemberList.jsx
│   │   │   │   └── InviteMemberForm.jsx
│   │   │   │
│   │   │   ├── Project/                  # Project components
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   └── ProjectHeader.jsx
│   │   │   │
│   │   │   ├── Board/                    # Board/Kanban components
│   │   │   │   ├── KanbanBoard.jsx
│   │   │   │   ├── BoardColumn.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── ColumnHeader.jsx
│   │   │   │
│   │   │   ├── Task/                     # Task components
│   │   │   │   ├── TaskDetail.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   ├── TaskComments.jsx
│   │   │   │   ├── TaskAttachments.jsx
│   │   │   │   ├── TaskPriorityBadge.jsx
│   │   │   │   └── TaskAssignee.jsx
│   │   │   │
│   │   │   └── Shared/                   # Shared components
│   │   │       ├── Navigation.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── UserMenu.jsx
│   │   │       ├── Breadcrumbs.jsx
│   │   │       └── EmptyState.jsx
│   │   │
│   │   ├── Hooks/                        # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── usePermissions.js
│   │   │   ├── useOrganization.js
│   │   │   ├── useProject.js
│   │   │   ├── useDragAndDrop.js
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── Utils/                        # Utility functions
│   │   │   ├── permissions.js
│   │   │   ├── date.js
│   │   │   ├── validation.js
│   │   │   └── format.js
│   │   │
│   │   └── Types/                        # TypeScript definitions
│   │       ├── organization.d.ts
│   │       ├── project.d.ts
│   │       ├── board.d.ts
│   │       ├── task.d.ts
│   │       └── user.d.ts
│   │
│   ├── css/
│   │   └── app.css                       # Tailwind CSS entry point
│   │
│   └── views/
│       └── app.blade.php                 # Root Inertia view template
│
├── routes/
│   ├── web.php                           # All Inertia routes
│   └── console.php                       # Artisan commands
│
├── storage/                              # Application storage
│   ├── app/                              # Application files
│   ├── framework/                        # Framework cache/sessions
│   └── logs/                             # Application logs
│
├── tests/
│   ├── Feature/                          # Integration tests
│   │   ├── Auth/
│   │   ├── Organization/
│   │   ├── Project/
│   │   ├── Board/
│   │   └── Task/
│   └── Unit/                             # Unit tests
│       ├── Services/
│       └── Policies/
│
├── .env.example                          # Environment variables template
├── .gitignore                            # Git ignore rules
├── artisan                               # Laravel artisan CLI
├── composer.json                         # PHP dependencies
├── package.json                          # Node dependencies
├── vite.config.js                        # Vite build configuration
├── tailwind.config.js                    # Tailwind CSS configuration
├── postcss.config.js                     # PostCSS configuration
├── phpunit.xml                           # PHPUnit configuration
├── README.md                             # Project overview
├── ARCHITECTURE.md                       # Architecture documentation
└── SETUP.md                              # Setup & deployment guide
```

---

## 🎯 Key Directories Explained

### `/app` - Laravel Application Layer
- **Controllers**: Thin layer that delegates to services
- **Middleware**: Request/response processing
- **Policies**: Authorization logic
- **Requests**: Form validation rules

### `/src` - Clean Architecture Layers

#### `/src/Domain` - Domain Layer
- **Purpose**: Pure business logic and entities
- **Dependencies**: None (no framework dependencies)
- **Contains**: Models, Enums, Value Objects, Interfaces

#### `/src/Application` - Application Layer
- **Purpose**: Use cases and business workflows
- **Dependencies**: Domain layer only
- **Contains**: Services, DTOs, Application logic

#### `/src/Infrastructure` - Infrastructure Layer
- **Purpose**: External concerns (database, APIs)
- **Dependencies**: All layers
- **Contains**: Repositories, External service integrations

### `/resources/js` - Frontend Application

#### `/Pages` - Inertia Pages
- **Purpose**: Route-level components
- **Pattern**: Each page corresponds to a route
- **Example**: `/organizations` → `Pages/Organization/Index.jsx`

#### `/Components` - Reusable Components
- **UI**: Generic, reusable UI components
- **Feature**: Domain-specific components (Organization, Project, Task)
- **Shared**: App-wide shared components

#### `/Layouts` - Page Layouts
- **AppLayout**: Authenticated user layout (with navigation)
- **AuthLayout**: Authentication pages layout
- **GuestLayout**: Public pages layout

### `/database` - Database Layer
- **Migrations**: Database schema definitions
- **Seeders**: Sample data for development
- **Factories**: Model factories for testing

---

## 🔄 Data Flow Example

### Creating a Task

```
User fills form (Pages/Task/Create.jsx)
    ↓
Submit via Inertia (POST /tasks)
    ↓
TaskController@store receives request
    ↓
Validates via CreateTaskRequest
    ↓
Authorizes via TaskPolicy
    ↓
Calls CreateTaskService (Application Layer)
    ↓
Service uses TaskRepository (Infrastructure Layer)
    ↓
Repository saves Task entity (Domain Layer)
    ↓
Controller returns Inertia response
    ↓
React component re-renders with new data
```

---

## 🎨 Component Hierarchy Example

```
AppLayout
├── Navigation
│   ├── Logo
│   ├── MenuItems
│   └── UserMenu
├── Sidebar (optional)
│   ├── OrganizationSelector
│   ├── ProjectList
│   └── QuickActions
└── Main Content
    ├── Breadcrumbs
    ├── PageHeader
    └── PageContent
        └── Board/Show
            ├── BoardHeader
            ├── KanbanBoard
            │   └── BoardColumn (multiple)
            │       └── TaskCard (multiple)
            │           ├── TaskPriorityBadge
            │           ├── TaskAssignee
            │           └── TaskActions
            └── TaskDetail (modal)
                ├── TaskForm
                ├── TaskComments
                └── TaskAttachments
```

---

## 🔑 Key Files Reference

| File | Purpose |
|------|---------|
| `bootstrap/app.php` | Laravel application bootstrap |
| `app/Http/Middleware/HandleInertiaRequests.php` | Shared Inertia data |
| `resources/js/app.jsx` | Inertia React entry point |
| `resources/views/app.blade.php` | Root HTML template |
| `routes/web.php` | All application routes |
| `config/fortify.php` | Authentication configuration |
| `vite.config.js` | Frontend build configuration |
| `tailwind.config.js` | CSS framework configuration |
| `composer.json` | PHP dependencies |
| `package.json` | JavaScript dependencies |

---

## 📊 Layer Dependencies

```
┌──────────────────────────────────────────────┐
│         Presentation Layer                   │
│    (Controllers, Pages, Components)          │
│    Depends on: Application, Domain           │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│         Application Layer                    │
│         (Services, Use Cases)                │
│         Depends on: Domain                   │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│         Domain Layer                         │
│    (Entities, Value Objects, Rules)          │
│         Depends on: Nothing                  │
└──────────────────────────────────────────────┘
                    ↑
┌──────────────────────────────────────────────┐
│         Infrastructure Layer                 │
│    (Repositories, External Services)         │
│    Depends on: All layers                    │
└──────────────────────────────────────────────┘
```

---

## 🚀 Quick Commands

```bash
# Development
npm run dev                 # Start Vite dev server
php artisan serve          # Start Laravel server

# Database
php artisan migrate        # Run migrations
php artisan db:seed        # Seed database
php artisan migrate:fresh --seed  # Fresh DB with data

# Cache
php artisan cache:clear    # Clear cache
php artisan config:clear   # Clear config cache
php artisan route:clear    # Clear route cache

# Testing
php artisan test           # Run all tests
php artisan test --filter OrganizationTest  # Run specific test

# Production
composer install --no-dev --optimize-autoloader
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📚 Documentation Index

1. **[README.md](README.md)** - Project overview and features
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture decisions and patterns
3. **[SETUP.md](SETUP.md)** - Installation and deployment guide
4. **This file** - Project structure reference

---

**Structure Version**: 1.0
**Last Updated**: December 2025
