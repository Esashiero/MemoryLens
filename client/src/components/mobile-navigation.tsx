import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Dashboard", icon: "home", href: "/" },
  { name: "Insights", icon: "query_stats", href: "/insights" },
  { name: "Activity History", icon: "history", href: "/activity" },
  { name: "Timeline", icon: "calendar_month", href: "/timeline" },
  { name: "Advanced Search", icon: "search", href: "/search" },
  { name: "Saved Searches", icon: "bookmarks", href: "/saved" },
];

const dataSourceItems = [
  { name: "Browser", icon: "public" },
  { name: "Chat", icon: "chat" },
  { name: "Files", icon: "folder" },
  { name: "Photos", icon: "photo_library" },
  { name: "Social", icon: "people" },
  { name: "Email", icon: "email" },
];

export function MobileNavigation() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-secondary-200 p-4 flex items-center justify-between dark:bg-secondary-900 dark:border-secondary-800">
      {/* Mobile Menu Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <span className="material-icons">menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex flex-col h-full bg-white dark:bg-secondary-900">
            <div className="flex items-center space-x-3 p-4 border-b border-secondary-200 dark:border-secondary-800">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                <span className="material-icons">psychology</span>
              </div>
              <h1 className="font-heading font-bold text-xl text-secondary-900 dark:text-white">MemoryAI</h1>
            </div>

            <div className="flex-1 overflow-auto py-2">
              <nav className="space-y-1 p-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
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

              <div className="mt-6 border-t border-secondary-200 pt-4 px-4 dark:border-secondary-800">
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
            </div>

            <div className="border-t border-secondary-200 p-4 dark:border-secondary-800">
              <Link 
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 transition-colors dark:text-secondary-300 dark:hover:bg-secondary-800"
              >
                <span className="material-icons">settings</span>
                <span>Settings</span>
              </Link>
              <Link 
                href="/help"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 transition-colors dark:text-secondary-300 dark:hover:bg-secondary-800"
              >
                <span className="material-icons">help_outline</span>
                <span>Help & Support</span>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Center Mobile Logo (visible on small screens) */}
      <div className="flex md:hidden items-center space-x-2">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
          <span className="material-icons text-sm">psychology</span>
        </div>
        <h1 className="font-heading font-bold text-lg text-secondary-900 dark:text-white">MemoryAI</h1>
      </div>
      
      {/* Right Side User Menu */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800" title="Notifications">
          <span className="material-icons dark:text-white">notifications_none</span>
        </button>
        
        <div className="relative">
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-secondary-300 flex items-center justify-center text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300">
              <span className="material-icons text-sm">person</span>
            </div>
            <span className="hidden md:inline font-medium text-secondary-700 dark:text-secondary-300">John Doe</span>
          </button>
        </div>
      </div>
    </header>
  );
}
