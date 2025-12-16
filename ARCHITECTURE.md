# Mini Jira - Architecture Documentation

## 🎯 Project Overview

This is a production-ready **monolithic Mini Jira application** built following **Clean Architecture** and **Domain-Driven Design (DDD)** principles. The application enables teams to manage organizations, projects, Kanban boards, and tasks with role-based access control.

## 🏗️ Architecture Decision Records (ADR)

### ADR-001: Monolithic Architecture

**Decision**: Use a monolithic architecture instead of microservices.

**Rationale**:
- Simpler deployment and operations
- Lower infrastructure costs
- Easier development for smaller teams
- No network latency between services
- Simplified transaction management
- Better suited for the scale of a Jira-like tool

**Trade-offs**:
- Harder to scale individual components independently
- Larger codebase to manage
- Deployment affects entire application

**Mitigation**: Use Clean Architecture to maintain clear boundaries that could support future extraction of services if needed.

---

### ADR-002: No REST/GraphQL APIs - Inertia.js Only

**Decision**: Use Inertia.js as the sole communication layer between frontend and backend.

**Rationale**:
- Eliminates need for separate API layer
- Maintains type safety across frontend/backend boundary
- Simplifies authentication and authorization
- Reduces boilerplate code
- Better developer experience with automatic CSRF protection
- Server-driven approach reduces client-side complexity

**Trade-offs**:
- Cannot build mobile apps without additional API layer
- Less flexible for third-party integrations
- Frontend is tightly coupled to backend routing

**When to reconsider**: If mobile apps or public API access becomes a requirement.

---

### ADR-003: Clean Architecture + Domain-Driven Design

**Decision**: Implement Clean Architecture with DDD tactical patterns.

**Rationale**:
- Separates business logic from infrastructure concerns
- Makes code more testable and maintainable
- Enables parallel development of frontend and backend teams
- Domain models reflect real business concepts
- Easier to reason about and modify

**Architecture Layers**:

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                     │
│         (Controllers, Inertia, React Pages)             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                      │
│          (Services, DTOs, Use Cases)                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                         │
│    (Entities, Value Objects, Business Logic)            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                    │
│     (Database, External Services, Framework)            │
└─────────────────────────────────────────────────────────┘
```

---

### ADR-004: Feature-Based Frontend Organization

**Decision**: Organize React components by feature/domain instead of technical role.

**Structure**:
```
Pages/
  Organization/
    Index.jsx
    Show.jsx
    Create.jsx
  Project/
    Index.jsx
    Show.jsx
  Board/
    Show.jsx
  Task/
    Show.jsx

Components/
  Organization/
    OrganizationCard.jsx
    MemberList.jsx
  Project/
    ProjectCard.jsx
  Board/
    KanbanBoard.jsx
    BoardColumn.jsx
  Task/
    TaskCard.jsx
  UI/
    Button.jsx
    Input.jsx
```

**Rationale**:
- Easier to locate feature-related code
- Better encapsulation of feature logic
- Supports parallel team development
- Aligns with domain concepts
- Reduces merge conflicts

---

### ADR-005: Repository Pattern with Eloquent

**Decision**: Use Repository pattern with Laravel Eloquent ORM.

**Rationale**:
- Abstracts data access logic from domain layer
- Makes code more testable (can mock repositories)
- Provides flexibility to change data sources
- Maintains separation of concerns

**Implementation**:
- Domain layer defines repository interfaces (contracts)
- Infrastructure layer implements repositories using Eloquent
- Services depend on repository interfaces, not implementations

---

### ADR-006: Policy-Based Authorization

**Decision**: Use Laravel Policies for authorization instead of role-checking in controllers.

**Rationale**:
- Centralizes authorization logic
- Makes permissions reusable across the application
- Supports complex authorization rules
- Integrates seamlessly with Laravel
- Easier to test and maintain

**Implementation**:
```php
// OrganizationPolicy.php
public function update(User $user, Organization $organization): bool
{
    return $organization->hasAdmin($user) 
        || $organization->owner_id === $user->id;
}

// In Controller
$this->authorize('update', $organization);
```

---

### ADR-007: Enum-Based Status/Priority/Type

**Decision**: Use PHP 8.1+ Enums for task status, priority, and type.

**Rationale**:
- Type safety at compile time
- Better IDE support and autocomplete
- Cannot use invalid values
- Encapsulates behavior related to enum values
- More maintainable than string constants

**Example**:
```php
enum TaskPriority: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case CRITICAL = 'critical';

    public function color(): string
    {
        return match($this) {
            self::LOW => 'gray',
            self::MEDIUM => 'blue',
            self::HIGH => 'orange',
            self::CRITICAL => 'red',
        };
    }
}
```

---

## 🔐 Security Considerations

### Authentication
- Laravel Fortify handles authentication flows
- Passwords hashed using bcrypt (configurable)
- CSRF protection automatic with Inertia
- Session-based authentication (configurable to token-based)

### Authorization
- Policy-based authorization for all resource access
- Role-based access control (Admin, Manager, Member)
- Organization-level and project-level permissions
- Row-level security via Eloquent scopes

### Data Protection
- Mass assignment protection via `$fillable`
- SQL injection prevention via Eloquent query builder
- XSS protection via React's automatic escaping
- Input validation via Form Requests

---

## 📊 Data Model

### Core Entities

**Organization**
- Root aggregate
- Owns projects
- Has members with roles (Admin, Manager, Member)
- Organization admin can manage all projects and members

**Project**
- Belongs to an organization
- Has its own member list
- Has boards
- Has tasks

**Board**
- Kanban board for a project
- Has columns (configurable)
- Contains tasks

**Task**
- Belongs to project and board
- Has assignee and reporter
- Has type (Story, Task, Bug, Epic)
- Has status (Backlog, Todo, In Progress, In Review, Done)
- Has priority (Low, Medium, High, Critical)

### Relationship Model

```
Organization (1) ─── (*) Projects
    │
    └─── (*) OrganizationMembers

