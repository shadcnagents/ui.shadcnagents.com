"use client"

import { DirectionAwareTabs } from "../ui/direction-aware-tabs"

const DirectionAwareTabsDemo = ({}) => {
  const tabs = [
    {
      id: 0,
      label: "Overview",
      content: (
        <div className="w-full rounded-lg border border-border/50 p-4">
          <h3 className="mb-2 font-medium">Overview</h3>
          <p className="text-sm text-muted-foreground">
            Direction-aware tabs animate based on navigation direction.
          </p>
        </div>
      ),
    },
    {
      id: 1,
      label: "Features",
      content: (
        <div className="w-full rounded-lg border border-border/50 p-4">
          <h3 className="mb-2 font-medium">Features</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Smooth directional animations</li>
            <li>• Keyboard navigation support</li>
            <li>• Customizable styling</li>
          </ul>
        </div>
      ),
    },
    {
      id: 2,
      label: "Usage",
      content: (
        <div className="w-full rounded-lg border border-border/50 p-4">
          <h3 className="mb-2 font-medium">Usage</h3>
          <p className="text-sm text-muted-foreground">
            Pass an array of tabs with id, label, and content properties.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="">
      <DirectionAwareTabs tabs={tabs} />
    </div>
  )
}

export default DirectionAwareTabsDemo
