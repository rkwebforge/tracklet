import { router, Link, usePage } from "@inertiajs/react";
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
  AlertCircle,
  Link2,
  Calendar,
  Users as UsersIcon,
} from "lucide-react";
import CustomSelectInput from "@/Components/UI/custom-select";

const RoleSelect = memo(function RoleSelect({ value, onChange, disabled }) {
  const roleOptions = [
    { id: "member", name: "Member" },
    { id: "manager", name: "Manager" },
    { id: "admin", name: "Admin" },
  ];

  const handleChange = (option) => {
    onChange(option.id);
  };

  return (
    <CustomSelectInput
      label="Role"
      options={roleOptions}
      value={roleOptions.find((opt) => opt.id === value)}
      onChange={handleChange}
      placeholder="Select role"
      disabled={disabled}
      translateOptions={false}
    />
  );
});

const InviteForm = memo(function InviteForm({ organizationId, onSuccess }) {
  const [role, setRole] = useState("member");
  const [expiresIn, setExpiresIn] = useState("30");
  const [maxUses, setMaxUses] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const expirationOptions = [
    { id: "1", name: "1 Day" },
    { id: "7", name: "7 Days" },
    { id: "30", name: "30 Days" },
    { id: "90", name: "90 Days" },
    { id: "never", name: "Never Expires" },
  ];

  const maxUsesOptions = [
    { id: "1", name: "Single Use" },
    { id: "5", name: "5 Uses" },
    { id: "10", name: "10 Uses" },
    { id: "unlimited", name: "Unlimited" },
  ];

  const handleGenerateLink = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrors({});
    setGeneratedLink("");

    router.post(
      `/organizations/${organizationId}/invitations`,
      {
        role,
        expires_in_days: expiresIn === "never" ? null : parseInt(expiresIn),
        max_uses: maxUses === "unlimited" ? null : parseInt(maxUses),
      },
      {
        preserveScroll: true,
        onSuccess: (response) => {
          const token = response.props.flash.invitation_token;
          const link = `${window.location.origin}/register?invite=${token}`;
          setGeneratedLink(link);
          onSuccess?.();
        },
        onError: (errors) => {
          setErrors(errors);
        },
        onFinish: () => {
          setIsGenerating(false);
        },
      },
    );
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [generatedLink]);

  const handleReset = () => {
    setGeneratedLink("");
    setCopied(false);
  };

  if (generatedLink) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-900 mb-2">
                Invitation Link Generated!
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Share this link to invite people to join your organization with{" "}
                {role} role.
              </p>
              <div className="bg-white border border-green-300 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <code className="text-xs text-gray-800 break-all flex-1">
                    {generatedLink}
                  </code>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  Generate Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleGenerateLink} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RoleSelect value={role} onChange={setRole} disabled={isGenerating} />

        <CustomSelectInput
          label="Expires In"
          options={expirationOptions}
          value={expirationOptions.find((opt) => opt.id === expiresIn)}
          onChange={(option) => setExpiresIn(option.id)}
          placeholder="Select expiration"
          disabled={isGenerating}
          translateOptions={false}
        />

        <CustomSelectInput
          label="Max Uses"
          options={maxUsesOptions}
          value={maxUsesOptions.find((opt) => opt.id === maxUses)}
          onChange={(option) => setMaxUses(option.id)}
          placeholder="Select max uses"
          disabled={isGenerating}
          translateOptions={false}
        />
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{Object.values(errors)[0]}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isGenerating}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate Invitation Link"}
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
    if (!confirm(`Are you sure you want to revoke this invitation link?`)) {
      return;
    }

    setIsDeleting(true);
    router.delete(
      `/organizations/${organizationId}/invitations/${invitation.id}`,
      {
        preserveScroll: true,
        onFinish: () => setIsDeleting(false),
      },
    );
  };

  const expiresAt = invitation.expires_at
    ? new Date(invitation.expires_at)
    : null;
  const isExpiringSoon = expiresAt
    ? expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000
    : false;

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    member: "bg-gray-100 text-gray-800",
  };

  const usesText = invitation.max_uses
    ? `${invitation.uses_count || 0}/${invitation.max_uses}`
    : `${invitation.uses_count || 0}/∞`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-gray-100 last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Link2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <span className="font-medium text-gray-900">Invitation Link</span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              roleColors[invitation.role] || roleColors.member
            }`}
          >
            {invitation.role}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span
              className={isExpiringSoon ? "text-orange-600 font-medium" : ""}
            >
              {invitation.expires_at
                ? `Expires ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Never expires"}
            </span>
            {isExpiringSoon && (
              <span className="text-orange-600 text-xs font-medium">
                (soon!)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <UsersIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Uses: <span className="font-medium">{usesText}</span>
              {invitation.max_uses &&
                invitation.uses_count >= invitation.max_uses && (
                  <span className="ml-2 text-red-600 text-xs font-medium">
                    (limit reached)
                  </span>
                )}
            </span>
          </div>

          {invitation.inviter && (
            <div className="flex items-center gap-2">
              <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Created by {invitation.inviter.name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>
              Created {new Date(invitation.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          title="Copy invitation link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
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
            <Link2 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Generate Invitation Link
            </h2>
          </div>
          <InviteForm organizationId={organization.id} />
        </Card>

        {/* How it works */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">How invitation links work:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-blue-700">
                <li>Choose the role, expiration time, and usage limit</li>
                <li>
                  Click "Generate Invitation Link" to create a shareable link
                </li>
                <li>
                  Share the link via email, chat, SMS, or any messaging
                  platform
                </li>
                <li>
                  Recipients register using the link and automatically join your
                  organization
                </li>
                <li>Track link usage and revoke links anytime</li>
              </ol>
              <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">💡 Pro Tips:</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-800 text-xs">
                  <li>Use single-use links for specific individuals</li>
                  <li>Use unlimited links for open team invitations</li>
                  <li>Set shorter expiration times for sensitive roles</li>
                  <li>Revoke links immediately after use if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Invitation Links */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Active Invitation Links
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
              <Link2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No active invitation links
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate invitation links to grow your team.
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
});

export default Invitations;
