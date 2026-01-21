# User Flow & Role-Based Access Control

## Overview

This document describes the complete user authentication flow and role-based access control (RBAC) system for the Mini Jira application.

---

## Authentication System

### Technology Stack
- **Laravel Fortify** - Authentication backend
- **Inertia.js** - Server-side rendering with React
- **Session-based authentication** - No JWT/API tokens
- **CSRF protection** - Automatic Laravel middleware

### Guest User Flow

```
Landing Page (/) → Welcome.jsx
    ↓
Login/Register Options
    ↓
Fortify Routes:
├── /login → Auth/Login.jsx
├── /register → Auth/Register.jsx
├── /forgot-password → Auth/ForgotPassword.jsx
└── /reset-password → Auth/ResetPassword.jsx
    ↓
Authentication Success
    ↓
Session Created → Redirect to /dashboard
```

### Configuration Files
- **Provider**: `app/Providers/FortifyServiceProvider.php`
- **Routes**: `routes/web.php`
- **Middleware**: `app/Http/Middleware/HandleInertiaRequests.php`

### Security Features
- Rate limiting: 60 login attempts per minute
- Two-factor authentication support
- Password reset functionality
- Session management
- CSRF token validation

---

## Role-Based Access Control (RBAC)

### Role Hierarchy

The system implements a **3-tier membership structure**:

#### 1. Organization Level
| Role | Field | Permissions |
|------|-------|-------------|
| **Owner** | `owner_id` | Full control, can delete organization |
| **Admin** | `role = 'admin'` | Manage members, projects, settings |
| **Manager** | `role = 'manager'` | Manage assigned projects |
| **Member** | `role = 'member'` | Basic access to organization projects |

**Database Table**: `organization_members`

#### 2. Project Level
| Role | Field | Permissions |
|------|-------|-------------|
| **Owner** | `owner_id` | Full control, can delete project |
| **Manager** | `role = 'manager'` | Manage project, tasks, members |
| **Member** | `role = 'member'` | Create/view tasks, comment |

**Database Table**: `project_members`

#### 3. Task Level
| Role | Field | Permissions |
|------|-------|-------------|
| **Reporter** | `reporter_id` | Created the task, can edit/delete |
| **Assignee** | `assignee_id` | Assigned to work on task, can update |

**Database Table**: `tasks`

---

## Permission Matrix

### Organization Permissions

**Policy**: `app/Policies/OrganizationPolicy.php`

| Action | Owner | Admin | Manager | Member | Any User |
|--------|-------|-------|---------|--------|----------|
| View | ✅ | ✅ | ✅ | ✅ | - |
| Create | - | - | - | - | ✅ |
| Update | ✅ | ✅ | ❌ | ❌ | - |
| Delete | ✅ | ❌ | ❌ | ❌ | - |
| Manage Members | ✅ | ✅ | ❌ | ❌ | - |

**Key Methods**:
```php
$organization->hasMember($user);  // Check membership
$organization->hasAdmin($user);   // Check admin role
```

### Project Permissions

**Policy**: `app/Policies/ProjectPolicy.php`

| Action | Org Admin | Project Owner | Manager | Member | Any Org Member |
|--------|-----------|---------------|---------|--------|----------------|
| View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ | - |
| Update | ✅ | ✅ | ✅ | ❌ | - |
| Delete | ✅ | ✅ | ❌ | ❌ | - |
| Manage Members | ✅ | ✅ | ✅ | ❌ | - |

**Key Methods**:
```php
$project->hasMember($user);       // Check project membership
$project->getMemberRole($user);   // Get user's role (manager/member)
$project->organization->hasAdmin($user); // Check org admin (inherits permissions)
```

### Task Permissions

**Policy**: `app/Policies/TaskPolicy.php`

| Action | Project Owner | Manager | Assignee | Reporter | Member |
|--------|---------------|---------|----------|----------|--------|
| View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ❌ | ✅ | ❌ |
| Comment | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assign | ✅ | ✅ | ✅ | ✅ | ✅ |
| Move | ✅ | ✅ | ✅ | ✅ | ✅ |

**Key Methods**:
```php
$task->isAssignedTo($user);       // Check if user is assignee
$task->isReportedBy($user);       // Check if user created task
$task->project->hasMember($user); // Check project membership
```

---

## User Journey Examples

### Example 1: New User Onboarding

