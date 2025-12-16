import AppLayout from '@layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import Card from '@components/UI/Card';

export default function OrganizationIndex({ organizations }) {
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
                            <Link key={org.id} href={`/organizations/${org.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {org.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                @{org.slug}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {org.description && (
                                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                            {org.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span>{org.members_count} members</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
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
}
