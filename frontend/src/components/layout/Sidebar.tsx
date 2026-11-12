import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  KeyRound,
  Pipette,
  Stethoscope,
  ScrollText,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: any;
  roles: string[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const navGroups: NavGroup[] = [
    {
      title: 'OPERATIONS & KMS',
      items: [
        {
          name: 'Security Dashboard',
          path: '/',
          icon: LayoutDashboard,
          roles: ['admin', 'auditor'],
        },
        {
          name: 'Device Registry',
          path: '/devices',
          icon: Cpu,
          roles: ['admin'],
        },
        {
          name: 'Key Lifecycle & Sessions',
          path: '/sessions',
          icon: KeyRound,
          roles: ['admin'],
        },
      ],
    },
    {
      title: 'CYBER-PHYSICAL BIOCHIPS',
      items: [
        {
          name: 'Clinician Diagnostics',
          path: '/doctor',
          icon: Stethoscope,
          roles: ['doctor', 'admin'],
        },
        {
          name: 'DMFB Digital Twin',
          path: '/dmfb',
          icon: Pipette,
          roles: ['admin', 'doctor', 'auditor'],
        },
      ],
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        {
          name: 'Forensic Audit Ledger',
          path: '/audit',
          icon: ScrollText,
          roles: ['admin', 'auditor'],
        },
        {
          name: 'Performance Telemetry',
          path: '/benchmarks',
          icon: BarChart3,
          roles: ['admin', 'auditor'],
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0a0e17] border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group) => {
          // Filter items based on current role
          const visibleItems = group.items.filter(
            (item) => !role || item.roles.includes(role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono">
                {group.title}
              </h4>
              <div className="space-y-0.5 pt-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-teal-50 dark:bg-teal-600/15 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
