import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useMobile();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      await apiRequest("POST", "/api/search", { query: searchTerm });
      // Additional logic for handling search results
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filterOptions = [
    { name: "Date Range", icon: "calendar_today", active: true },
    { name: "Data Sources", icon: "layers", active: false },
    { name: "Relevance", icon: "sort", active: false },
    { name: "Tags", icon: "label", active: false },
  ];

  return (
    <div className="mb-8">
      <Card className="border-none shadow-md">
        <CardContent className="p-4 md:p-6">
          <h2 className="font-heading font-bold text-2xl mb-4 text-secondary-900 dark:text-white">
            Search Your Personal Data
          </h2>
          <div className="relative">
            <div className="flex items-center relative">
              <span className="material-icons absolute left-4 text-secondary-400 dark:text-secondary-500">
                search
              </span>
              <Input
                type="text"
                placeholder="What were you working on last Tuesday?"
                className="w-full pl-12 pr-24 py-6 border-secondary-200 rounded-lg dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                className="absolute right-3 bg-primary-500 hover:bg-primary-600 text-white font-medium"
                onClick={handleSearch}
                disabled={isSearching}
              >
                Search
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="text-xs font-medium">
                <span className="text-secondary-500 dark:text-secondary-400">Filter by: </span>
              </div>
              {filterOptions.map((filter) => (
                <Button
                  key={filter.name}
                  variant="outline"
                  size="sm"
                  className={`inline-flex items-center rounded-full text-xs ${
                    filter.active 
                      ? "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800" 
                      : "bg-secondary-100 text-secondary-800 border-secondary-200 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-300 dark:border-secondary-700"
                  }`}
                >
                  <span className="material-icons text-sm mr-1">{filter.icon}</span>
                  {!isMobile && filter.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
