'use client';

import { useEffect, useState } from 'react';
import {
  getAdminsRBAC,
  updateAdminRBAC,
  AdminRBACProfile
} from '@/services/rbac';
import { Shield, ShieldAlert, UserCog } from 'lucide-react';

export default function RBACManagerPage() {
  const [admins, setAdmins] = useState<AdminRBACProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

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
      if (
        err.message.includes('403') ||
        err.message.includes('Forbidden')
      ) {
        setError(
          'Access Denied. You must be a Super Admin to view and modify Role-Based Access Controls.'
        );
      } else {
        setError(err.message || 'Failed to load RBAC data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (
    id: number,
    field: keyof AdminRBACProfile,
    currentValue: boolean
  ) => {
    try {
      setProcessingId(id);

      await updateAdminRBAC(id, {
        [field]: !currentValue
      });

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === id
            ? { ...admin, [field]: !currentValue }
            : admin
        )
      );
    } catch (err: any) {
      alert(`Failed to update permission: ${err.message}`);
      loadRBACData();
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Verifying Security Credentials...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center flex flex-col items-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Security Clearance Required
          </h2>
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
          <h1 className="text-2xl font-bold text-gray-800">
            Access Control (RBAC)
          </h1>
          <p className="text-gray-500 text-sm">
            Manage granular permissions for your administrative staff.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                <th className="p-4">Staff Member</th>
                <th className="p-4 text-center">
                  Manage Content
                </th>
                <th className="p-4 text-center">
                  Approve Admissions
                </th>
                <th className="p-4 text-center">
                  Manage Users
                </th>
                <th className="p-4 text-center">
                  Superuser Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {admin.avatar ? (
                          <img
                            src={admin.avatar}
                            alt={admin.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          admin.username[0].toUpperCase()
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {admin.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {[
                    'can_manage_content',
                    'can_approve_admissions',
                    'can_manage_users'
                  ].map((field) => (
                    <td
                      key={field}
                      className="p-4 text-center"
                    >
                      <button
                        onClick={() =>
                          handleTogglePermission(
                            admin.id,
                            field as keyof AdminRBACProfile,
                            admin[field as keyof AdminRBACProfile] as boolean
                          )
                        }
                        disabled={
                          admin.is_superuser ||
                          processingId === admin.id
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          admin[
                            field as keyof AdminRBACProfile
                          ]
                            ? 'bg-blue-600'
                            : 'bg-gray-200'
                        } ${
                          admin.is_superuser
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                            admin[
                              field as keyof AdminRBACProfile
                            ]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  ))}

                  <td className="p-4 text-center">
                    {admin.is_superuser ? (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold">
                        <UserCog className="w-3 h-3" />
                        ALL ACCESS
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium">
                        Restricted Staff
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