```
Step 1: Registration
├── Visit /register
├── Fill registration form (name, email, password)
├── Fortify creates user account
├── Auto-login with session
└── Redirect to /dashboard

Step 2: Dashboard (Empty State)
├── No organizations
├── No projects
├── No tasks assigned
└── Call-to-action: "Create Organization"

Step 3: Create First Organization
├── Click "Create Organization"
├── Fill form: name, description
├── POST /organizations → OrganizationController@store
├── User becomes OWNER (owner_id = user.id)
├── No explicit membership record needed for owner
└── Redirect to /organizations/{id}

Step 4: Create First Project
├── Within organization, click "Create Project"
├── Fill form: name, key (e.g., "WEB"), description
├── POST /projects → ProjectController@store
├── User becomes project OWNER
├── Default board automatically created
└── Redirect to /projects/{id}

Step 5: Start Working
├── View Kanban board with default columns
├── Create first task → User becomes REPORTER
├── Assign task to self → User becomes ASSIGNEE
└── Move task through board columns
```

### Example 2: Team Collaboration Flow

```
Organization Admin Flow:
├── Invites team member via email
├── POST /organizations/{id}/members
├── Assign role: 'admin', 'manager', or 'member'
└── Member record created in organization_members

New Member Flow:
├── Logs in → Dashboard
├── Sees organization in their list
├── Query: Organization::whereHas('members', fn($q) => $q->where('user_id', $user->id))
├── Can view all organization projects
└── Access level depends on role

Project Manager Flow:
├── Views project (has 'manager' role in project_members)
├── Can update project settings ✅
├── Can add/remove project members ✅
├── Can create/edit/delete tasks ✅
├── Cannot delete project ❌ (only owner/org admin)
└── Manages team workload

Project Member Flow:
├── Views project (has 'member' role)
├── Can create tasks ✅
├── Can update own tasks ✅
├── Can comment on any task ✅
├── Cannot update project settings ❌
└── Cannot manage members ❌
```

### Example 3: Task Lifecycle

```
1. Task Creation
   ├── Reporter creates task
   ├── Task automatically assigned to board column
   ├── Status: 'backlog' or 'todo'
   └── Reporter has edit/delete rights

2. Task Assignment
   ├── Manager assigns to team member
   ├── Assignee receives notification
   ├── Assignee can now update task
   └── Both reporter and assignee can edit

3. Task Progress
   ├── Assignee moves task: Todo → In Progress
   ├── POST /tasks/{id}/move
   ├── Authorization: TaskPolicy checks assignment
   └── Status updated, history logged

4. Task Completion
   ├── Move to 'Done' column
   ├── Status: 'done'
   └── Remains editable by assignee/reporter/manager

5. Task Deletion
   ├── Only reporter, manager, or owner can delete
   ├── DELETE /tasks/{id}
   ├── TaskPolicy::delete checks permissions
   └── Soft delete or permanent (configurable)
```

---

## Authorization Flow

### Request Processing Pipeline

```
HTTP Request
    ↓
Route Matching (routes/web.php)
    ↓
Middleware Stack
    ├── Authentication Check (auth middleware)
    │   └── Not authenticated? → Redirect to /login
    ↓
Controller Action
    ↓
Load Resource (Model)
    ├── Organization::find($id)
    ├── Project::find($id)
    └── Task::find($id)
    ↓
Policy Authorization
    ├── $this->authorize('view', $resource)
    ├── Check user permissions via Policy
    └── Fail? → 403 Forbidden
    ↓
Business Logic Execution
    ↓
Prepare Response Data
    ├── Transform models to arrays
    ├── Add 'can' permissions for frontend
    └── Include relationships
    ↓
Inertia Response
    ├── Inertia::render('Page/Component')
    └── Pass props: resource, can, user, etc.
    ↓
React Component Renders
    ├── Receives props
    ├── Conditionally shows UI based on 'can' object
    └── User sees authorized interface
```

### Policy Enforcement Points

#### 1. Controller Level
```php
// Example: ProjectController@update
public function update(Request $request, Project $project)
{
    // Automatically checks ProjectPolicy::update
    $this->authorize('update', $project);
    
    // Validation
    $validated = $request->validate([...]);
    
    // Business logic
    $project->update($validated);
    
    return redirect()->route('projects.show', $project);
}
```

#### 2. Frontend Level (React)
```jsx
// Example: Project/Show.jsx
export default function Show({ project, can }) {
    return (
        <div>
            <h1>{project.name}</h1>
            
            {can.update && (
                <Link href={route('projects.edit', project.id)}>
                    Edit Project
                </Link>
            )}
            
            {can.delete && (
                <button onClick={handleDelete}>
                    Delete Project
                </button>
            )}
            
            {can.manageMembers && (
                <button onClick={showMembersModal}>
                    Manage Members
                </button>
            )}
        </div>
    );
}
```