Project (1) ─── (*) Boards
    │
    ├─── (*) ProjectMembers
    └─── (*) Tasks

Board (1) ─── (*) BoardColumns
    │
    └─── (*) Tasks

Task (1) ─── (*) TaskComments
    │
    └─── (*) TaskAttachments
```

---

## 🎨 Frontend Architecture

### Inertia.js Flow

```
User Action (Click/Submit)
    ↓
Inertia Request (AJAX)
    ↓
Laravel Controller
    ↓
Authorization Check (Policy)
    ↓
Business Logic (Service)
    ↓
Database (Repository)
    ↓
Inertia Response (Props)
    ↓
React Component Re-render
```

### State Management

**Server State**: Managed by Inertia page props
- Organizations, projects, tasks
- User data
- Flash messages

**Local State**: Managed by React hooks
- Form inputs
- UI state (modals, dropdowns)
- Drag-and-drop state

**No Global State Management**: Not needed because Inertia handles server state synchronization.

---

## 🧪 Testing Strategy

### Backend Tests

**Unit Tests**: `tests/Unit/`
- Domain logic (models, enums)
- Services (business logic)
- Policies (authorization)

**Feature Tests**: `tests/Feature/`
- Full HTTP request/response cycles
- Database interactions
- Inertia responses

**Example**:
```php
public function test_user_can_create_organization()
{
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/organizations', [
            'name' => 'Test Org',
            'slug' => 'test-org',
        ]);

    $response->assertRedirect('/organizations');
    $this->assertDatabaseHas('organizations', [
        'name' => 'Test Org',
        'owner_id' => $user->id,
    ]);
}
```

### Frontend Tests (Optional)

**Component Tests**: React Testing Library
- UI component behavior
- User interactions

**Integration Tests**: Inertia test helpers
- Page-level functionality

---

## 🚀 Performance Considerations

### Database Optimization
- Indexed foreign keys
- Eager loading relationships to avoid N+1 queries
- Database query caching where appropriate

### Frontend Optimization
- Code splitting per page via Vite
- Lazy loading of components
- Image optimization
- Asset minification and compression

### Caching Strategy
- Query result caching (Redis recommended)
- Route caching in production
- Config caching in production
- View caching in production

---

## 📈 Scalability Path

### Vertical Scaling (First)
- Increase server resources
- Add database read replicas
- Implement Redis for cache and sessions

### Horizontal Scaling (Later)
- Load balancer + multiple app servers
- Separate database server
- CDN for static assets

### Service Extraction (If Needed)
- Clean Architecture makes this easier
- Extract domains into separate services
- Add API layer for inter-service communication

---

## 🔧 Development Workflow

### Backend Development
1. Create domain model in `src/Domain/`
2. Create migration in `database/migrations/`
3. Create service in `src/Application/`
4. Create controller in `app/Http/Controllers/`
5. Create policy in `app/Policies/`
6. Add routes in `routes/web.php`
7. Write tests

### Frontend Development
1. Create page component in `resources/js/Pages/`
2. Create feature components in `resources/js/Components/`
3. Style with Tailwind CSS
4. Use Inertia helpers for forms and navigation

### Integration
- Backend returns Inertia response with props
- Frontend receives props automatically
- No manual API integration needed

---

## 📝 Best Practices

### Code Organization
✅ Keep controllers thin - delegate to services
✅ Keep services focused - single responsibility
✅ Keep domain logic in domain layer
✅ Use DTOs for complex data transfer
✅ Use Form Requests for validation

### Security
✅ Always authorize actions via policies
✅ Validate all user input
✅ Never trust client-side data
✅ Use parameterized queries (Eloquent does this)
✅ Keep sensitive config in `.env`

### Performance
✅ Eager load relationships
✅ Use database transactions for multiple writes
✅ Index foreign keys and frequently queried columns
✅ Cache expensive queries
✅ Paginate large result sets

### Maintainability
✅ Write meaningful commit messages
✅ Document complex business logic
✅ Keep functions small and focused
✅ Follow PSR-12 coding standards (PHP)
✅ Use ESLint and Prettier (JavaScript)

---

## 🎓 Learning Resources

- **Clean Architecture**: [Clean Coder Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- **Domain-Driven Design**: [DDD Reference by Eric Evans](https://www.domainlanguage.com/ddd/reference/)
- **Laravel**: [Official Documentation](https://laravel.com/docs)
- **Inertia.js**: [Official Documentation](https://inertiajs.com)
- **React**: [React Docs](https://react.dev)
- **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/docs)

---

**Architecture Version**: 1.0
**Last Updated**: December 2025
**Maintained By**: Development Team
