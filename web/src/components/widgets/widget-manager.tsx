"use client"

import { useWidgets } from "@/contexts/widget-context"
import WidgetContainer from "./widget-container"
import StaffStatusWidget from "./staff-status-widget"
import WeeklyStatsWidget from "./weekly-stats-widget"
import CaseOverviewWidget from "./case-overview-widget"
import FineSummaryWidget from "./fine-summary-widget"
import NetworkStatusWidget from "./network-status-widget"
import UserProfileWidget from "./user-profile-widget"

const widgetComponents = {
  "staff-status": StaffStatusWidget,
  "weekly-stats": WeeklyStatsWidget,
  "case-overview": CaseOverviewWidget,
  "fine-summary": FineSummaryWidget,
  "network-status": NetworkStatusWidget,
  "user-profile": UserProfileWidget,
}

export default function WidgetManager() {
  const { widgets } = useWidgets()

  return (
    <>
      {widgets.map((widget) => {
        const WidgetComponent = widgetComponents[widget.type as keyof typeof widgetComponents]

        if (!WidgetComponent) {
          return null
        }

        return (
          <WidgetContainer key={widget.id} widget={widget}>
            <WidgetComponent />
          </WidgetContainer>
        )
      })}
    </>
  )
}
