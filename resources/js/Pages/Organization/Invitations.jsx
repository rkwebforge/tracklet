import { router, Link, usePage, useForm } from "@inertiajs/react";
import AppLayout from "@layouts/AppLayout";
import { Head } from "@inertiajs/react";
import Card from "@components/UI/Card";
import { useState, memo, useCallback } from "react";
import {
  Mail,
  UserPlus,
  Clock,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  Send,
  AlertCircle,
} from "lucide-react";

const RoleSelect = memo(function RoleSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="input"
    >
      <option value="member">Member</option>
      <option value="manager">Manager</option>
      <option value="admin">Admin</option>
    </select>
  );
});

const InviteForm = memo(function InviteForm({ organizationId, onSuccess }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    router.post(
      `/organizations/${organizationId}/invitations`,
      { email, role },
      {
        preserveScroll: true,
        onSuccess: () => {
          setEmail("");
          setRole("member");
          onSuccess?.();
        },
        onError: (errors) => {
          setErrors(errors);
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            className={`input ${errors.email ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="sm:w-40">
          <label htmlFor="role" className="label">
            Role
          </label>
          <RoleSelect
            value={role}
            onChange={setRole}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Sending..." : "Send Invitation"}
        </button>
      </div>
    </form>
  );
});

const InvitationRow = memo(function InvitationRow({
  invitation,
  organizationId,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/register?invite=${invitation.token}`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [inviteUrl]);

  const handleRevoke = () => {
    if (
      !confirm(
        `Are you sure you want to revoke the invitation for ${invitation.email}?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    router.delete(
      `/organizations/${organizationId}/invitations/${invitation.id}`,
      {
        preserveScroll: true,
        onFinish: () => setIsDeleting(false),
      }
    );
  };

  const expiresAt = new Date(invitation.expires_at);
  const isExpiringSoon =
    expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    member: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium text-gray-900 truncate">
            {invitation.email}
          </span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              roleColors[invitation.role] || roleColors.member
            }`}
          >
            {invitation.role}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <Clock className="w-3 h-3" />
          <span className={isExpiringSoon ? "text-orange-600" : ""}>
            Expires {expiresAt.toLocaleDateString()} at{" "}
            {expiresAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isExpiringSoon && (
            <span className="text-orange-600 text-xs">(expiring soon)</span>
          )}
        </div>
        {invitation.inviter && (
          <p className="text-xs text-gray-400 mt-1">
            Invited by {invitation.inviter.name}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Copy invitation link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
        <button
          onClick={handleRevoke}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Revoke invitation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

const Invitations = memo(function Invitations({ organization, invitations }) {
  const { props } = usePage();
  const flash = props.flash || {};
  const [showInviteUrl, setShowInviteUrl] = useState(false);

  return (
    <AppLayout>
      <Head title={`Invitations - ${organization.name}`} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/organizations/${organization.id}/members`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Members
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
              <p className="mt-1 text-sm text-gray-600">
                Invite team members to join {organization.name}
              </p>
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {flash.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">{flash.success}</p>
            {flash.invitation_url && (
              <div className="mt-2">
                <button
                  onClick={() => setShowInviteUrl(!showInviteUrl)}
                  className="text-sm text-green-700 underline hover:no-underline"
                >
                  {showInviteUrl ? "Hide" : "Show"} invitation link
                </button>
                {showInviteUrl && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-900 font-mono break-all">
                    {flash.invitation_url}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {flash.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{flash.error}</p>
          </div>
        )}

        {/* Invite Form */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Send New Invitation
            </h2>
          </div>
          <InviteForm organizationId={organization.id} />
        </Card>

        {/* How it works */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How invitations work:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Enter the email address of the person you want to invite</li>
                <li>Choose a role that determines their permissions</li>
                <li>They'll receive an invitation link to register</li>
                <li>Once they register, they'll automatically join your organization</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Pending Invitations */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Invitations
              </h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {invitations?.length || 0}
              </span>
            </div>
          </div>

          {invitations && invitations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {invitations.map((invitation) => (
                <InvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  organizationId={organization.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pending invitations
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Send invitations to grow your team.
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
});

export default Invitations;
