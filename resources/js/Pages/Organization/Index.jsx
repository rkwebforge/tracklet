import AppLayout from "@layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import Card from "@components/UI/Card";
import {
  Users,
  Building2,
  UserPlus,
  Settings,
  ChevronRight,
} from "lucide-react";
import { memo } from "react";

const OrganizationCard = memo(function OrganizationCard({ org }) {
  return (
    <Card className="h-full flex flex-col">
      {/* Clickable header area */}
      <Link
        href={`/organizations/${org.id}`}
        className="block hover:bg-gray-50 -m-6 p-6 mb-0 pb-4 rounded-t-lg transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
              {org.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">@{org.slug}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {org.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {org.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{org.members_count || 0} members</span>
          </div>
        </div>
      </Link>

      {/* Quick Actions */}
      {org.can_manage_members && (
        <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
          <Link
            href={`/organizations/${org.id}/members`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            Members
          </Link>
          <Link
            href={`/organizations/${org.id}/invitations`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </Link>
        </div>
      )}
    </Card>
  );
});

const OrganizationIndex = memo(function OrganizationIndex({ organizations }) {
  return (
    <AppLayout>
      <Head title="Organizations" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your organizations and teams
            </p>
          </div>
          <Link href="/organizations/create" className="btn-primary">
            Create Organization
          </Link>
        </div>

        {organizations && organizations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} org={org} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No organizations
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new organization.
            </p>
            <div className="mt-6">
              <Link href="/organizations/create" className="btn-primary">
                Create Organization
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
});

export default OrganizationIndex;
