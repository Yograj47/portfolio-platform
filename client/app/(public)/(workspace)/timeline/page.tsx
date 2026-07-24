import { FileView } from "@/components/public/layout/file-view";

import { TimelineSection } from "@/components/public/timeline/timeline-section";

export default function TimelinePage() {
  return (
    <FileView
      title="Timeline.log"
      meta="Log"
    >
      <TimelineSection />
    </FileView>
  );
}