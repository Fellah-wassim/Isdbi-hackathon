import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'scenarios', title: 'Scenarios', href: paths.dashboard.scenarios, icon: 'scenarios' },
  { key: 'products', title: 'Products', href: paths.dashboard.products, icon: 'products' },
  { key: 'reports', title: 'Reports', href: paths.dashboard.reports, icon: 'reports' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
