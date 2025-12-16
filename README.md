# Mini Jira - Production-Ready Monolithic Application

## 🏗️ Architecture Overview

This is a production-ready **Mini Jira** application built with **Laravel**, **React**, and **Inertia.js**, following **Clean Architecture** and **Domain-Driven Design** principles.

### Key Architectural Decisions

1. **Monolithic Architecture**: Single codebase for easier deployment and development
2. **No REST APIs**: Inertia.js handles all frontend-backend communication
3. **Clean Architecture Layers**:
   - **Domain Layer**: Pure business logic, entities, and value objects
   - **Application Layer**: Use cases, services, and DTOs
   - **Infrastructure Layer**: Database, external services, framework implementations
   - **Presentation Layer**: Controllers, Inertia pages, React components

4. **Domain-Driven Design**: Organized around business domains (Organizations, Projects, Boards, Tasks)

## 📁 Project Structure

```
mini-jira/
├── .github/
│   └── copilot-instructions.md          # Project context for development
│
├── app/                                  # Laravel HTTP Layer
│   ├── Http/
│   │   ├── Controllers/                 # Inertia Controllers
│   │   │   ├── Auth/                    # Authentication controllers
│   │   │   ├── Organization/            # Organization management
│   │   │   ├── Project/                 # Project management
│   │   │   ├── Board/                   # Board/Kanban management
│   │   │   └── Task/                    # Task/Issue management
│   │   ├── Middleware/                  # Custom middleware
│   │   └── Requests/                    # Form requests validation
│   │       ├── Organization/
│   │       ├── Project/
│   │       ├── Board/
│   │       └── Task/
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   ├── AuthServiceProvider.php      # Register policies
│   │   ├── FortifyServiceProvider.php   # Fortify configuration
│   │   └── RouteServiceProvider.php
│   └── Policies/                        # Authorization policies
│       ├── OrganizationPolicy.php
│       ├── ProjectPolicy.php
│       ├── BoardPolicy.php
│       └── TaskPolicy.php
│
├── src/                                  # Clean Architecture Layers
│   ├── Domain/                          # Domain Layer (Pure Business Logic)
│   │   ├── Organization/
│   │   │   ├── Models/
│   │   │   │   ├── Organization.php
│   │   │   │   └── OrganizationMember.php
│   │   │   ├── Enums/
│   │   │   │   └── MemberRole.php       # Admin, Manager, Member
│   │   │   └── Contracts/
│   │   │       └── OrganizationRepositoryInterface.php
│   │   ├── Project/
│   │   │   ├── Models/
│   │   │   │   ├── Project.php
│   │   │   │   └── ProjectMember.php
│   │   │   ├── Enums/
│   │   │   │   └── ProjectStatus.php
│   │   │   └── Contracts/
│   │   │       └── ProjectRepositoryInterface.php
│   │   ├── Board/
│   │   │   ├── Models/
│   │   │   │   ├── Board.php
│   │   │   │   └── BoardColumn.php
│   │   │   └── Contracts/
│   │   │       └── BoardRepositoryInterface.php
│   │   ├── Task/
│   │   │   ├── Models/
│   │   │   │   ├── Task.php
│   │   │   │   ├── TaskComment.php
│   │   │   │   └── TaskAttachment.php
│   │   │   ├── Enums/
│   │   │   │   ├── TaskPriority.php     # Low, Medium, High, Critical
│   │   │   │   ├── TaskStatus.php       # Backlog, Todo, In Progress, Done
│   │   │   │   └── TaskType.php         # Story, Task, Bug, Epic
│   │   │   └── Contracts/
│   │   │       └── TaskRepositoryInterface.php
│   │   └── User/
│   │       ├── Models/
│   │       │   └── User.php
│   │       └── Contracts/
│   │           └── UserRepositoryInterface.php
│   │
│   ├── Application/                     # Application Layer (Use Cases)
│   │   ├── Organization/
│   │   │   ├── Services/
│   │   │   │   ├── CreateOrganizationService.php
│   │   │   │   ├── UpdateOrganizationService.php
│   │   │   │   ├── DeleteOrganizationService.php
│   │   │   │   └── ManageMembersService.php
│   │   │   └── DTOs/
│   │   │       ├── CreateOrganizationDTO.php
│   │   │       └── UpdateOrganizationDTO.php
│   │   ├── Project/
│   │   │   ├── Services/
│   │   │   │   ├── CreateProjectService.php
│   │   │   │   ├── UpdateProjectService.php
│   │   │   │   ├── DeleteProjectService.php
│   │   │   │   └── ManageProjectMembersService.php
│   │   │   └── DTOs/
│   │   │       ├── CreateProjectDTO.php
│   │   │       └── UpdateProjectDTO.php
│   │   ├── Board/
│   │   │   ├── Services/
│   │   │   │   ├── CreateBoardService.php
│   │   │   │   ├── UpdateBoardService.php
│   │   │   │   ├── ManageColumnsService.php
│   │   │   │   └── ReorderTasksService.php
│   │   │   └── DTOs/
│   │   │       ├── CreateBoardDTO.php
│   │   │       └── UpdateBoardDTO.php
│   │   └── Task/
│   │       ├── Services/
│   │       │   ├── CreateTaskService.php
│   │       │   ├── UpdateTaskService.php
│   │       │   ├── DeleteTaskService.php
│   │       │   ├── AssignTaskService.php
│   │       │   ├── MoveTaskService.php
│   │       │   └── CommentService.php
│   │       └── DTOs/
│   │           ├── CreateTaskDTO.php
│   │           └── UpdateTaskDTO.php
│   │
│   └── Infrastructure/                  # Infrastructure Layer
│       ├── Persistence/
│       │   ├── Eloquent/
│       │   │   ├── OrganizationRepository.php
│       │   │   ├── ProjectRepository.php
│       │   │   ├── BoardRepository.php
│       │   │   └── TaskRepository.php
│       │   └── Seeders/
│       └── External/                    # External services integration
│
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_01_000001_create_organizations_table.php
│   │   ├── 2024_01_01_000002_create_organization_members_table.php
│   │   ├── 2024_01_01_000003_create_projects_table.php
│   │   ├── 2024_01_01_000004_create_project_members_table.php
│   │   ├── 2024_01_01_000005_create_boards_table.php
│   │   ├── 2024_01_01_000006_create_board_columns_table.php
│   │   ├── 2024_01_01_000007_create_tasks_table.php
│   │   ├── 2024_01_01_000008_create_task_comments_table.php
│   │   └── 2024_01_01_000009_create_task_attachments_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── RoleAndPermissionSeeder.php
│   │   ├── OrganizationSeeder.php
│   │   └── DemoDataSeeder.php
│   └── factories/
│       ├── OrganizationFactory.php
│       ├── ProjectFactory.php
│       ├── BoardFactory.php
│       └── TaskFactory.php
│
├── resources/                            # Frontend Resources
│   ├── js/
│   │   ├── app.jsx                      # Inertia app entry point
│   │   ├── ssr.jsx                      # SSR entry point (optional)
│   │   │
│   │   ├── Layouts/                     # Page layouts
│   │   │   ├── AppLayout.jsx            # Main app layout
│   │   │   ├── AuthLayout.jsx           # Authentication layout
│   │   │   └── GuestLayout.jsx          # Public pages layout
│   │   │
│   │   ├── Pages/                       # Inertia Pages (Feature-based)
│   │   │   ├── Auth/                    # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Index.jsx            # Main dashboard
│   │   │   ├── Organization/
│   │   │   │   ├── Index.jsx            # List organizations
│   │   │   │   ├── Show.jsx             # Organization details
│   │   │   │   ├── Create.jsx           # Create organization
│   │   │   │   ├── Edit.jsx             # Edit organization
│   │   │   │   └── Members.jsx          # Manage members
│   │   │   ├── Project/
│   │   │   │   ├── Index.jsx            # List projects
│   │   │   │   ├── Show.jsx             # Project details
│   │   │   │   ├── Create.jsx           # Create project
│   │   │   │   └── Edit.jsx             # Edit project
│   │   │   ├── Board/
│   │   │   │   ├── Show.jsx             # Kanban board view
│   │   │   │   └── Settings.jsx         # Board settings
│   │   │   └── Task/
│   │   │       ├── Show.jsx             # Task details modal
│   │   │       └── Create.jsx           # Create task modal
│   │   │
│   │   ├── Components/                  # Reusable UI Components
│   │   │   ├── UI/                      # Generic UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   └── Alert.jsx
│   │   │   ├── Organization/            # Organization-specific components
│   │   │   │   ├── OrganizationCard.jsx
│   │   │   │   ├── MemberList.jsx
│   │   │   │   └── InviteMemberForm.jsx
│   │   │   ├── Project/                 # Project-specific components
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   └── ProjectHeader.jsx
│   │   │   ├── Board/                   # Board/Kanban components
│   │   │   │   ├── KanbanBoard.jsx
│   │   │   │   ├── BoardColumn.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── ColumnHeader.jsx
│   │   │   ├── Task/                    # Task-specific components
│   │   │   │   ├── TaskDetail.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   ├── TaskComments.jsx
│   │   │   │   ├── TaskAttachments.jsx
│   │   │   │   ├── TaskPriorityBadge.jsx
│   │   │   │   └── TaskAssignee.jsx
│   │   │   └── Shared/                  # Shared components
│   │   │       ├── Navigation.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── UserMenu.jsx
│   │   │       ├── Breadcrumbs.jsx
│   │   │       └── EmptyState.jsx
│   │   │
│   │   ├── Hooks/                       # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── usePermissions.js
│   │   │   ├── useOrganization.js
│   │   │   ├── useProject.js
│   │   │   ├── useDragAndDrop.js
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── Utils/                       # Utility functions
│   │   │   ├── permissions.js
│   │   │   ├── date.js
│   │   │   ├── validation.js
│   │   │   └── format.js
│   │   │
│   │   └── Types/                       # TypeScript types (optional)
│   │       ├── organization.d.ts
│   │       ├── project.d.ts
│   │       ├── board.d.ts
│   │       ├── task.d.ts
│   │       └── user.d.ts
│   │
│   └── css/
│       └── app.css                      # Tailwind CSS entry point
│
├── routes/
│   ├── web.php                          # All Inertia routes
│   ├── auth.php                         # Authentication routes
│   └── console.php
│
├── config/
│   ├── app.php
│   ├── database.php
│   ├── fortify.php                      # Fortify configuration
│   ├── inertia.php                      # Inertia configuration
│   └── ...
│
├── tests/
│   ├── Feature/                         # Integration tests
│   │   ├── Auth/
│   │   ├── Organization/
│   │   ├── Project/
│   │   ├── Board/
│   │   └── Task/
│   └── Unit/                            # Unit tests
│       ├── Services/
│       └── Policies/
│
├── .env.example
├── .gitignore
├── artisan
├── composer.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── phpunit.xml
└── README.md
```

