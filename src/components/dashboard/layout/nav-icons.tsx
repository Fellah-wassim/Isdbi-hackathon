import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartLine } from '@phosphor-icons/react/dist/ssr/ChartLine';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { Storefront } from '@phosphor-icons/react/dist/ssr/Storefront';
import { TreeStructure } from '@phosphor-icons/react/dist/ssr/TreeStructure';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  products: Storefront,
  reports: ChartLine,
  scenarios: TreeStructure,
} as Record<string, Icon>;
