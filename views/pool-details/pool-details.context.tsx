import { values } from 'ramda';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

import { useNetwork } from '@/context/network';
import { useGetCoinMetadata } from '@/hooks/use-get-coin-metadata';
import useGetMultipleTokenPriceBySymbol from '@/hooks/use-get-multiple-token-price-by-symbol';
import { usePool } from '@/hooks/use-pools';
import { isClammPool } from '@/hooks/use-pools/use-pools.utils';
import { Pool } from '@/interface';
import { CoinMetadataWithType } from '@/interface';

import { getAllSymbols } from '../pools/pools.utils';

interface PoolDetailsProviderProps {
  objectId: string;
}

interface PoolDetailsContext {
  loading: boolean;
  pool: Pool | null | undefined;
  prices: Record<string, number> | undefined;
  metadata: Record<string, CoinMetadataWithType> | undefined;
}

const INITIAL: PoolDetailsContext = {
  pool: null,
  loading: true,
  prices: undefined,
  metadata: undefined,
};

const poolDetailsContext = createContext<PoolDetailsContext>(INITIAL);

export const PoolDetailsProvider: FC<
  PropsWithChildren<PoolDetailsProviderProps>
> = ({ objectId, children }) => {
  const network = useNetwork();
  const { Provider } = poolDetailsContext;

  const {
    data: pool,
    error: poolError,
    isLoading: isPoolLoading,
  } = usePool(objectId);

  const {
    data: metadata,
    error: metadataError,
    isLoading: isMetadataLoading,
  } = useGetCoinMetadata(
    pool
      ? isClammPool(pool)
        ? pool.coinStates.map((coin) => coin.type)
        : values(pool.coinTypes)
      : []
  );

  const {
    data: prices,
    isLoading: isPricesLoading,
    error: pricesError,
  } = useGetMultipleTokenPriceBySymbol(
    getAllSymbols(pool ? [pool] : [], network)
  );

  const loading =
    isPoolLoading ||
    (!pool && !poolError) ||
    isMetadataLoading ||
    (!metadata && !metadataError) ||
    isPricesLoading ||
    (!prices && !pricesError);

  return (
    <Provider value={{ loading, pool, prices, metadata }}>{children}</Provider>
  );
};

export const usePoolDetails = () => useContext(poolDetailsContext);