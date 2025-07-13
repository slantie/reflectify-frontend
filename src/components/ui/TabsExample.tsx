// Example usage of the Tabs component
// This demonstrates how to use the Tabs component in any React component

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

export const TabsExample = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="p-4 bg-light-background dark:bg-dark-muted-background rounded-lg">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              Overview Content
            </h3>
            <p className="text-light-muted-text dark:text-dark-muted-text">
              This is the overview tab content.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="p-4 bg-light-background dark:bg-dark-muted-background rounded-lg">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              Analytics Content
            </h3>
            <p className="text-light-muted-text dark:text-dark-muted-text">
              This is the analytics tab content.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="p-4 bg-light-background dark:bg-dark-muted-background rounded-lg">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              Trends Content
            </h3>
            <p className="text-light-muted-text dark:text-dark-muted-text">
              This is the trends tab content.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="p-4 bg-light-background dark:bg-dark-muted-background rounded-lg">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              Users Content
            </h3>
            <p className="text-light-muted-text dark:text-dark-muted-text">
              This is the users tab content.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
