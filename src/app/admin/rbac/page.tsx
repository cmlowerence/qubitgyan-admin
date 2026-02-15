// src/app/admin/rbac/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAdminsRBAC, updateAdminRBAC, AdminRBACProfile } from '@/services/rbac';
import { Shield, ShieldAlert, Check, X, UserCog } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function RBACManagerPage() {
  const [admins, setAdmins] = useState<AdminRBACProfile[]>([]);
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
      setAdmins(data);
    } catch (err: any) {
      // If a non-superuser tries to load this, the API throws a 403.
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

      // If backend returned the updated user object, use it to update local state
      if (res && res.user) {
        const u = res.user;
        
        setAdmins(prevAdmins => prevAdmins.map(admin =>
          admin.id === id
            ? {
                ...admin,
                // keep avatar key name consistent with AdminRBACProfile
                avatar: u.avatar_url ?? admin.avatar,
                // Enforce strict boolean conversion in case the backend returns 0/1 integers
                can_manage_content: Boolean(u.can_manage_content),
                can_approve_admissions: Boolean(u.can_approve_admissions),
                can_manage_users: Boolean(u.can_manage_users),
                is_superuser: Boolean(u.is_superuser),
              }
            : admin
        ));

        // Notify other parts of the app (and other tabs) so they can refresh current user
        try {
          window.dispatchEvent(new CustomEvent('user:updated', { detail: u }));
          localStorage.setItem('qubitgyan_user_updated_at', String(Date.now()));
        } catch (e) {
          // ignore (safe-best-effort)
        }

        toast.push({ title: 'Permissions updated', description: 'Saved successfully', variant: 'success' });
      } else {
        // Fallback: optimistic update if no user object is returned
        setAdmins(prevAdmins => prevAdmins.map(admin => 
          admin.id === id ? { ...admin, [field]: !currentValue } : admin
        ));

        toast.push({ title: 'Permissions updated', description: 'Saved (optimistic)', variant: 'success' });
      }
    } catch (err: any) {
      toast.push({ title: 'Update failed', description: err.message || 'Failed to update permission', variant: 'danger' });
      loadRBACData(); // Revert on failure to ensure UI matches the true database state
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Verifying Security Credentials...</div>;

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center flex flex-col items-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Security Clearance Required</h2>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Shield className="w-6 h-6 text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Access Control (RBAC)</h1>
          <p className="text-gray-500 text-sm">Manage granular permissions for your administrative staff.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {admins.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No staff found.</div>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                      {admin.avatar ? <img src={admin.avatar} alt={admin.username} className="w-full h-full object-cover rounded-full" /> : admin.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{admin.username}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <div>
                    {admin.is_superuser ? (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold">
                        <UserCog className="w-3 h-3" /> ALL ACCESS
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Manage Content</div>
                    <button
                      onClick={() => handleTogglePermission(admin.id, 'can_manage_content', admin.can_manage_content)}
                      disabled={admin.is_superuser || processingId === admin.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${admin.can_manage_content ? 'bg-blue-600' : 'bg-gray-200'} ${admin.is_superuser ? 'opacity-50 cursor-not-allowed' : ''} ${processingId === admin.id ? 'opacity-70 grayscale' : ''}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${admin.can_manage_content ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Approve Admissions</div>
                    <button
                      onClick={() => handleTogglePermission(admin.id, 'can_approve_admissions', admin.can_approve_admissions)}
                      disabled={admin.is_superuser || processingId === admin.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${admin.can_approve_admissions ? 'bg-green-600' : 'bg-gray-200'} ${admin.is_superuser ? 'opacity-50 cursor-not-allowed' : ''} ${processingId === admin.id ? 'opacity-70 grayscale' : ''}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${admin.can_approve_admissions ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Manage Users</div>
                    <button
                      onClick={() => handleTogglePermission(admin.id, 'can_manage_users', admin.can_manage_users)}
                      disabled={admin.is_superuser || processingId === admin.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${admin.can_manage_users ? 'bg-purple-600' : 'bg-gray-200'} ${admin.is_superuser ? 'opacity-50 cursor-not-allowed' : ''} ${processingId === admin.id ? 'opacity-70 grayscale' : ''}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${admin.can_manage_users ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table (hidden on small screens) */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4 text-center">Manage Content (Nodes/Resources)</th>
                  <th className="p-4 text-center">Approve Admissions</th>
                  <th className="p-4 text-center">Manage Users</th>
                  <th className="p-4 text-center">Superuser Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {admin.avatar ? <img src={admin.avatar} alt={admin.username} className="w-full h-full object-cover rounded-full" /> : admin.username[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{admin.username}</p>
                          <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Permission: Manage Content */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePermission(admin.id, 'can_manage_content', admin.can_manage_content)}
                        disabled={admin.is_superuser || processingId === admin.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          admin.can_manage_content ? 'bg-blue-600' : 'bg-gray-200'
                        } ${admin.is_superuser ? 'opacity-50 cursor-not-allowed' : ''} ${processingId === admin.id ? 'opacity-70 grayscale' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          admin.can_manage_content ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </td>

                    {/* Permission: Approve Admissions */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePermission(admin.id, 'can_approve_admissions', admin.can_approve_admissions)}
                        disabled={admin.is_superuser || processingId === admin.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          admin.can_approve_admissions ? 'bg-green-600' : 'bg-gray-200'
                        } ${admin.is_superuser ? 'opacity-50 cursor-not-allowed' : ''} ${processingId === admin.id ? 'opacity-70 grayscale' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          admin.can_approve_admissions ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </td>

                    {/* Permission: Manage Users */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePermission(admin.id, 'can_manage_users', admin.can_manage_users)}
                        disabled={admin.is_superuser || processingId === admin.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          admin.can_manage_users ? 'bg-purple-600' : 'bg-gray-200'
                        } ${admin.is_superuser ? 'opacity-50 cursor-not-allowed' : ''} ${processingId === admin.id ? 'opacity-70 grayscale' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          admin.can_manage_users ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </td>

                    {/* Superuser Status (Read Only here) */}
                    <td className="p-4 text-center">
                      {admin.is_superuser ? (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold">
                          <UserCog className="w-3 h-3" /> ALL ACCESS
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">Restricted Staff</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}