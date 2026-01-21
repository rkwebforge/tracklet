# Quick Start: Using the Invitation System

## For Admins: How to Invite Users

### Step 1: Create an Invitation (Backend)

In your organization settings or member management page, you'll need to create an invitation form. Here's a working example component:

**Example: InviteMember.jsx**

```jsx
import { useForm } from "@inertiajs/react";

export default function InviteMember({ organization }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    role: "member",
  });

  const submit = (e) => {
    e.preventDefault();
    post(`/organizations/${organization.id}/invitations`, {
      onSuccess: () => {
        reset();
        alert("Invitation sent!");
      },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Email Address</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          className="input"
          required
        />
        {errors.email && <p className="text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="label">Role</label>
        <select
          value={data.role}
          onChange={(e) => setData("role", e.target.value)}
          className="input"
        >
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" disabled={processing} className="btn-primary">
        Send Invitation
      </button>
    </form>
  );
}
```

### Step 2: Share the Invitation Link

After creating an invitation, the backend returns an invitation URL:

```
https://yourapp.com/register?invite=abc123xyz456
```

Share this link with the user via:

- Email
- Slack/Teams message
- SMS
- Any communication channel

---

## For New Users: Accepting an Invitation

### Method 1: Register with Invite Link (Recommended)

1. Click the invitation link you received
2. You'll see the registration page with a blue banner: "🎉 You've been invited!"
3. Fill out the registration form
4. Click "Create Account"
5. You're automatically added to the organization!
6. Login and start working

### Method 2: Preview Invitation First

1. Modify the URL from `/register?invite=TOKEN` to `/invitations/TOKEN`
2. You'll see a detailed invitation preview showing:
   - Organization name
   - Who invited you
   - Your assigned role
3. Click "Accept Invitation & Create Account"
4. Complete registration

---

## Testing the System

### Quick Test Script

```bash
# 1. Create a test organization (as a logged-in user)
curl -X POST http://localhost:8000/setup \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Org", "description": "Testing"}' \
  --cookie "your-session-cookie"

# 2. Create an invitation
curl -X POST http://localhost:8000/organizations/1/invitations \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@test.com", "role": "member"}' \
  --cookie "your-session-cookie"

# Response will include the invitation URL
```

### Manual Testing Flow

**Test 1: Normal Registration**

```
1. Open browser in incognito mode
2. Go to http://localhost:8000/register
3. Register with any email
4. After login, verify redirect to /setup
5. Create an organization
6. Verify you're on dashboard
```

**Test 2: Invite-based Registration**

```
1. As admin, create invitation for "test@example.com"
2. Copy the invitation URL
3. Open new incognito browser
4. Paste invitation URL (/register?invite=TOKEN)
5. See invitation banner
6. Complete registration with matching email
7. Verify auto-redirect to dashboard (not /setup)
8. Verify you can see organization content
```

---

## Common Integration Points

### 1. Organization Settings Page

Add an "Invite Members" section:

```jsx
import InviteMember from "@/Components/InviteMember";

export default function OrganizationSettings({ organization }) {
  return (
    <div>
      <h2>Organization Members</h2>

      {/* Existing members list */}
      <MembersList />

      {/* Invite new members */}
      <div className="mt-8">
        <h3>Invite New Members</h3>
        <InviteMember organization={organization} />
      </div>
    </div>
  );
}
```

### 2. Email Template (Future Enhancement)

When ready to add email notifications:

```php
// In your email service
use App\Models\OrganizationInvitation;
use Illuminate\Support\Facades\Mail;

$invitation = OrganizationInvitation::create([...]);

Mail::to($invitation->email)->send(
    new OrganizationInvitationMail($invitation)
);
```

---

## API Reference

### Create Invitation

**Endpoint**: `POST /organizations/{org}/invitations`

**Body**:

```json
{
  "email": "user@example.com",
  "role": "member"
}
```

**Response** (200):

```json
{
  "success": "Invitation sent successfully!",
  "invitation_url": "https://app.com/register?invite=abc123"
}
```

**Errors**:

- User already a member → 422
- Email already has pending invitation → 422
- Not authorized → 403

---

### Accept Invitation (Logged-in Users)

**Endpoint**: `POST /invitations/{token}/accept`

**Response**: Redirect to dashboard with success message

---

### View Invitation Details

**Endpoint**: `GET /invitations/{token}`

**Response**: Inertia page showing invitation details

---

## Troubleshooting

### Problem: User registered but not in organization

**Check**:

1. Email in registration matches email in invitation
2. Token hasn't expired (7 days from creation)
3. Token hasn't been used already

**Debug**:

```php
$invitation = OrganizationInvitation::where('token', $token)->first();
dd([
    'valid' => $invitation->isValid(),
    'expired' => $invitation->isExpired(),
    'accepted' => $invitation->isAccepted(),
    'email_match' => $invitation->email === $userEmail,
]);
```

### Problem: 404 on invitation URL

**Cause**: Migration not run

**Fix**:

```bash
php artisan migrate
```

---

## Next Steps

1. ✅ Run migration: `php artisan migrate`
2. ✅ Test normal registration flow
3. ✅ Test invitation flow
4. 📧 Add email notifications (optional)
5. 🎨 Style invitation pages to match your design
6. 📊 Add invitation analytics (optional)

---

## Need Help?

Check the full documentation: `INVITATION_SYSTEM.md`
