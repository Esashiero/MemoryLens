import { SearchSection } from "@/components/search-section";
import { RecentActivity } from "@/components/recent-activity";
import { TimelineView } from "@/components/timeline-view";
import { AiAssistant } from "@/components/ai-assistant";
import { DataSources } from "@/components/data-sources";

export default function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary-50 dark:bg-secondary-900 p-4 md:p-6">
      <SearchSection />
      <RecentActivity />
      <TimelineView />
      <AiAssistant />
      <DataSources />
    </main>
  );
}