## 🔑 Key Design Patterns

### 1. Repository Pattern
- All database access goes through repository interfaces
- Domain layer defines contracts (interfaces)
- Infrastructure layer implements them

### 2. Service Layer Pattern
- Business logic lives in application services
- Controllers are thin, delegating to services
- Services orchestrate domain objects and repositories

### 3. Policy-Based Authorization
- Each domain entity has a Policy
- Controllers check permissions via policies
- Middleware for route-level authorization

### 4. DTO Pattern
- Data Transfer Objects for complex operations
- Type-safe data passing between layers
- Validation at the boundaries

## 🔐 Authentication & Authorization

### Authentication (Laravel Fortify + Inertia)
- Login, Registration, Password Reset
- Configured for Inertia response format
- React-based authentication pages

### Authorization (Policies & Gates)
- **OrganizationPolicy**: `view`, `create`, `update`, `delete`, `managemembers`
- **ProjectPolicy**: `view`, `create`, `update`, `delete`, `manageMembers`
- **BoardPolicy**: `view`, `update`, `manageColumns`
- **TaskPolicy**: `view`, `create`, `update`, `delete`, `assign`, `comment`

### Roles & Permissions
- **Admin**: Full control over organization and all resources
- **Manager**: Manage projects, boards, and tasks within projects
- **Member**: Create and manage own tasks, view project resources

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Installation

