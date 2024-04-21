import { Box } from '@interest-protocol/ui-kit';
import Link from 'next/link';
import { FC } from 'react';
import { v4 } from 'uuid';

import { Routes, RoutesEnum } from '@/constants';
import { isClammPool } from '@/hooks/use-pools/use-pools.utils';
import { AmmPool, PoolTypeEnum } from '@/interface';
import { FixedPointMath } from '@/lib';
import { formatDollars } from '@/utils';

import { LINES } from './pool-card.data';
import { AlgorithmEnum, PoolCardProps } from './pool-card.types';
import { getAmmLiquidity, getClammLiquidity } from './pool-card.utils';
import PoolCardHeader from './pool-card-header';
import PoolCardInfo from './pool-card-info';
import PoolCardTrade from './pool-card-trade';

const PoolCard: FC<PoolCardProps> = ({ pool, coinMetadata, prices }) => {
  const coinTypes = isClammPool(pool)
    ? pool.coinStates.map(({ type }) => type)
    : [pool.coinTypes.coinX, pool.coinTypes.coinY];

  const liquidity = isClammPool(pool)
    ? getClammLiquidity(pool)
    : getAmmLiquidity(pool, coinMetadata, prices);

  return (
    <Link href={`${Routes[RoutesEnum.PoolDetails]}?objectId=${pool.poolId}`}>
      <Box
        p="m"
        flex="1"
        gap="xs"
        height="100%"
        display="flex"
        borderRadius="xs"
        bg="lowestContainer"
        flexDirection="column"
        border="0.063rem solid"
        borderColor="outlineVariant"
        justifyContent="space-between"
        transition="all 300ms ease-in-out"
        nHover={{
          cursor: 'pointer',
          borderColor: '#76767A',
          boxShadow: '0px 24px 46px -10px rgba(13, 16, 23, 0.16)',
          '.arrow-wrapper': { opacity: 1 },
        }}
      >
        <PoolCardHeader
          tags={[
            PoolTypeEnum[pool.poolType],
            (pool as AmmPool).isVolatile
              ? AlgorithmEnum.volatile
              : AlgorithmEnum.stable,
          ]}
        />
        <PoolCardInfo coinTypes={coinTypes} coinMetadata={coinMetadata} />
        <Box px="m" py="xs" bg="surface" borderRadius="1rem">
          {LINES.map((line, index) => (
            <PoolCardTrade
              {...line}
              index={index}
              key={v4()}
              amount={
                !pool
                  ? '0'
                  : index
                    ? !prices
                      ? '0'
                      : `${formatDollars(liquidity)}`
                    : `${FixedPointMath.toNumber(
                        isClammPool(pool) ? pool.fees.midFee : pool.fees.feeIn,
                        15
                      )}% / ${FixedPointMath.toNumber(isClammPool(pool) ? pool.fees.midFee : pool.fees.feeOut, 15)}%`
              }
            />
          ))}
        </Box>
      </Box>
    </Link>
  );
};

export default PoolCard;