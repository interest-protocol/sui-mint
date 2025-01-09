import {
  INCINERATOR_EXTERNAL_LINK,
  Network,
  Routes,
  RoutesEnum,
  SUI_TERMINAL_EXTERNAL_LINK,
} from '@/constants';
import {
  AirdropSVG,
  CirclePlusSVG,
  DoubleChevronSVG,
  FireSVG,
  HourglassSVG,
  MenuSVG,
  MergeSVG,
  UploadSVG,
} from '@/svg';

import { IMenuItem } from './sidebar.types';

export const SIDEBAR_ITEMS: ReadonlyArray<IMenuItem> = [
  {
    name: 'swap',
    disabled: false,
    Icon: DoubleChevronSVG,
    path: Routes[RoutesEnum.Swap],
    networks: [Network.MAINNET],
  },
  {
    name: 'DCA',
    disabled: false,
    Icon: HourglassSVG,
    path: Routes[RoutesEnum.DCA],
    networks: [Network.MAINNET],
  },
  {
    disabled: false,
    Icon: CirclePlusSVG,
    name: 'create token',
    path: Routes[RoutesEnum.CreateCoin],
    networks: [Network.MAINNET, Network.TESTNET],
  },
  {
    name: 'airdrop',
    disabled: false,
    Icon: AirdropSVG,
    path: Routes[RoutesEnum.Airdrop],
    networks: [Network.MAINNET, Network.TESTNET],
  },
  {
    Icon: FireSVG,
    disabled: false,
    name: 'incinerator',
    path: Routes[RoutesEnum.Incinerator],
    suiWalletLink: INCINERATOR_EXTERNAL_LINK,
    networks: [Network.MAINNET, Network.TESTNET],
  },
  {
    name: 'more',
    Icon: MenuSVG,
    disabled: false,
    networks: [Network.MAINNET, Network.TESTNET],
    accordionList: [
      {
        beta: false,
        name: 'Sui Terminal',
        disabled: false,
        Icon: UploadSVG,
        path: SUI_TERMINAL_EXTERNAL_LINK,
        networks: [Network.MAINNET, Network.TESTNET],
      },
      {
        name: 'merge',
        disabled: false,
        Icon: MergeSVG,
        path: Routes[RoutesEnum.Merge],
        networks: [Network.MAINNET, Network.TESTNET],
      },
    ],
  },
];
