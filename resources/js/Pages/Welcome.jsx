import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: '',
            title: 'Task Management',
            description: 'Organize tasks with priorities, types, and custom workflows',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: '',
            title: 'Kanban Boards',
            description: 'Visualize your workflow with drag-and-drop boards',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: '',
            title: 'Team Collaboration',
            description: 'Manage organizations, teams, and member roles seamlessly',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: '',
            title: 'Project Insights',
            description: 'Track progress with real-time analytics and reports',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="max-w-7xl w-full">
                    {/* Hero Section */}
                    <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 mb-6 tracking-tight">
                            Tracklet
                        </h1>
                        <p className="text-2xl md:text-3xl text-gray-700 font-light mb-4">
                            Next-Gen Project Management
                        </p>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Enterprise-grade project management built with Clean Architecture principles
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-12">
                        {/* Features Showcase */}
                        <div className="lg:col-span-2 bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                             
                                Powerful Features
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`group relative p-6 rounded-xl bg-gradient-to-br  transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                                            activeFeature === index ? 'ring-4 ring-primary-400' : ''
                                        }`}
                                    >
                                        <div className="text-4xl mb-3">{feature.icon}</div>
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-700 text-sm">{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* What's Included */}
                            <div className="bg-gradient-to-br from-primary-50 to-cyan-50 rounded-xl p-6 border border-primary-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Everything You Need:</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        'Dashboard with live statistics',
                                        'Organizations & team management',
                                        'Project creation & tracking',
                                        'Kanban boards with drag-drop',
                                        'Task priorities & types',
                                        'Role-based access control'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                 
                                    Get Started
                                </h2>
                                <div className="space-y-3">
                                    <Link 
                                        href="/login" 
                                        className="group relative block w-full bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                    >
                                        <span className="flex items-center justify-between">
                                            Sign In
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        className="group block w-full bg-white hover:bg-gray-50 border-2 border-primary-600 text-primary-600 font-semibold py-4 px-6 rounded-xl transform transition-all duration-300 hover:scale-105"
                                    >
                                        <span className="flex items-center justify-between">
                                            Create Account
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </Link>
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-600 text-center mb-3">Learn More</p>
                                        <Link 
                                            href="/dashboard" 
                                            className="group block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-105 text-center"
                                        >
                                            View Dashboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-gray-600">
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                            Clean Architecture • Domain-Driven Design • Enterprise Ready
                        </p>
                        <p className="text-sm">
                            Professional project management solution for modern teams
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
