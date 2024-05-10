import { SuiClient } from '@mysten/sui.js/client';
import { PaginatedCoins } from '@mysten/sui.js/client';

import {
  AllObjects,
  ObjectData,
} from '@/components/web3-manager/all-objects-manager/all-objects.types';
import { LocalTokenMetadataRecord } from '@/interface';

import { CoinsMap } from '../../components/web3-manager/coins-manager/web3-manager.types';

export interface UseObjectsResponse {
  error: boolean;
  loading: boolean;
  ownedNfts: ReadonlyArray<ObjectData>;
  coinsObjects: ReadonlyArray<ObjectData>;
  otherObjects: ReadonlyArray<ObjectData>;
  updateError: (data: boolean) => void;
  updateLoading: (data: boolean) => void;
  updateAllObjects: (data: AllObjects) => void;
}

export interface ParseCoinsArgs {
  data: CoinsMap;
  localTokens: LocalTokenMetadataRecord;
}

export interface GetAllCoinsArgs {
  client: SuiClient;
  account: string;
}

export interface GetAllCoinsInternalArgs extends GetAllCoinsArgs {
  data: PaginatedCoins['data'];
  cursor: PaginatedCoins['nextCursor'];
  hasNextPage: boolean;
}
