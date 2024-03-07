import { Network } from '@/lib';

import { ETH_TYPE, USDC_TYPE } from './coins';

export const MAX_NUMBER_INPUT_VALUE = 9000000000000000;

export const DISPLAY_NETWORK = {
  [Network.DEVNET]: 'Devnet',
};

export const LOCAL_STORAGE_VERSION = 'v4';

export const RPC_URL = {
  [Network.DEVNET]: 'https://sui.devnet.m2.movementlabs.xyz:443',
};

export const FAUCET_URL = {
  [Network.DEVNET]: 'https://sui.devnet.m2.movementlabs.xyz/faucet',
};

export const CONTROLLERS_MAP: Record<string, string> = {
  [ETH_TYPE]:
    '0x8ecb25b173964465000c7297a50dfdaef7152c165136b6f570a1459d0478204a',
  [USDC_TYPE]:
    '0x50869debb2f34600ebf33b96ec181d89e797c002c3e9c37d4f1f91f8f7ab3ae9',
};

export const EXPLORER_URL = {
  [Network.DEVNET]: (path: string) =>
    `https://explorer-mvmt-m2.web.app/${path}?network=devnet`,
} as Record<Network, (path: string) => string>;

export const TOAST_DURATION = 10000;

export * from './packages';
export * from './routes';
export * from './wrapper-variants';