1. **Install PHP dependencies**
```bash
composer install
```

2. **Install Node dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** (edit `.env`)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_jira
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations and seeders**
```bash
php artisan migrate --seed
```

6. **Build frontend assets**
```bash
npm run dev
```

7. **Start development server**
```bash
php artisan serve
```

Visit: http://localhost:8000

## 📦 Core Domain Models

### Organization
- Has many projects
- Has many members (with roles)
- Owned by a user

### Project
- Belongs to an organization
- Has many boards
- Has many members
- Has tasks

### Board
- Belongs to a project
- Has many columns
- Kanban-style organization

### Task
- Belongs to a board and project
- Has assignee, reporter
- Has comments, attachments
- Has priority, status, type

## 🎯 Frontend Architecture

### Feature-Based Structure
- Each domain feature is self-contained
- Pages, components, and hooks grouped by feature
- Shared UI components in `Components/UI/`

### Inertia.js Communication
- Server renders React components via Inertia
- No REST API - direct controller to component data flow
- Automatic CSRF protection
- Form helpers with validation errors

### State Management
- Inertia page props for server state
- React hooks for local state
- No Redux/MobX needed (Inertia handles server state)

## 🧪 Testing Strategy

### Backend Tests
- **Unit Tests**: Services, policies, domain logic
- **Feature Tests**: Full request/response cycles via Inertia
- **Database Tests**: With RefreshDatabase trait

### Frontend Tests (Optional)
- Component tests with React Testing Library
- Integration tests with Inertia test helpers

## 📋 Development Workflow

### Backend Team
1. Work in `src/Domain/` for business logic
2. Implement services in `src/Application/`
3. Create controllers in `app/Http/Controllers/`
4. Define routes in `routes/web.php`
5. Return Inertia responses with data

### Frontend Team
1. Receive page component names from backend
2. Create pages in `resources/js/Pages/`
3. Build components in `resources/js/Components/`
4. Use Inertia helpers for forms and links
5. Style with Tailwind CSS

### Parallel Development
- Backend defines data contracts (props)
- Frontend develops against mock data
- Integration happens via Inertia response format

## 🔧 Configuration Files

- `config/fortify.php`: Authentication configuration
- `config/inertia.php`: Inertia.js settings
- `vite.config.js`: Frontend build configuration
- `tailwind.config.js`: Tailwind CSS customization

## 🌐 Production Deployment

### Build Steps
```bash
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment
- Set `APP_ENV=production`
- Set `APP_DEBUG=false`
- Configure proper database credentials
- Set up queue workers for background jobs
- Configure cache driver (Redis recommended)

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📝 License

MIT License

---

**Built with ❤️ following Clean Architecture & Domain-Driven Design principles**
