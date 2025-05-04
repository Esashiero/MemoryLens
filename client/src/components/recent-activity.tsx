import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { cn, formatDateTime, getSourceIcon, getSourceColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Activity } from "@shared/schema";

export function RecentActivity() {
  const { data: activities, isLoading, isError } = useQuery<Activity[]>({
    queryKey: ['/api/activities/recent'],
  });

  if (isLoading) {
    return (
      <div className="mb-8 pb-4">
        <h2 className="font-heading font-semibold text-xl mb-4 text-secondary-900 dark:text-white">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 bg-white dark:bg-secondary-800 hover:shadow-md transition-all">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-secondary-100 dark:bg-secondary-700 animate-pulse"></div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="h-4 bg-secondary-100 dark:bg-secondary-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-secondary-100 dark:bg-secondary-700 rounded animate-pulse mt-2 w-2/3"></div>
                </div>
              </div>
              <div className="h-4 bg-secondary-100 dark:bg-secondary-700 rounded animate-pulse"></div>
              <div className="h-4 bg-secondary-100 dark:bg-secondary-700 rounded animate-pulse mt-2 w-3/4"></div>
              <div className="mt-3 flex justify-between items-center">
                <div className="h-6 w-24 bg-secondary-100 dark:bg-secondary-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-6 bg-secondary-100 dark:bg-secondary-700 rounded animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8 pb-4">
        <h2 className="font-heading font-semibold text-xl mb-4 text-secondary-900 dark:text-white">Recent Activity</h2>
        <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">Error loading recent activities. Please try again later.</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8 pb-4">
      <h2 className="font-heading font-semibold text-xl mb-4 text-secondary-900 dark:text-white">Recent Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activities && activities.map((activity) => {
          const sourceIcon = getSourceIcon(activity.source);
          const sourceColor = getSourceColor(activity.source);
          
          return (
            <Card 
              key={activity.id} 
              className="search-result-card bg-white dark:bg-secondary-800 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start mb-3">
                <div className={cn("flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3", sourceColor.bg, sourceColor.text)}>
                  <span className="material-icons text-sm">{sourceIcon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-secondary-900 dark:text-white truncate">{activity.title}</h3>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">{formatDateTime(activity.timestamp)}</p>
                </div>
              </div>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 line-clamp-2">{activity.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", 
                  `bg-${sourceColor.bg.split('-')[1]}-50 text-${sourceColor.text.split('-')[1]}-700`,
                  `dark:bg-${sourceColor.bg.split('-')[1]}-900 dark:text-${sourceColor.text.split('-')[1]}-300`
                )}>
                  <span className="material-icons text-xs mr-1">{sourceIcon}</span>
                  {activity.source}
                </span>
                <button className="text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300">
                  <span className="material-icons text-sm">more_horiz</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
