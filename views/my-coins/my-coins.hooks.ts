import { CoinMetadata } from '@mysten/sui.js/client';
import { useWalletKit } from '@mysten/wallet-kit';
import { values } from 'ramda';
import { useEffect, useState } from 'react';

import { SuiNetwork, useSuiClient } from '@/hooks/use-sui-client';

import {
  ICoinResponse,
  TCoinWithMetadata,
  TGetAllCoins,
  TGetOwnedTypes,
  TUseGetAllCoinsWithMetadata,
} from './my-coins.types';

const getOwnedTypes: TGetOwnedTypes = async (
  provider,
  account,
  cursor = null
) => {
  const { data, nextCursor, hasNextPage } = await provider.getOwnedObjects({
    owner: account,
    cursor,
    options: {
      showType: true,
    },
  });

  if (!hasNextPage)
    return data
      .filter(
        ({ error, data }) =>
          !error && data?.type!.startsWith('0x2::coin::TreasuryCap')
      )
      .map(({ data }) =>
        data!.type!.split('0x2::coin::TreasuryCap<')[1].slice(0, -1)
      );

  const newData = await getOwnedTypes(provider, account, nextCursor);

  return [
    ...data
      .filter(
        ({ error, data }) =>
          !error && data?.type!.startsWith('0x2::coin::TreasuryCap')
      )
      .map(({ data }) =>
        data!.type!.split('0x2::coin::TreasuryCap<')[1].slice(0, -1)
      ),
    ...newData,
  ];
};

const getAllCoins: TGetAllCoins = async (provider, account, cursor = null) => {
  const { data, nextCursor, hasNextPage } = await provider.getAllCoins({
    owner: account,
    cursor,
  });

  if (!hasNextPage) return data;

  const newData = await getAllCoins(provider, account, nextCursor);

  return [...data, ...newData];
};

export const useGetAllCoinsWithMetadata: TUseGetAllCoinsWithMetadata = () => {
  const { currentAccount } = useWalletKit();
  const suiClient = useSuiClient(
    (currentAccount?.chains?.[0] as SuiNetwork) ?? 'sui:mainnet'
  );
  const [error, setError] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ReadonlyArray<TCoinWithMetadata>>([]);

  useEffect(() => {
    if (currentAccount)
      (async () => {
        try {
          const coinsRaw = await getAllCoins(suiClient, currentAccount.address);

          const ownedTypes = await getOwnedTypes(
            suiClient,
            currentAccount.address
          );

          console.log('>> ownedTypes :: ', ownedTypes);

          const coinsRawMap = coinsRaw.reduce(
            (acc, coinRaw) => ({
              ...acc,
              [coinRaw.coinType]: {
                ...acc[coinRaw.coinType],
                ...coinRaw,
                balance: String(
                  Number(coinRaw.balance) +
                    Number(acc[coinRaw.coinType]?.balance || '0')
                ),
                owned:
                  ownedTypes.includes(coinRaw.coinType) ||
                  acc[coinRaw.coinType]?.owned ||
                  false,
                objects: (acc[coinRaw.coinType]?.objects ?? []).concat(coinRaw),
              },
            }),
            {} as Record<string, ICoinResponse>
          );

          const coinsMetadata: ReadonlyArray<CoinMetadata | null> =
            await Promise.all(
              values(coinsRawMap).map(({ coinType }) =>
                suiClient.getCoinMetadata({ coinType })
              )
            );

          setData(
            values(coinsRawMap).map((coin, index) => ({
              ...coin,
              ...(coinsMetadata[index] as CoinMetadata),
            }))
          );
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      })();
  }, []);

  return {
    coins: (data ?? []) as ReadonlyArray<TCoinWithMetadata>,
    isLoading,
    error,
  };
};
