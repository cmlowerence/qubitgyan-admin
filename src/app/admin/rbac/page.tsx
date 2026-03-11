'use client';

import { useEffect, useState, useMemo } from 'react';
import { getAdminsRBAC, updateAdminRBAC, AdminRBACProfile } from '@/services/rbac';
import { Shield, ShieldAlert, Search, User, Lock, Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import DebugConsole from '@/components/debug/DebugConsole';

export default function RBACManagerPage() {
  const [admins, setAdmins] = useState<AdminRBACProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadRBACData();
  }, []);

  const loadRBACData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminsRBAC();
      
      const normalizedAdmins = data
        .map((admin: any) => {
          const toBool = (val: any) => {
            if (typeof val === 'boolean') return val;
            if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
            if (typeof val === 'number') return val === 1;
            return false;
          };

          return {
            ...admin,
            can_manage_content: toBool(admin.permissions?.can_manage_content ?? admin.can_manage_content),
            can_approve_admissions: toBool(admin.permissions?.can_approve_admissions ?? admin.can_approve_admissions),
            can_manage_users: toBool(admin.permissions?.can_manage_users ?? admin.can_manage_users),
            is_superuser: toBool(admin.is_superuser),
          };
        })
        .filter((admin: AdminRBACProfile) => !admin.is_superuser);

      setAdmins(normalizedAdmins);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (id: number, field: keyof AdminRBACProfile, currentValue: boolean) => {
    try {
      setProcessingId(id);
      const res = await updateAdminRBAC(id, { [field]: !currentValue });

      const toBool = (val: any) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
        if (typeof val === 'number') return val === 1;
        return false;
      };

      if (res && res.user) {
        const u = res.user;
        setAdmins(prevAdmins => prevAdmins.map(admin =>
          admin.id === id
            ? {
                ...admin,
                avatar: u.avatar_url ?? admin.avatar_url,
                can_manage_content: toBool(u.can_manage_content),
                can_approve_admissions: toBool(u.can_approve_admissions),
                can_manage_users: toBool(u.can_manage_users),
              }
            : admin
        ));

        try {
          window.dispatchEvent(new CustomEvent('user:updated', { detail: u }));
          localStorage.setItem('qubitgyan_user_updated_at', String(Date.now()));
        } catch (e) {
        }

        toast.push({ title: 'Permissions updated', description: 'Access control saved successfully', variant: 'success' });
      } else {
        setAdmins(prevAdmins => prevAdmins.map(admin => 
          admin.id === id ? { ...admin, [field]: !currentValue } : admin
        ));
        toast.push({ title: 'Permissions updated', description: 'Changes applied locally', variant: 'success' });
      }
    } catch (err: any) {
      toast.push({ title: 'Update failed', description: err.message || 'Failed to modify permissions', variant: 'danger' });
      loadRBACData(); 
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [admins, searchQuery]);

  const PermissionToggle = ({ 
    isActive, 
    onClick, 
    disabled, 
    colorClass 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    disabled: boolean; 
    colorClass: string; 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        isActive ? colorClass : 'bg-slate-200 dark:bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:shadow-inner'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-spring ${
        isActive ? 'translate-x-5' : 'translate-x-1'
      }`} />
    </button>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-[60vh] flex flex-col items-center justify-center">
        <Shield className="w-12 h-12 text-indigo-500 animate-pulse mb-4 opacity-50" />
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
      </div>
    );
  }

  if (error) {
    const isForbidden = error?.message?.includes('403') || error?.message?.includes('Forbidden');
    
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-24">
        {isForbidden ? (
          <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-[2rem] p-8 sm:p-12 text-center flex flex-col items-center shadow-2xl shadow-rose-900/5 max-w-2xl mx-auto mt-10">
            <div className="p-4 bg-rose-100 dark:bg-rose-900/40 rounded-full mb-6">
              <ShieldAlert className="w-12 h-12 sm:w-16 sm:h-16 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-900 dark:text-rose-100 mb-3 tracking-tight">Security Clearance Required</h2>
            <p className="text-rose-600 dark:text-rose-400 text-sm sm:text-base font-medium">
              Access Denied. You must be a Super Admin to view and modify Role-Based Access Controls.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" /> Access Error
              </h1>
              <button 
                onClick={loadRBACData}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-900/20 dark:focus:ring-white/20 w-full sm:w-auto"
              >
                <RefreshCw className="w-5 h-5" /> Retry Fetch
              </button>
            </div>
            <DebugConsole error={error} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shrink-0 shadow-inner">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Access Control</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Manage modular permissions for system administrators.</p>
          </div>
        </div>

        <div className="relative w-full lg:w-80 shrink-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredAdmins.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full mb-4">
            <User className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 font-black text-xl mb-1">No personnel found</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="bg-transparent xl:bg-white dark:xl:bg-slate-900 rounded-[2rem] xl:shadow-sm xl:border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 flex flex-col transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800">
                <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0 overflow-hidden shadow-sm border-2 border-white dark:border-slate-800">
                    {admin.avatar_url ? (
                      <img src={admin.avatar_url} alt={admin.username} className="w-full h-full object-cover" />
                    ) : (
                      admin.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate">{admin.first_name} {admin.last_name}</p>
                    <div className="flex items-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
                      <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 space-y-5 flex-1">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Permissions Control</span>
                  </div>
                  
                  <div className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Manage Content</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Create, edit, delete resources</span>
                    </div>
                    <PermissionToggle 
                      isActive={admin.can_manage_content} 
                      onClick={() => handleTogglePermission(admin.id, 'can_manage_content', admin.can_manage_content)}
                      disabled={processingId === admin.id}
                      colorClass="bg-blue-500 focus:ring-blue-500/30"
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Approve Admissions</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Process new student enrollments</span>
                    </div>
                    <PermissionToggle 
                      isActive={admin.can_approve_admissions} 
                      onClick={() => handleTogglePermission(admin.id, 'can_approve_admissions', admin.can_approve_admissions)}
                      disabled={processingId === admin.id}
                      colorClass="bg-emerald-500 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Manage Users</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Edit profiles and suspend accounts</span>
                    </div>
                    <PermissionToggle 
                      isActive={admin.can_manage_users} 
                      onClick={() => handleTogglePermission(admin.id, 'can_manage_users', admin.can_manage_users)}
                      disabled={processingId === admin.id}
                      colorClass="bg-purple-500 focus:ring-purple-500/30"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden xl:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400 sticky top-0 z-10 backdrop-blur-sm">
                  <th className="p-5 pl-8 w-2/5">Admin Identity</th>
                  <th className="p-5 text-center">Content Mgmt</th>
                  <th className="p-5 text-center">Admissions</th>
                  <th className="p-5 text-center pr-8">User Mgmt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0 border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {admin.avatar_url ? (
                            <img src={admin.avatar_url} alt={admin.username} className="w-full h-full object-cover" />
                          ) : (
                            admin.username[0].toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 dark:text-white text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {admin.first_name} {admin.last_name}
                          </p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{admin.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <PermissionToggle 
                        isActive={admin.can_manage_content} 
                        onClick={() => handleTogglePermission(admin.id, 'can_manage_content', admin.can_manage_content)}
                        disabled={processingId === admin.id}
                        colorClass="bg-blue-500 focus:ring-blue-500/30 shadow-blue-500/20"
                      />
                    </td>

                    <td className="p-5 text-center">
                      <PermissionToggle 
                        isActive={admin.can_approve_admissions} 
                        onClick={() => handleTogglePermission(admin.id, 'can_approve_admissions', admin.can_approve_admissions)}
                        disabled={processingId === admin.id}
                        colorClass="bg-emerald-500 focus:ring-emerald-500/30 shadow-emerald-500/20"
                      />
                    </td>

                    <td className="p-5 text-center pr-8">
                      <PermissionToggle 
                        isActive={admin.can_manage_users} 
                        onClick={() => handleTogglePermission(admin.id, 'can_manage_users', admin.can_manage_users)}
                        disabled={processingId === admin.id}
                        colorClass="bg-purple-500 focus:ring-purple-500/30 shadow-purple-500/20"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}