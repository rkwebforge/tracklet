import AppLayout from '@layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ organizations, recentProjects, recentTasks }) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome back! Here's an overview of your work.
                    </p>
                </div>

                {/* Stats */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="card">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Organizations
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {organizations?.length || 0}
                        </dd>
                    </div>
                    <div className="card">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Projects
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {recentProjects?.length || 0}
                        </dd>
                    </div>
                    <div className="card">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            My Tasks
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {recentTasks?.length || 0}
                        </dd>
                    </div>
                    <div className="card">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Completed
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Projects
                        </h2>
                        <Link href="/projects" className="text-sm text-primary-600 hover:text-primary-700">
                            View all
                        </Link>
                    </div>
                    {recentProjects && recentProjects.length > 0 ? (
                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No projects yet</p>
                    )}
                </div>

                {/* My Tasks */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            My Tasks
                        </h2>
                    </div>
                    {recentTasks && recentTasks.length > 0 ? (
                        <div className="space-y-3">
                            {recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 border border-gray-200 rounded-lg"
                                >
                                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                            {task.status}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No tasks assigned</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
