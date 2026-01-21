import { Link, usePage, router } from "@inertiajs/react";
import { useMemo, useCallback, memo } from "react";

const AppLayout = memo(function AppLayout({ children }) {
  const { props, url } = usePage();
  const { auth } = props;

  // Memoize auth to prevent unnecessary re-renders
  const currentUser = useMemo(() => auth?.user || null, [auth?.user?.id]);

  // Memoize navigation links to prevent recalculation
  const navLinks = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/organizations", label: "Organizations" },
      { href: "/projects", label: "Projects" },
    ],
    [],
  );

  // Check if link is active - exact match or starts with path
  const isActive = useCallback(
    (href) => {
      if (!url) return false;
      // Exact match for dashboard, startsWith for others
      return href === "/dashboard"
        ? url === href || url === "/"
        : url.startsWith(href);
    },
    [url],
  );

  const handleLogout = useCallback((e) => {
    e.preventDefault();
    router.post("/logout");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">
                  Tracklet
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map(({ href, label }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      preserveScroll
                      preserveState
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        active
                          ? "text-gray-900 border-b-2 border-primary-600"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
});

export default AppLayout;
