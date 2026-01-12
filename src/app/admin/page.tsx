import React from 'react';
import { ArrowUpRight, BookOpen, Users, HardDrive } from 'lucide-react';

// Dumb Card Component
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
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
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back, Chudamani. Here is the system overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          label="Total Nodes" 
          value="1,284" 
          icon={BookOpen} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          label="Active Users" 
          value="42" 
          icon={Users} 
          color="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          label="Storage Used" 
          value="8.2 GB" 
          icon={HardDrive} 
          color="bg-purple-50 text-purple-600" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for Recent Activity */}
        <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-slate-900">Recent Updates</h3>
          <div className="mt-8 flex flex-col items-center justify-center text-slate-400">
            <p>No recent activity detected.</p>
          </div>
        </div>
        
        {/* Placeholder for Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-4 space-y-3">
             <button className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800">
               + Add New Topic
             </button>
             <button className="w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
               Upload Resource
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
