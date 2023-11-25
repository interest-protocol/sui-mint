import { Box, Button, Typography } from '@interest-protocol/ui-kit';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';

import { MinusSVG, PlusSVG } from '@/svg';

import { SlippageInfoProps } from './manage-slippage-form.types';

const SlippageInfo: FC<SlippageInfoProps> = ({
  isOpen,
  formSettings,
  handleManageView,
}) => {
  const Settings = useWatch({
    control: formSettings.control,
  });

  const ManageIcon = isOpen ? MinusSVG : PlusSVG;

  return (
    <Box
      px="1rem"
      py="0.25rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="label" size="large" fontSize="0.875rem">
        Slippage:
        <Typography
          ml="xs"
          as="span"
          size="large"
          color="primary"
          variant="label"
        >
          {Settings.slippage}%
        </Typography>
      </Typography>
      <Button isIcon variant="text" onClick={handleManageView}>
        <ManageIcon maxWidth="1.25rem" maxHeight="1.25rem" width="100%" />
      </Button>
    </Box>
  );
};

export default SlippageInfo;
