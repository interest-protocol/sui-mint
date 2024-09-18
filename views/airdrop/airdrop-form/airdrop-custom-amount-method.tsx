import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';

import AirdropCommonAmountTextField from './airdrop-common-amount-text-field';
import AirdropCustomAmount from './airdrop-custom-amount';
import AirdropCustomAmountTextArea from './airdrop-custom-amount-text-area';

const AirdropCustomAmountMethod: FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleCustomAmount = () => {
    setIsActive(!isActive);
  };
  return (
    <Box>
      <Box pb="m">
        <Typography variant="body" size="large" mb="m">
          3. Choose amount & who to send:
        </Typography>
        <AirdropCustomAmount
          isCustomAmountActive={isActive}
          handleCustomAmount={handleCustomAmount}
          message="Activate this option to send different amounts simultaneously to various wallets."
        />
        <Typography variant="body" size="medium">
          Enter amount to send {isActive && 'for each'}
        </Typography>
        <Box>
          <AirdropCommonAmountTextField />
        </Box>
      </Box>
      <AirdropCustomAmountTextArea />
    </Box>
  );
};

export default AirdropCustomAmountMethod;
