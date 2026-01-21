import { useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function ShowOrganization({ organization, can = {} }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            router.delete(`/organizations/${organization.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={organization.name} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/organizations" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
                            ← Back to Organizations
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
                        {organization.description && (
                            <p className="text-gray-600 mt-2">{organization.description}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {can.update && (
                            <Link 
                                href={`/organizations/${organization.id}/edit`}
                                className="btn-secondary"
                            >
                                Edit
                            </Link>
                        )}
                        {can.delete && (
                            <button 
                                onClick={handleDelete}
                                className="btn-danger"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Organization Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Organization Details
                    </h2>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Slug</dt>
                            <dd className="mt-1 text-sm text-gray-900">{organization.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Owner</dt>
                            <dd className="mt-1 text-sm text-gray-900">{organization.owner?.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {new Date(organization.created_at).toLocaleDateString()}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Members</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {organization.members?.length || 0}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Members Section */}
                {can.manageMembers && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Members
                            </h2>
                            <Link 
                                href={`/organizations/${organization.id}/members`}
                                className="btn-primary text-sm"
                            >
                                Manage Members
                            </Link>
                        </div>
                        
                        {organization.members && organization.members.length > 0 ? (
                            <div className="space-y-2">
                                {organization.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary-600">
                                                    {member.user?.name?.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{member.user?.name}</p>
                                                <p className="text-sm text-gray-500">{member.user?.email}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                            {member.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No members yet.</p>
                        )}
                    </div>
                )}

                {/* Projects Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Projects
                        </h2>
                        <Link 
                            href="/projects/create"
                            className="btn-primary text-sm"
                        >
                            Create Project
                        </Link>
                    </div>
                    
                    {organization.projects && organization.projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {organization.projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="px-2 py-1 text-xs font-bold bg-primary-100 text-primary-600 rounded">
                                            {project.key}
                                        </span>
                                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                    </div>
                                    {project.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No projects yet. Create one to get started!</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
