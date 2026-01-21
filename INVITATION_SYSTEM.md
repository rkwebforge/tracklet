# Organization & Invitation System - Implementation Guide

## Overview

This system implements a **dual-path user onboarding** approach:

1. **Direct Registration**: Users create account → Create first organization (become owner)
2. **Invite-based Registration**: Users register via invite link → Auto-join organization with assigned role

---

## System Architecture

### Database Schema

**Table**: `organization_invitations`

```
- id
- organization_id (FK)
- invited_by (FK to users)
- email
- token (unique)
- role (admin/manager/member)
- expires_at
- accepted_at (nullable)
- accepted_by (FK to users, nullable)
- timestamps
```

### User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ WITHOUT INVITATION                                            │
└───────────────────────────────────────────────────────────────┘
Register → Login → Auto-redirect to /setup → Create Organization
                                               (become owner)
                   ↓
              Dashboard (with full organization access)


┌───────────────────────────────────────────────────────────────┐
│ WITH INVITATION                                               │
└───────────────────────────────────────────────────────────────┘
Receive Link → /invitations/{token} (preview)
               ↓
Register with token (/register?invite={token})
               ↓
Auto-added to organization (with invited role)
               ↓
Login → Dashboard (within organization)
```

---

## Implementation Details

### Backend Components

#### 1. **OrganizationInvitation Model**

**Location**: `app/Models/OrganizationInvitation.php`

**Key Methods**:

- `generateToken()` - Generate unique invitation token
- `isExpired()` - Check if invitation expired
- `isAccepted()` - Check if already accepted
- `isValid()` - Check both expired and accepted status
- `markAsAccepted($user)` - Mark invitation as used

#### 2. **InvitationController**

**Location**: `app/Http/Controllers/InvitationController.php`

**Routes**:

```php
// Guest access
GET  /invitations/{token}                      - Preview invitation

// Authenticated access
POST /invitations/{token}/accept               - Accept if already logged in
GET  /organizations/{org}/invitations          - List pending invitations
POST /organizations/{org}/invitations          - Create new invitation
DELETE /organizations/{org}/invitations/{id}   - Revoke invitation
```

#### 3. **OrganizationController**

**Location**: `app/Http/Controllers/OrganizationController.php`

**Setup Routes**:

```php
GET  /setup  - Show organization creation form
POST /setup  - Create first organization
```

#### 4. **CreateNewUser Action** (Modified)

**Location**: `app/Actions/Fortify/CreateNewUser.php`

- Accepts optional `invite_token` parameter
- Auto-adds user to organization if valid token provided
- Marks invitation as accepted

#### 5. **DashboardController** (Modified)

**Location**: `app/Http/Controllers/DashboardController.php`

- Checks if user has organization membership
- Redirects to `/setup` if no organization exists
- Shows dashboard for users with organization access

---

### Frontend Components

#### 1. **Setup Page** (Onboarding)

**Location**: `resources/js/Pages/Organizations/Setup.jsx`

- First-time user experience
- Create organization form
- Shows benefits of organization creation

#### 2. **Register Page** (Updated)

**Location**: `resources/js/Pages/Auth/Register.jsx`

- Detects `invite` query parameter
- Shows invitation banner if token present
- Sends `invite_token` with registration

#### 3. **Invitation Pages**

**Location**: `resources/js/Pages/Invitation/`

- `Show.jsx` - Display invitation details
- `Expired.jsx` - Show expired message
- `AlreadyAccepted.jsx` - Show already used message

---

## Usage Guide

### For Organization Admins

#### Creating Invitations

**Option 1: Via Controller (API-like)**

```php
POST /organizations/{org}/invitations

{
    "email": "user@example.com",
    "role": "member"  // admin, manager, or member
}

Response:
{
    "success": "Invitation sent successfully!",
    "invitation_url": "https://yourapp.com/register?invite={token}"
}
```

**Option 2: Programmatically**

```php
use App\Models\OrganizationInvitation;

$invitation = OrganizationInvitation::create([
    'organization_id' => $organization->id,
    'invited_by' => auth()->id(),
    'email' => 'user@example.com',
    'token' => OrganizationInvitation::generateToken(),
    'role' => 'member',
    'expires_at' => now()->addDays(7),
]);

