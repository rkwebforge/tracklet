import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
  Zap,
  Sparkles,
  Rocket,
  CheckSquare,
  LayoutGrid,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Mail,
  Building2,
  FolderKanban,
  ListTodo,
  Bolt,
  Shield,
} from "lucide-react";

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
      icon: CheckSquare,
      title: "Task Management",
      description:
        "Organize tasks with priorities, types, and custom workflows",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: LayoutGrid,
      title: "Kanban Boards",
      description: "Visualize your workflow with drag-and-drop boards",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Manage organizations, teams, and member roles seamlessly",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      title: "Project Insights",
      description: "Track progress with real-time analytics and reports",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
        <div className="max-w-7xl w-full">
          {/* Hero Section */}
          <div
            className={`text-center mb-12 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-cyan-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Modern Project Management
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 mb-4 tracking-tight">
              Tracklet
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium mb-3">
              Next-Gen Project Management
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade project management built with Clean Architecture
              principles
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-6 mb-8">
            {/* Quick Actions - Left Side */}
            <div className="lg:col-span-4 space-y-6">
              {/* Call to Action Card */}
              <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 rounded-2xl shadow-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-full mb-4">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
                  <p className="text-primary-100 text-sm">
                    Join thousands managing projects better
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="block w-full bg-white hover:bg-gray-50 text-primary-600 font-semibold py-4 px-6 rounded-xl transform transition-all duration-300 hover:scale-105 text-center shadow-lg"
                  >
                    Create Free Account →
                  </Link>

                  <Link
                    href="/login"
                    className="block w-full bg-white/10 hover:bg-white/20 backdrop-blur border-2 border-white/30 text-white font-semibold py-4 px-6 rounded-xl transform transition-all duration-300 hover:scale-105 text-center"
                  >
                    Sign In
                  </Link>
                </div>
                {/* How it Works Card */}
                <div className="bg-white/90 backdrop-blur-lg mt-10 rounded-2xl border border-gray-200 shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-primary-600" />
                    How It Works
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          New User
                        </p>
                        <p className="text-xs text-gray-600">
                          Create your organization & invite team
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Got Invited
                        </p>
                        <p className="text-xs text-gray-600">
                          Register & join instantly with role
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Start Managing
                        </p>
                        <p className="text-xs text-gray-600">
                          Projects, boards, tasks & more
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Showcase - Right Side */}
            <div className="lg:col-span-8 space-y-6">
              {/* Main Features Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`group bg-white/90 backdrop-blur-lg rounded-xl border-2 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                        activeFeature === index
                          ? "border-primary-500 shadow-lg"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="mb-3">
                        <IconComponent className="w-10 h-10 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* What's Included */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                  Everything You Need
                </h3>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { icon: BarChart3, text: "Dashboard with live statistics" },
                    { icon: Target, text: "Dual onboarding paths" },
                    { icon: Mail, text: "Team invitations with roles" },
                    {
                      icon: Building2,
                      text: "Organizations & team management",
                    },
                    { icon: FolderKanban, text: "Project creation & tracking" },
                    { icon: ListTodo, text: "Kanban boards with drag-drop" },
                    { icon: Bolt, text: "Task priorities & types" },
                    { icon: Shield, text: "Role-based access control" },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <IconComponent className="w-5 h-5 text-primary-600" />
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 mt-8">
            <p className="text-base font-semibold text-gray-800 mb-2">
              Clean Architecture • Domain-Driven Design • Enterprise Ready
            </p>
            <p className="text-sm text-gray-600">
              Professional project management solution for modern teams
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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
            `,
        }}
      />
    </div>
  );
}
