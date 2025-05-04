import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const dataSourceItems = [
  { name: "Browser", icon: "public" },
  { name: "Chat", icon: "chat" },
  { name: "Files", icon: "folder" },
  { name: "Photos", icon: "photo_library" },
  { name: "Social", icon: "people" },
  { name: "Email", icon: "email" },
];

const navItems = [
  { name: "Dashboard", icon: "home", href: "/" },
  { name: "Insights", icon: "query_stats", href: "/insights" },
  { name: "Activity History", icon: "history", href: "/activity" },
  { name: "Timeline", icon: "calendar_month", href: "/timeline" },
  { name: "Advanced Search", icon: "search", href: "/search" },
  { name: "Saved Searches", icon: "bookmarks", href: "/saved" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-secondary-200 p-4 shadow-sm overflow-y-auto dark:bg-secondary-900 dark:border-secondary-800">
      {/* App Logo and Title */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
          <span className="material-icons">psychology</span>
        </div>
        <h1 className="font-heading font-bold text-xl text-secondary-900 dark:text-white">MemoryAI</h1>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
              location === item.href
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                : "text-secondary-700 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-800"
            )}
          >
            <span className="material-icons">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-6 border-t border-secondary-200 pt-4 dark:border-secondary-800">
        <h3 className="text-xs font-semibold text-secondary-500 uppercase mb-3 px-3 dark:text-secondary-400">
          Data Sources
        </h3>
        <div className="grid grid-cols-3 gap-2 px-3">
          {dataSourceItems.map((source) => (
            <div
              key={source.name}
              className="data-source-icon p-2 rounded-lg bg-secondary-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary-100 dark:bg-secondary-800 dark:hover:bg-secondary-700"
            >
              <span className="material-icons text-secondary-600 dark:text-secondary-400">{source.icon}</span>
              <span className="text-xs mt-1 text-secondary-700 dark:text-secondary-300">{source.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto border-t border-secondary-200 pt-4 dark:border-secondary-800">
        <Link 
          href="/settings"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
            location === "/settings"
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              : "text-secondary-700 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-800"
          )}
        >
          <span className="material-icons">settings</span>
          <span>Settings</span>
        </Link>
        <Link 
          href="/help"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
            location === "/help"
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              : "text-secondary-700 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-800"
          )}
        >
          <span className="material-icons">help_outline</span>
          <span>Help & Support</span>
        </Link>
      </div>
    </aside>
  );
}
