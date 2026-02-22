'use client';

import { useEffect, useState, useMemo } from 'react';
import { getAdminsRBAC, updateAdminRBAC, AdminRBACProfile } from '@/services/rbac';
import { Shield, ShieldAlert, Search, User, Lock, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function RBACManagerPage() {
  const [admins, setAdmins] = useState<AdminRBACProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadRBACData();
  }, []);

  const loadRBACData = async () => {
    try {
      setLoading(true);
      setError('');
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
      if (err.message?.includes('403') || err.message?.includes('Forbidden')) {
        setError('Access Denied. You must be a Super Admin to view and modify Role-Based Access Controls.');
      } else {
        setError(err.message || 'Failed to load RBAC data.');
      }
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
          // ignore
        }

        toast.push({ title: 'Permissions updated', description: 'Saved successfully', variant: 'success' });
      } else {
        setAdmins(prevAdmins => prevAdmins.map(admin => 
          admin.id === id ? { ...admin, [field]: !currentValue } : admin
        ));
        toast.push({ title: 'Permissions updated', description: 'Saved (optimistic)', variant: 'success' });
      }
    } catch (err: any) {
      toast.push({ title: 'Update failed', description: err.message || 'Failed to update permission', variant: 'danger' });
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
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        isActive ? colorClass : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:opacity-90'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
        isActive ? 'translate-x-4' : 'translate-x-1'
      }`} />
    </button>
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div className="h-20 bg-gray-100 animate-pulse rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Security Clearance Required</h2>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shrink-0">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Access Control</h1>
            <p className="text-gray-500 text-xs md:text-sm">Manage permissions for staff & students.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {filteredAdmins.length === 0 ? (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-gray-100">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No users found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl xl:shadow-sm xl:border border-gray-100 overflow-hidden">
          
          {/* Mobile & Tablet View (Cards - Switches at xl instead of md) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col">
                {/* Profile Header */}
                <div className="p-4 bg-gray-50/50 border-b border-gray-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shrink-0 overflow-hidden">
                    {admin.avatar_url ? (
                      <img src={admin.avatar_url} alt={admin.username} className="w-full h-full object-cover" />
                    ) : (
                      admin.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{admin.first_name} {admin.last_name}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5 truncate">
                      <Mail className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>
                </div>

                {/* Permissions List */}
                <div className="p-4 bg-white space-y-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Permissions Control</span>
                  </div>
                  
                  <div className="flex items-center justify-between group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Manage Content</span>
                    <PermissionToggle 
                      isActive={admin.can_manage_content} 
                      onClick={() => handleTogglePermission(admin.id, 'can_manage_content', admin.can_manage_content)}
                      disabled={processingId === admin.id}
                      colorClass="bg-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Approve Admissions</span>
                    <PermissionToggle 
                      isActive={admin.can_approve_admissions} 
                      onClick={() => handleTogglePermission(admin.id, 'can_approve_admissions', admin.can_approve_admissions)}
                      disabled={processingId === admin.id}
                      colorClass="bg-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Manage Users</span>
                    <PermissionToggle 
                      isActive={admin.can_manage_users} 
                      onClick={() => handleTogglePermission(admin.id, 'can_manage_users', admin.can_manage_users)}
                      disabled={processingId === admin.id}
                      colorClass="bg-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table - Only shows on xl screens 1280px+) */}
          <div className="hidden xl:block overflow-x-auto">
            {/* Added min-w-[800px] to prevent squeezing */}
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider font-semibold text-gray-500">
                  <th className="p-4 pl-6 w-1/3">User Details</th>
                  <th className="p-4 text-center">Content Mgmt</th>
                  <th className="p-4 text-center">Admissions</th>
                  <th className="p-4 text-center pr-6">User Mgmt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold shrink-0 border border-indigo-200 overflow-hidden">
                          {admin.avatar_url ? (
                            <img src={admin.avatar_url} alt={admin.username} className="w-full h-full object-cover" />
                          ) : (
                            admin.username[0].toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                            {admin.first_name} {admin.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <PermissionToggle 
                        isActive={admin.can_manage_content} 
                        onClick={() => handleTogglePermission(admin.id, 'can_manage_content', admin.can_manage_content)}
                        disabled={processingId === admin.id}
                        colorClass="bg-blue-500 focus:ring-blue-500"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <PermissionToggle 
                        isActive={admin.can_approve_admissions} 
                        onClick={() => handleTogglePermission(admin.id, 'can_approve_admissions', admin.can_approve_admissions)}
                        disabled={processingId === admin.id}
                        colorClass="bg-emerald-500 focus:ring-emerald-500"
                      />
                    </td>

                    <td className="p-4 text-center pr-6">
                      <PermissionToggle 
                        isActive={admin.can_manage_users} 
                        onClick={() => handleTogglePermission(admin.id, 'can_manage_users', admin.can_manage_users)}
                        disabled={processingId === admin.id}
                        colorClass="bg-purple-500 focus:ring-purple-500"
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