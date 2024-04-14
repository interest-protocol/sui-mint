import { SuiObjectResponse } from '@mysten/sui.js/client';
import { getSuiObjectResponseFields } from '@polymedia/suits';
import BigNumber from 'bignumber.js';
import { pathOr } from 'ramda';
import useSWR from 'swr';

import { STATE_KEY_TO_POOL_ID } from '@/constants/coins';
import { AmmPool, PoolTypeEnum } from '@/interface';
import { makeSWRKey } from '@/utils';
import { getPoolCoinTypes } from '@/utils/pool';

import { useMovementClient } from '../use-movement-client';

const parsePool = (x: SuiObjectResponse): AmmPool => {
  return {
    poolId: STATE_KEY_TO_POOL_ID[pathOr('', ['id', 'id'], x)],
    stateId: pathOr('', ['id', 'id'], x),
    adminBalanceX: BigNumber(
      pathOr('0', ['value', 'fields', 'admin_balance_x'], x)
    ),
    adminBalanceY: BigNumber(
      pathOr('0', ['value', 'fields', 'admin_balance_y'], x)
    ),
    balanceX: BigNumber(pathOr('0', ['value', 'fields', 'balance_x'], x)),
    balanceY: BigNumber(pathOr('0', ['value', 'fields', 'balance_y'], x)),
    decimalsX: BigNumber(pathOr('0', ['value', 'fields', 'decimals_x'], x)).e!,
    decimalsY: BigNumber(pathOr('0', ['value', 'fields', 'decimals_y'], x)).e!,
    fees: {
      feeIn: BigNumber(
        pathOr('0', ['value', 'fields', 'fees', 'fields', 'fee_in_percent'], x)
      ),
      feeOut: BigNumber(
        pathOr('0', ['value', 'fields', 'fees', 'fields', 'fee_out_percent'], x)
      ),
      adminFee: BigNumber(
        pathOr(
          '0',
          ['value', 'fields', 'fees', 'fields', 'admin_fee_percent'],
          x
        )
      ),
    },
    lpCoinSupply: BigNumber(
      pathOr(
        '0',
        [
          'value',
          'fields',
          'lp_coin_cap',
          'fields',
          'total_supply',
          'fields',
          'value',
        ],
        x
      )
    ),
    type: pathOr('', ['value', 'type'], x),
    coinTypes: getPoolCoinTypes(pathOr('', ['value', 'type'], x)),
    poolType: PoolTypeEnum.amm,
    isVolatile: pathOr(
      true,
      ['value', 'fields', 'fees', 'fields', 'volatile'],
      x
    ),
  };
};

export const usePool = (poolAddress: string) => {
  const client = useMovementClient();

  return useSWR<AmmPool | null>(
    makeSWRKey([], usePool.name + poolAddress),
    async () => {
      if (!poolAddress.length) return null;

      const pool = await client.getObject({
        id: poolAddress,
        options: {
          showContent: true,
        },
      });

      return parsePool(getSuiObjectResponseFields(pool));
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshWhenHidden: false,
    }
  );
};

export const usePools = (poolAddresses: string[]) => {
  const client = useMovementClient();

  return useSWR<ReadonlyArray<AmmPool>>(
    makeSWRKey([], usePools.name + poolAddresses),
    async () => {
      if (!poolAddresses.length) return [];

      const pools = await client.multiGetObjects({
        ids: poolAddresses,
        options: {
          showContent: true,
        },
      });

      return pools.map((x) => parsePool(getSuiObjectResponseFields(x)));
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshWhenHidden: false,
    }
  );
};
