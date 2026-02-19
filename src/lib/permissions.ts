import { User } from '@/services/users';
import { LucideIcon, LayoutDashboard, Network, BookOpen, HelpCircle, Activity, UserCheck, Database, Tag, Users, Bell, Mail, Settings, Image as ImageIcon, ShieldAlert, Terminal } from 'lucide-react';

export type AdminPermission = 'can_manage_content' | 'can_approve_admissions' | 'can_manage_users';

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  requires?: AdminPermission;
  superadminOnly?: boolean;
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Network, label: 'Knowledge Tree', href: '/admin/tree', requires: 'can_manage_content' },
  { icon: BookOpen, label: 'Courses', href: '/admin/courses', requires: 'can_manage_content' },
  { icon: HelpCircle, label: 'Quizzes', href: '/admin/quizzes', requires: 'can_manage_content' },
  { icon: Database, label: 'Resources', href: '/admin/resources', requires: 'can_manage_content' },
  { icon: Tag, label: 'Contexts', href: '/admin/contexts', requires: 'can_manage_content' },
  { icon: UserCheck, label: 'Admissions Desk', href: '/admin/admissions', requires: 'can_approve_admissions' },
  { icon: Users, label: 'Users & Staff', href: '/admin/users', requires: 'can_manage_users' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications', requires: 'can_manage_content' },
  { icon: Mail, label: 'Email Queue', href: '/admin/emails' },
  { icon: Activity, label: 'Student Activity', href: '/admin/student-activity' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
  { icon: Terminal, label: 'API Inspector', href: '/admin/inspector', superadminOnly: true },
  { icon: ImageIcon, label: 'Media Storage', href: '/admin/media', superadminOnly: true },
  { icon: ShieldAlert, label: 'Access Control', href: '/admin/rbac', superadminOnly: true },
];

export const hasPermission = (user: User | null, permission?: AdminPermission): boolean => {
  if (!user) return false;
  if (user.is_superuser) return true;
  if (!permission) return true;
  return Boolean(user[permission]);
};

export const canAccessNavItem = (user: User | null, item: NavItem): boolean => {
  if (!user) return false;
  if (item.superadminOnly) return Boolean(user.is_superuser);
  return hasPermission(user, item.requires);
};
