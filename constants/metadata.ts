import { SCALLOP_SUI_TYPE, SCALLOP_USDC_TYPE } from '@/constants/clamm';
import { CoinMetadataWithType } from '@/interface';

import { Network } from './dapp';

export const METADATA = {
  [Network.MAINNET]: [
    {
      type: SCALLOP_SUI_TYPE,
      name: 'Scallop Sui',
      symbol: 'sSui',
      description: 'Interest Bearing Sui on Scallop protocol',
      decimals: 9,
      id: null,
      iconUrl:
        'data:image/png;base64,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',
    },
    {
      type: SCALLOP_USDC_TYPE,
      name: 'Scallop USDC',
      symbol: 'sUSDC',
      description: 'Interest Bearing USDC on Scallop protocol',
      decimals: 6,
      id: null,
      iconUrl:
        'data:image/png;base64,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',
    },
  ],
  [Network.TESTNET]: [],
} as Record<Network, CoinMetadataWithType[]>;