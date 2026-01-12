import React from 'react';
import { ArrowUpRight, BookOpen, Users, HardDrive } from 'lucide-react';

// Dumb Card Component
function StatCard({ label, value, icon: Icon, className }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-primary/10 text-primary`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-green-500 font-medium">
        <ArrowUpRight className="mr-1 h-3 w-3" />
        <span>+12% from last month</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Chudamani. System Overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total Nodes" value="1,284" icon={BookOpen} />
        <StatCard label="Active Users" value="42" icon={Users} />
        <StatCard label="Storage Used" value="8.2 GB" icon={HardDrive} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for Recent Activity */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-foreground">Recent Updates</h3>
          <div className="mt-8 flex flex-col items-center justify-center text-muted-foreground">
            <p>No recent activity detected.</p>
          </div>
        </div>
        
        {/* Placeholder for Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
          <div className="mt-4 space-y-3">
             <button className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
               + Add New Topic
             </button>
             <button className="w-full rounded-lg border border-input py-2 text-sm font-medium text-foreground hover:bg-muted">
               Upload Resource
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