#### 3. Backend Props Building
```php
// Example: ProjectController@show
public function show(Request $request, Project $project)
{
    $this->authorize('view', $project);
    
    return Inertia::render('Project/Show', [
        'project' => $project->load(['organization', 'owner', 'boards.tasks']),
        'can' => [
            'update' => $request->user()->can('update', $project),
            'delete' => $request->user()->can('delete', $project),
            'manageMembers' => $request->user()->can('manageMembers', $project),
        ],
    ]);
}
```

---

## Database Schema

### Membership Tables

```sql
-- Organization Membership
CREATE TABLE organization_members (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT FOREIGN KEY,
    user_id BIGINT FOREIGN KEY,
    role VARCHAR(50) DEFAULT 'member',  -- 'admin', 'manager', 'member'
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- Project Membership
CREATE TABLE project_members (
    id BIGINT PRIMARY KEY,
    project_id BIGINT FOREIGN KEY,
    user_id BIGINT FOREIGN KEY,
    role VARCHAR(50) DEFAULT 'member',  -- 'manager', 'member'
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- Tasks (with assignments)
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY,
    project_id BIGINT FOREIGN KEY,
    board_id BIGINT FOREIGN KEY,
    reporter_id BIGINT FOREIGN KEY,      -- Who created it
    assignee_id BIGINT FOREIGN KEY NULL, -- Who is working on it
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50),      -- 'story', 'task', 'bug', 'epic'
    status VARCHAR(50),    -- 'backlog', 'todo', 'in_progress', 'in_review', 'done'
    priority VARCHAR(50),  -- 'low', 'medium', 'high', 'critical'
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Relationship Diagram

```
User
 ├──> owns Organization (owner_id)
 ├──> member of Organizations (organization_members)
 ├──> owns Projects (owner_id)
 ├──> member of Projects (project_members)
 ├──> reports Tasks (reporter_id)
 └──> assigned to Tasks (assignee_id)

Organization
 ├──> has many Members (organization_members)
 ├──> has many Projects
 └──> has one Owner (User)

Project
 ├──> belongs to Organization
 ├──> has many Members (project_members)
 ├──> has many Boards
 ├──> has many Tasks
 └──> has one Owner (User)

Board
 ├──> belongs to Project
 └──> has many Tasks

Task
 ├──> belongs to Project
 ├──> belongs to Board
 ├──> has one Reporter (User)
 └──> has one Assignee (User, nullable)
```

---

## Access Control Rules

### Rule 1: Hierarchical Inheritance
Organization admins inherit permissions over all organization projects, even if not explicitly added as project members.

```php
// ProjectPolicy::update
public function update(User $user, Project $project): bool
{
    return $project->owner_id === $user->id 
        || $project->getMemberRole($user) === 'manager'
        || $project->organization->hasAdmin($user); // ✅ Inherits from org
}
```

### Rule 2: Ownership Supremacy
Resource owners (owner_id) have full control regardless of membership roles.

```php
// OrganizationPolicy::delete
public function delete(User $user, Organization $organization): bool
{
    return $organization->owner_id === $user->id; // Only owner can delete
}
```

### Rule 3: Task-Level Flexibility
Both assignee and reporter can update tasks, plus managers/owners.

```php
// TaskPolicy::update
public function update(User $user, Task $task): bool
{
    return $task->isAssignedTo($user)     // ✅ Assignee
        || $task->isReportedBy($user)     // ✅ Reporter
        || $task->project->getMemberRole($user) === 'manager'
        || $task->project->owner_id === $user->id;
}
```

### Rule 4: Organization Membership for Visibility
Any organization member can view all organization projects, even without explicit project membership.

```php
// ProjectPolicy::view
public function view(User $user, Project $project): bool
{
    return $project->hasMember($user) 
        || $project->owner_id === $user->id
        || $project->organization->hasMember($user); // ✅ Org member can view
}
```

---

## Security Best Practices

### 1. Always Use Policies
Never check permissions manually in controllers. Always use `$this->authorize()` or `Gate::allows()`.

**❌ Bad Practice:**
```php
if ($user->id === $project->owner_id) {
    $project->update($data);
}
```

**✅ Good Practice:**
```php
$this->authorize('update', $project);
$project->update($data);
```

### 2. Pass Permissions to Frontend
Always include a `can` object in Inertia responses.

```php
return Inertia::render('Project/Show', [
    'project' => $project,
    'can' => [
        'update' => $user->can('update', $project),
        'delete' => $user->can('delete', $project),
    ],
]);
```

### 3. Validate Before Authorize
Validate input before checking authorization to prevent information leakage.

```php
// Validate first
$validated = $request->validate([...]);

