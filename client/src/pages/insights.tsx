import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { cn } from "@/lib/utils";

type InsightData = {
  activityBySource: { source: string; count: number }[];
  activityByDay: { day: string; count: number }[];
  topSearches: { query: string; count: number }[];
  frequentTags: { tag: string; count: number }[];
  activityByTime: { hour: string; count: number }[];
};

export default function Insights() {
  const [timeRange, setTimeRange] = useState<string>("week");
  
  const { data, isLoading } = useQuery<InsightData>({
    queryKey: ['/api/insights', { range: timeRange }],
  });
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  const timeRangeOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary-50 dark:bg-secondary-900 p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-secondary-900 dark:text-white mb-2">Insights</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Analyze patterns and trends in your digital activities</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900">Activity</TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900">Sources</TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900">Tags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                      {data?.activityBySource.reduce((sum, item) => sum + item.count, 0) || 0}
                    </span>
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                      <span className="material-icons text-sm">arrow_upward</span>
                      12%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Most Active Day</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                      {data?.activityByDay.sort((a, b) => b.count - a.count)[0]?.day || "N/A"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Top Source</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                      {data?.activityBySource.sort((a, b) => b.count - a.count)[0]?.source || "N/A"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Peak Activity Time</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                      {data?.activityByTime.sort((a, b) => b.count - a.count)[0]?.hour || "N/A"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity by Source</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.activityBySource}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="source"
                          label={(entry) => entry.source}
                        >
                          {data?.activityBySource.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.activityByDay}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" name="Activities" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Searches</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data?.topSearches.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 text-xs font-medium mr-3">
                            {index + 1}
                          </div>
                          <span className="text-secondary-900 dark:text-white">{item.query}</span>
                        </div>
                        <span className="text-secondary-500 dark:text-secondary-400 text-sm">{item.count} times</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequent Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-8 w-24 bg-secondary-100 dark:bg-secondary-800 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data?.frequentTags.map((tag, index) => (
                      <div
                        key={index}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium flex items-center",
                          index % 6 === 0 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                          index % 6 === 1 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                          index % 6 === 2 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                          index % 6 === 3 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                          index % 6 === 4 ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" :
                          "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                        )}
                      >
                        {tag.tag}
                        <span className="ml-2 bg-white dark:bg-secondary-800 px-1.5 py-0.5 rounded-full text-xs">
                          {tag.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="h-full bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.activityByTime}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" name="Activities" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Activity by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="h-full bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.activityBySource}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="source"
                        label
                      >
                        {data?.activityBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Tag Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-96">
                    {isLoading ? (
                      <div className="h-full bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data?.frequentTags} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="tag" width={100} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8B5CF6" name="Occurrences" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-secondary-900 dark:text-white">Popular Tags</h3>
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-10 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {data?.frequentTags.map((tag, index) => (
                        <div
                          key={index}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium flex items-center",
                            index % 6 === 0 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                            index % 6 === 1 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                            index % 6 === 2 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                            index % 6 === 3 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                            index % 6 === 4 ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" :
                            "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                          )}
                        >
                          {tag.tag}
                          <span className="ml-2 bg-white dark:bg-secondary-800 px-1.5 py-0.5 rounded-full text-xs">
                            {tag.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