$inviteUrl = url('/register?invite=' . $invitation->token);
// Send $inviteUrl via email
```

### For New Users

#### Scenario 1: Direct Registration

```
1. Visit /register
2. Fill registration form
3. Submit → Auto-login
4. Redirected to /setup
5. Create organization
6. Access dashboard
```

#### Scenario 2: Via Invitation

```
1. Receive invitation link: /register?invite={token}
2. See invitation preview (optional: /invitations/{token})
3. Fill registration form (with token embedded)
4. Submit → Auto-added to organization
5. Access dashboard within organization
```

---

## Authorization & Permissions

### Organization Roles

| Role        | Can Invite | Can Manage Members | Can Create Projects | Can Delete Org |
| ----------- | ---------- | ------------------ | ------------------- | -------------- |
| **Owner**   | ✅         | ✅                 | ✅                  | ✅             |
| **Admin**   | ✅         | ✅                 | ✅                  | ❌             |
| **Manager** | ❌         | ❌                 | ✅                  | ❌             |
| **Member**  | ❌         | ❌                 | Limited             | ❌             |

### Policy Check

```php
// In OrganizationPolicy.php
public function manageMembers(User $user, Organization $organization)
{
    return $organization->owner_id === $user->id
        || $organization->hasMember($user, ['admin']);
}
```

---

## Security Considerations

1. **Token Expiration**: Invitations expire after 7 days
2. **Email Validation**: Token must match invited email
3. **Single Use**: Invitation marked as accepted after first use
4. **Authorization**: Only admins/owners can create invitations
5. **Rate Limiting**: Fortify handles registration rate limiting

---

## Testing Scenarios

### Test Case 1: Normal User Registration

```bash
1. Register without invite token
2. Verify redirect to /setup
3. Create organization
4. Verify user is owner in organization_members
5. Verify access to dashboard
```

### Test Case 2: Invited User Registration

```bash
1. Admin creates invitation
2. Visit /register?invite={token}
3. Complete registration
4. Verify auto-added to organization
5. Verify correct role assigned
6. Verify invitation marked as accepted
```

### Test Case 3: Expired Invitation

```bash
1. Create invitation with past expires_at
2. Visit /invitations/{token}
3. Verify "Expired" page shown
4. Attempt registration
5. Verify user NOT added to organization
```

---

## Future Enhancements

- [ ] Email notification system for invitations
- [ ] Bulk invitation import (CSV)
- [ ] Custom invitation messages
- [ ] Re-send invitation functionality
- [ ] Invitation analytics (opened, accepted rate)
- [ ] Multiple organizations per user
- [ ] Organization switching UI

---

## Troubleshooting

### Issue: User stuck on /setup after invited registration

**Cause**: Invitation acceptance failed silently  
**Fix**: Check if email in invitation matches registration email

### Issue: Dashboard redirect loop

**Cause**: Organization member relationship not created  
**Fix**: Verify `organizationMemberships()` relationship in User model

### Issue: Invitation token not recognized

**Cause**: Token expired or already used  
**Fix**: Create new invitation, tokens are single-use

---

## Migration Command

```bash
php artisan migrate
```

Creates: `organization_invitations` table

---

## Summary of Changes

**Backend Files Created/Modified**:

- ✅ `database/migrations/*_create_organization_invitations_table.php`
- ✅ `app/Models/OrganizationInvitation.php`
- ✅ `app/Actions/Fortify/CreateNewUser.php` (modified)
- ✅ `app/Http/Controllers/InvitationController.php`
- ✅ `app/Http/Controllers/OrganizationController.php`
- ✅ `app/Http/Controllers/DashboardController.php` (modified)
- ✅ `routes/web.php` (modified)

**Frontend Files Created/Modified**:

- ✅ `resources/js/Pages/Organizations/Setup.jsx`
- ✅ `resources/js/Pages/Auth/Register.jsx` (modified)
- ✅ `resources/js/Pages/Invitation/Show.jsx`
- ✅ `resources/js/Pages/Invitation/Expired.jsx`
- ✅ `resources/js/Pages/Invitation/AlreadyAccepted.jsx`

---

**Status**: ✅ Implementation Complete
**Migration**: ✅ Applied
**Ready for Testing**: Yes
