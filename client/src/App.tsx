import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { MobileNavigation } from "@/components/mobile-navigation";
import Dashboard from "@/pages/dashboard";
import Search from "@/pages/search";
import Timeline from "@/pages/timeline";
import Insights from "@/pages/insights";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNavigation />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/insights" component={Insights} />
          <Route path="/timeline" component={Timeline} />
          <Route path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
