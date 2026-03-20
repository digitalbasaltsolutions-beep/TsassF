'use client';
import { ReactNode, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, Shield, ChevronDown } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import UsageOverview from '@/components/dashboard/UsageOverview';
import { OnboardingWizard } from '@/components/dashboard/OnboardingWizard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, organizationId, setCredentials, logout } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [showOrgSwitch, setShowOrgSwitch] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchOrganizations();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await apiClient.get('/organizations/my');
      setOrganizations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchOrg = async (orgId: string) => {
    try {
      const res = await apiClient.post('/auth/switch-org', { organizationId: orgId });
      setCredentials(res.data.accessToken, res.data.refreshToken, res.data.user);
      router.refresh(); // Refresh page data with new context
      setShowOrgSwitch(false);
    } catch (e) {
      console.error('Failed to switch organization', e);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const activeOrg = organizations.find(o => o._id === organizationId) || { name: 'Organization View' };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r h-full shadow-sm flex-shrink-0">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Business OS</h1>
        </div>
        <nav className="p-4 space-y-2 mt-4">
          {[
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'CRM Contacts', path: '/crm/contacts' },
            { name: 'CRM Pipeline', path: '/crm/deals' },
            { name: 'Ecommerce', path: '/ecommerce/products' },
            { name: 'Orders', path: '/ecommerce/orders' },
            { name: 'Billing', path: '/billing' },
            { name: 'Settings', path: '/settings' }
          ].map((item) => (
            <a key={item.name} href={item.path} className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 font-medium cursor-pointer transition-colors">
              {item.name}
            </a>
          ))}

          {/* Admin Link for SuperAdmins */}
          {user?.role === 'SuperAdmin' && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <a href="/admin" className="flex items-center space-x-2 px-4 py-2 rounded-md bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition-colors cursor-pointer">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </a>
            </div>
          )}

          {/* Usage Stats (Upsell) */}
          <div className="mt-8 pt-6 border-t border-gray-100 px-2">
            <UsageOverview />
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto w-full">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm relative z-50">
          <div className="relative">
            <button 
              onClick={() => setShowOrgSwitch(!showOrgSwitch)}
              className="flex items-center space-x-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>{activeOrg.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showOrgSwitch ? 'rotate-180' : ''}`} />
            </button>

            {showOrgSwitch && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[60]">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Switch Organization</div>
                {organizations.map(org => (
                  <button
                    key={org._id}
                    onClick={() => handleSwitchOrg(org._id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${org._id === organizationId ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-700'}`}
                  >
                    {org.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative p-1 text-gray-500 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                {notifications.filter((n: any) => !n.isRead).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                  <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-800">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">No new notifications</div>
                    ) : (
                      notifications.map((n: any) => (
                        <div key={n._id} className={`px-4 py-3 border-b border-gray-50 text-sm ${n.isRead ? 'opacity-50' : 'bg-blue-50'}`}>
                          <div className="font-semibold text-gray-900">{n.title}</div>
                          <div className="text-gray-600 mt-1">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer font-medium">Profile ({user?.role})</span>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
        <OnboardingWizard />
      </main>
    </div>
  );
}
