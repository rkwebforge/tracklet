import { router, Link, usePage } from "@inertiajs/react";
import AppLayout from "@layouts/AppLayout";
import { Head } from "@inertiajs/react";
import Card from "@components/UI/Card";
import { useState, memo } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Crown,
  ChevronLeft,
} from "lucide-react";
import CustomSelectInput from "@/Components/UI/custom-select";

const RoleBadge = memo(function RoleBadge({ role }) {
  const roleStyles = {
    owner: "bg-yellow-100 text-yellow-800 border-yellow-200",
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    manager: "bg-blue-100 text-blue-800 border-blue-200",
    member: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const roleIcons = {
    owner: Crown,
    admin: Shield,
    manager: Users,
    member: Users,
  };

  const Icon = roleIcons[role] || Users;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${
        roleStyles[role] || roleStyles.member
      }`}
    >
      <Icon className="w-3 h-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
});

const MemberRow = memo(function MemberRow({
  member,
  organizationId,
  canManage,
  isOwner,
  isOrgOwner,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member.role);

  const handleRemove = () => {
    if (
      !confirm(
        `Are you sure you want to remove ${member.user?.name} from the organization?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    router.delete(
      `/organizations/${organizationId}/members/${member.user?.id}`,
      {
        preserveScroll: true,
        onFinish: () => setIsDeleting(false),
      },
    );
  };

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    router.put(
      `/organizations/${organizationId}/members/${member.user?.id}`,
      { role: newRole },
      {
        preserveScroll: true,
        onSuccess: () => setIsEditingRole(false),
        onError: () => setSelectedRole(member.role),
      },
    );
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-primary-600">
            {member.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{member.user?.name}</p>
            {isOwner && <span className="text-xs text-gray-500">(You)</span>}
          </div>
          <p className="text-sm text-gray-500">{member.user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {canManage && !isOrgOwner && !isOwner ? (
          <div className="w-40">
            <CustomSelectInput
              options={[
                { id: "member", name: "Member" },
                { id: "manager", name: "Manager" },
                { id: "admin", name: "Admin" },
              ]}
              value={{
                id: selectedRole,
                name:
                  selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1),
              }}
              onChange={(option) => handleRoleChange(option.id)}
              placeholder="Select role"
              translateOptions={false}
            />
          </div>
        ) : (
          <RoleBadge role={member.role} />
        )}
        {canManage && !isOrgOwner && !isOwner && (
          <button
            onClick={handleRemove}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Remove member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

const Members = memo(function Members({ organization, members }) {
  const { props } = usePage();
  const currentUserId = props.auth?.user?.id;
  const flash = props.flash || {};

  // Check if current user can manage members (owner or admin)
  const currentMember = members?.find((m) => m.user?.id === currentUserId);
  const canManage =
    organization.owner_id === currentUserId || currentMember?.role === "admin";

  return (
    <AppLayout>
      <Head title={`Members - ${organization.name}`} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/organizations/${organization.id}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {organization.name}
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Members</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage members of {organization.name}
              </p>
            </div>

            {canManage && (
              <Link
                href={`/organizations/${organization.id}/invitations`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite Members
              </Link>
            )}
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

        {/* Owner Section */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Owner</h2>
          </div>
          <div className="flex items-center gap-4 py-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-sm font-medium text-yellow-600">
                {organization.owner?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">
                  {organization.owner?.name}
                </p>
                {organization.owner?.id === currentUserId && (
                  <span className="text-xs text-gray-500">(You)</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {organization.owner?.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Members Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Team Members
              </h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {members?.length || 0}
              </span>
            </div>
          </div>

          {members && members.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {members.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  organizationId={organization.id}
                  canManage={canManage}
                  isOwner={member.user?.id === currentUserId}
                  isOrgOwner={member.user?.id === organization.owner_id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No members yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Invite team members to collaborate on projects.
              </p>
              {canManage && (
                <div className="mt-4">
                  <Link
                    href={`/organizations/${organization.id}/invitations`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Invitations
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Role Legend */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Role Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <RoleBadge role="admin" />
              <p className="mt-2 text-gray-600">
                Can manage members, projects, and organization settings
              </p>
            </div>
            <div>
              <RoleBadge role="manager" />
              <p className="mt-2 text-gray-600">
                Can manage projects and tasks
              </p>
            </div>
            <div>
              <RoleBadge role="member" />
              <p className="mt-2 text-gray-600">
                Can view and work on assigned tasks
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
});

export default Members;
