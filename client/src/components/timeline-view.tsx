import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimelineItem } from "@shared/schema";
import { formatDateTime, formatDateForTimeline, getSourceIcon, getSourceColor, cn } from "@/lib/utils";

export function TimelineView() {
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "custom">("today");
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  
  const { data: timelineData, isLoading, isError } = useQuery<TimelineItem[]>({
    queryKey: ['/api/timeline', { filter: dateFilter }],
  });

  // Group timeline items by date
  const groupedItems = timelineData?.reduce<Record<string, TimelineItem[]>>((groups, item) => {
    const dateKey = new Date(item.timestamp).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-xl text-secondary-900 dark:text-white">Your Timeline</h2>
          <div className="flex space-x-2 animate-pulse">
            <div className="h-9 w-24 bg-secondary-100 dark:bg-secondary-700 rounded-lg"></div>
            <div className="h-9 w-32 bg-secondary-100 dark:bg-secondary-700 rounded-lg"></div>
            <div className="h-9 w-9 bg-secondary-100 dark:bg-secondary-700 rounded-lg"></div>
          </div>
        </div>
        
        <div className="relative pl-8 space-y-6">
          {[...Array(2)].map((_, dayIndex) => (
            <div key={dayIndex} className="timeline-item relative pb-6">
              <div className="timeline-date mb-4">
                <div className="h-4 w-48 bg-secondary-100 dark:bg-secondary-700 rounded animate-pulse"></div>
              </div>
              
              {[...Array(2)].map((_, itemIndex) => (
                <Card key={itemIndex} className="mt-4 bg-white dark:bg-secondary-800 p-4 border border-secondary-100 dark:border-secondary-700 animate-pulse">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-secondary-100 dark:bg-secondary-700"></div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="h-5 w-32 bg-secondary-100 dark:bg-secondary-700 rounded"></div>
                        <div className="h-4 w-16 bg-secondary-100 dark:bg-secondary-700 rounded"></div>
                      </div>
                      <div className="h-4 w-full bg-secondary-100 dark:bg-secondary-700 rounded mb-3"></div>
                      <div className="h-4 w-3/4 bg-secondary-100 dark:bg-secondary-700 rounded mb-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <div className="h-6 w-24 bg-secondary-100 dark:bg-secondary-700 rounded-full"></div>
                          <div className="h-6 w-16 bg-secondary-100 dark:bg-secondary-700 rounded-full"></div>
                        </div>
                        <div className="h-6 w-6 bg-secondary-100 dark:bg-secondary-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-xl text-secondary-900 dark:text-white">Your Timeline</h2>
        </div>
        <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">Error loading timeline data. Please try again later.</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold text-xl text-secondary-900 dark:text-white">Your Timeline</h2>
        <div className="flex space-x-2">
          <Button
            variant={dateFilter === "today" ? "default" : "outline"}
            size="sm"
            className={cn(
              "inline-flex items-center rounded-lg text-sm font-medium",
              dateFilter === "today" ? "bg-primary-500 text-white" : "bg-white dark:bg-secondary-800"
            )}
            onClick={() => setDateFilter("today")}
          >
            <span className="material-icons text-sm mr-1">today</span>
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center rounded-lg text-sm font-medium bg-white dark:bg-secondary-800"
            onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
          >
            <span className="material-icons text-sm mr-1">date_range</span>
            Date Range
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center rounded-lg text-sm font-medium bg-white dark:bg-secondary-800"
          >
            <span className="material-icons text-sm">filter_list</span>
          </Button>
        </div>
      </div>
      
      <div className="relative pl-8 space-y-6">
        {groupedItems && Object.entries(groupedItems).map(([dateKey, items]) => {
          const firstItem = items[0];
          
          return (
            <div key={dateKey} className="timeline-item relative pb-6">
              <div className="timeline-date mb-4">
                <h3 className="font-heading font-medium text-sm text-secondary-500 dark:text-secondary-400">
                  {formatDateForTimeline(firstItem.timestamp)}
                </h3>
              </div>
              
              {items.map((item) => {
                const sourceIcon = getSourceIcon(item.source);
                const sourceColor = getSourceColor(item.source);
                const time = new Date(item.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });
                
                return (
                  <Card 
                    key={item.id} 
                    className="search-result-card mt-4 bg-white dark:bg-secondary-800 shadow-sm p-4 border border-secondary-100 dark:border-secondary-700 hover:shadow transition-all"
                  >
                    <div className="flex items-start">
                      <div className={cn("flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center mr-4", sourceColor.bg, sourceColor.text)}>
                        <span className="material-icons">{sourceIcon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-secondary-900 dark:text-white">{item.title}</h4>
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">{time}</span>
                        </div>
                        <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", 
                              `bg-${sourceColor.bg.split('-')[1]}-50 text-${sourceColor.text.split('-')[1]}-700`,
                              `dark:bg-${sourceColor.bg.split('-')[1]}-900 dark:text-${sourceColor.text.split('-')[1]}-300`
                            )}>
                              {item.source}
                            </span>
                            {item.tags && item.tags.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300">
                                {item.tags[0]}
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
          );
        })}
        
        <button className="text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center mt-4 hover:text-primary-700 dark:hover:text-primary-300">
          <span className="material-icons mr-1">expand_more</span>
          Load more activities
        </button>
      </div>
    </div>
  );
}