// Then authorize
$this->authorize('update', $project);

// Then execute
$project->update($validated);
```

### 4. Use Route Model Binding
Let Laravel automatically fetch and authorize models.

```php
// routes/web.php
Route::put('/projects/{project}', [ProjectController::class, 'update']);

// Controller automatically receives Project instance
public function update(Request $request, Project $project)
{
    // Laravel resolved {project} parameter
    $this->authorize('update', $project);
}
```

---

## Common Authorization Patterns

### Pattern 1: Check Multiple Permissions
```php
if ($user->can('update', $project) || $user->can('manageMembers', $project)) {
    // User has at least one permission
}
```

### Pattern 2: Conditional UI Rendering
```jsx
{(can.update || can.delete) && (
    <div className="actions">
        {can.update && <EditButton />}
        {can.delete && <DeleteButton />}
    </div>
)}
```

### Pattern 3: Bulk Authorization
```php
$projects = Project::all()->filter(function ($project) use ($user) {
    return $user->can('view', $project);
});
```

### Pattern 4: Authorization in Queries
```php
// Dashboard: Load only accessible projects
$projects = Project::whereHas('organization.members', function($query) use ($user) {
    $query->where('user_id', $user->id);
})->orWhereHas('members', function($query) use ($user) {
    $query->where('user_id', $user->id);
})->get();
```

---

## Troubleshooting

### Issue: 403 Forbidden Error
**Cause**: Policy method returned false  
**Debug**:
```php
// Check what authorize() is checking
dd($user->can('update', $project));

// Check user's role
dd($project->getMemberRole($user));

// Check membership
dd($project->hasMember($user));
```

### Issue: User Not Seeing Resources
**Cause**: Not a member or missing relationship  
**Fix**: Ensure user is added to organization_members or project_members

### Issue: Frontend Shows Edit Button but Backend Denies
**Cause**: Frontend `can` object out of sync with backend policy  
**Fix**: Always regenerate `can` object from policy checks

---

## Testing Authorization

### Unit Test Example
```php
public function test_manager_can_update_project()
{
    $user = User::factory()->create();
    $project = Project::factory()->create();
    
    // Add user as manager
    $project->members()->create([
        'user_id' => $user->id,
        'role' => 'manager',
    ]);
    
    $this->assertTrue($user->can('update', $project));
}

public function test_member_cannot_delete_project()
{
    $user = User::factory()->create();
    $project = Project::factory()->create();
    
    $project->members()->create([
        'user_id' => $user->id,
        'role' => 'member',
    ]);
    
    $this->assertFalse($user->can('delete', $project));
}
```

---

## Summary

### Key Takeaways

✅ **Session-based authentication** - Secure, no token exposure  
✅ **Policy-based authorization** - Centralized permission logic  
✅ **Hierarchical roles** - Organization admins inherit project permissions  
✅ **Multiple membership levels** - Organization, Project, Task  
✅ **Flexible task permissions** - Assignee and reporter both have edit rights  
✅ **Frontend-backend sync** - `can` object ensures UI matches permissions  
✅ **Cascade deletes** - Data integrity maintained  
✅ **Rate limiting** - Prevents abuse  

### Access Level Summary

| Role | Scope | Primary Capabilities |
|------|-------|---------------------|
| **Organization Owner** | Organization-wide | Full control, can delete organization |
| **Organization Admin** | Organization-wide | Manage projects, members, settings |
| **Project Owner** | Project-specific | Full control, can delete project |
| **Project Manager** | Project-specific | Manage tasks, members, settings |
| **Project Member** | Project-specific | Create/view tasks, comment |
| **Task Assignee** | Task-specific | Update task status and details |
| **Task Reporter** | Task-specific | Edit/delete own created tasks |

---

## Related Files

- **Policies**: `app/Policies/`
- **Models**: `src/Domain/*/Models/`
- **Controllers**: `app/Http/Controllers/`
- **Routes**: `routes/web.php`
- **Fortify Config**: `app/Providers/FortifyServiceProvider.php`
- **Frontend Auth**: `resources/js/Pages/Auth/`

---

**Last Updated**: December 24, 2025
