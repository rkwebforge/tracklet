import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-primary-600 mb-4">
                        Tracklet
                    </h1>
                    <p className="text-xl text-gray-700">
                        Production-ready project management application
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        Built with Laravel, React, Inertia.js & Clean Architecture
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">🎉 Demo Mode Active</h2>
                            <p className="text-gray-600">
                                The application is running with <strong>mock data</strong> since no database is configured.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">What you can explore:</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>✓ Dashboard with statistics</li>
                                    <li>✓ Organizations management</li>
                                    <li>✓ Projects overview</li>
                                    <li>✓ Kanban boards with tasks</li>
                                    <li>✓ Task priorities and types</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">🚀 Quick Start</h2>
                            <div className="space-y-3">
                                <Link 
                                    href="/dashboard" 
                                    className="block w-full btn-primary text-center py-3 text-lg"
                                >
                                    View Dashboard
                                </Link>
                                <Link 
                                    href="/organizations" 
                                    className="block w-full btn-secondary text-center py-3"
                                >
                                    Browse Organizations
                                </Link>
                                <Link 
                                    href="/projects" 
                                    className="block w-full btn-secondary text-center py-3"
                                >
                                    View Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Development Mode - Mock Data Active
                    </h3>
                    <p className="text-sm text-yellow-800">
                        This application is using mock data from <code className="bg-yellow-100 px-2 py-1 rounded">app/Http/Controllers/Mock/MockData.php</code>
                    </p>
                    <p className="text-sm text-yellow-800 mt-2">
                        To connect to a real database:
                    </p>
                    <ol className="text-sm text-yellow-800 mt-2 ml-4 list-decimal space-y-1">
                        <li>Configure database in <code className="bg-yellow-100 px-1 rounded">.env</code></li>
                        <li>Run <code className="bg-yellow-100 px-1 rounded">php artisan migrate</code></li>
                        <li>Remove mock data imports from controllers</li>
                        <li>Delete <code className="bg-yellow-100 px-1 rounded">MockData.php</code> file</li>
                        <li>Enable auth middleware in <code className="bg-yellow-100 px-1 rounded">routes/web.php</code></li>
                    </ol>
                </div>

                <div className="text-center text-gray-600 text-sm">
                    <p>Built with Clean Architecture & Domain-Driven Design</p>
                    <p className="mt-2">
                        <a href="https://laravel.com" target="_blank" className="text-primary-600 hover:underline">Laravel</a>
                        {' • '}
                        <a href="https://react.dev" target="_blank" className="text-primary-600 hover:underline">React</a>
                        {' • '}
                        <a href="https://inertiajs.com" target="_blank" className="text-primary-600 hover:underline">Inertia.js</a>
                        {' • '}
                        <a href="https://tailwindcss.com" target="_blank" className="text-primary-600 hover:underline">Tailwind CSS</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
