import { Box, Typography } from '@interest-protocol/ui-kit';
import { formatNumber } from '@polymedia/suits';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { AnalyticsCardProps } from './analytics.types';

const AnalyticsCard: FC<AnalyticsCardProps> = ({
  title,
  quantity,
  Icon,
  loading,
}) => (
  <Box
    p="xl"
    gap="m"
    display="flex"
    borderRadius="xs"
    color="onSurface"
    bg="highContainer"
    flexDirection="column"
  >
    <Box display="flex" justifyContent="space-between">
      <Typography variant="title" size="medium">
        {title}
      </Typography>
      <Icon maxHeight="2rem" maxWidth="2rem" width="100%" />
    </Box>
    <Typography variant="headline" size="large">
      {loading ? <Skeleton width="10rem" /> : formatNumber(quantity)}
    </Typography>
  </Box>
);

export default AnalyticsCard;
