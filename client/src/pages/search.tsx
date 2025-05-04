import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineItem } from "@shared/schema";
import { formatDateTime, getSourceIcon, getSourceColor, cn } from "@/lib/utils";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchView, setSearchView] = useState<"list" | "timeline">("list");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const { data: searchResults, isLoading } = useQuery<TimelineItem[]>({
    queryKey: ['/api/search', { query: searchTerm, source: sourceFilter, dateRange }],
    enabled: searchTerm.length > 0,
  });

  const dateSortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "browser", label: "Browser History" },
    { value: "chat", label: "Chat History" },
    { value: "files", label: "Files" },
    { value: "email", label: "Email" },
    { value: "photos", label: "Photos" },
    { value: "social", label: "Social Media" },
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query
  };

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary-50 dark:bg-secondary-900 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-secondary-900 dark:text-white mb-2">Advanced Search</h1>
        <p className="text-secondary-600 dark:text-secondary-400">Search and filter across all your digital activities</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
                  search
                </span>
                <Input
                  type="text"
                  placeholder="Search your digital activities..."
                  className="w-full pl-10 border-secondary-200 dark:border-secondary-700 dark:bg-secondary-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white">
                Search
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Source</label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Sort By</label>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateSortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading font-semibold text-xl text-secondary-900 dark:text-white">
            {searchResults 
              ? `Search Results (${searchResults.length})` 
              : searchTerm.length > 0 && !isLoading 
                ? "No results found" 
                : "Search Results"}
          </h2>
          
          <Tabs value={searchView} onValueChange={(v) => setSearchView(v as "list" | "timeline")}>
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <span className="material-icons text-sm">view_list</span>
                List
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-1">
                <span className="material-icons text-sm">timeline</span>
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-md bg-secondary-100 dark:bg-secondary-700 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-secondary-100 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-secondary-100 dark:bg-secondary-700 rounded mb-3"></div>
                    <div className="h-4 w-full bg-secondary-100 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-secondary-100 dark:bg-secondary-700 rounded mb-3"></div>
                    <div className="flex">
                      <div className="h-6 w-20 bg-secondary-100 dark:bg-secondary-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : searchTerm.length > 0 && (!searchResults || searchResults.length === 0) ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
              <span className="material-icons text-secondary-400 dark:text-secondary-500 text-3xl">search_off</span>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">No results found</h3>
            <p className="text-secondary-600 dark:text-secondary-400 max-w-md mx-auto">
              We couldn't find any matches for "{searchTerm}". Try adjusting your search terms or filters.
            </p>
          </Card>
        ) : searchResults ? (
          <TabsContent value="list" className="space-y-4 mt-0">
            {searchResults.map((result) => {
              const sourceIcon = getSourceIcon(result.source);
              const sourceColor = getSourceColor(result.source);
              
              return (
                <Card key={result.id} className="p-4 bg-white dark:bg-secondary-800 hover:shadow-md transition-all">
                  <div className="flex items-start">
                    <div className={cn("w-10 h-10 rounded-md flex items-center justify-center mr-4", sourceColor.bg, sourceColor.text)}>
                      <span className="material-icons">{sourceIcon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                        <h3 className="font-medium text-secondary-900 dark:text-white">{result.title}</h3>
                        <span className="text-xs text-secondary-500 dark:text-secondary-400">{formatDateTime(result.timestamp)}</span>
                      </div>
                      <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">{result.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", 
                          `bg-${sourceColor.bg.split('-')[1]}-50 text-${sourceColor.text.split('-')[1]}-700`,
                          `dark:bg-${sourceColor.bg.split('-')[1]}-900 dark:text-${sourceColor.text.split('-')[1]}-300`
                        )}>
                          <span className="material-icons text-xs mr-1">{sourceIcon}</span>
                          {result.source}
                        </span>
                        {result.tags && result.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        ) : (
          searchTerm.length === 0 && (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                <span className="material-icons text-secondary-400 dark:text-secondary-500 text-3xl">search</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">Start searching</h3>
              <p className="text-secondary-600 dark:text-secondary-400 max-w-md mx-auto">
                Enter keywords above to search through your digital activities.
              </p>
            </Card>
          )
        )}

        <TabsContent value="timeline" className="mt-0">
          {searchResults && searchResults.length > 0 && (
            <div className="relative pl-8 space-y-6">
              <div className="timeline-item relative pb-6">
                {/* Group by date and render similar to TimelineView component */}
                {searchResults.map((result) => {
                  const sourceIcon = getSourceIcon(result.source);
                  const sourceColor = getSourceColor(result.source);
                  const time = new Date(result.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                  
                  return (
                    <Card 
                      key={result.id} 
                      className="search-result-card mt-4 bg-white dark:bg-secondary-800 shadow-sm p-4 border border-secondary-100 dark:border-secondary-700 hover:shadow transition-all"
                    >
                      <div className="flex items-start">
                        <div className={cn("flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center mr-4", sourceColor.bg, sourceColor.text)}>
                          <span className="material-icons">{sourceIcon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-secondary-900 dark:text-white">{result.title}</h4>
                            <span className="text-xs text-secondary-500 dark:text-secondary-400">{time}</span>
                          </div>
                          <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">{result.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", 
                                `bg-${sourceColor.bg.split('-')[1]}-50 text-${sourceColor.text.split('-')[1]}-700`,
                                `dark:bg-${sourceColor.bg.split('-')[1]}-900 dark:text-${sourceColor.text.split('-')[1]}-300`
                              )}>
                                {result.source}
                              </span>
                              {result.tags && result.tags.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300">
                                  {result.tags[0]}
                                </span>
                              )}
                            </div>
                            <button className="text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300">
                              <span className="material-icons">more_horiz</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </div>
    </main>
  );
}
