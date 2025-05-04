import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataSource } from "@shared/schema";
import { cn, getSourceIcon, getSourceColor } from "@/lib/utils";

export function DataSources() {
  const { data: sources, isLoading, isError } = useQuery<DataSource[]>({
    queryKey: ['/api/datasources'],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="font-heading font-semibold text-xl mb-4 text-secondary-900 dark:text-white">Connected Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-secondary-100 dark:bg-secondary-700 mr-3"></div>
                <div>
                  <div className="h-5 w-32 bg-secondary-100 dark:bg-secondary-700 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-secondary-100 dark:bg-secondary-700 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-16 bg-secondary-100 dark:bg-secondary-700 rounded-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8">
        <h2 className="font-heading font-semibold text-xl mb-4 text-secondary-900 dark:text-white">Connected Data Sources</h2>
        <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">Error loading data sources. Please try again later.</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="font-heading font-semibold text-xl mb-4 text-secondary-900 dark:text-white">Connected Data Sources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources && sources.map((source) => {
          const icon = getSourceIcon(source.type);
          const color = getSourceColor(source.type);
          
          return (
            <Card key={source.id} className="bg-white dark:bg-secondary-800 shadow p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={cn("w-10 h-10 rounded-md flex items-center justify-center mr-3", color.bg, color.text)}>
                  <span className="material-icons">{icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">{source.name}</h3>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Last sync: {source.lastSync}</p>
                </div>
              </div>
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                source.status === 'active' 
                  ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
              )}>
                {source.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </Card>
          );
        })}
        
        <Card className="bg-white dark:bg-secondary-800 shadow p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center text-secondary-700 dark:text-secondary-300 mr-3">
              <span className="material-icons">add</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-white">Connect More</h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Add additional data sources</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-none dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800">
            Connect
          </Button>
        </Card>
      </div>
    </div>
  );
}
