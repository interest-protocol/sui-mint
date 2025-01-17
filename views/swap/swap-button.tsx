import { Button, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { ExplorerMode } from '@/constants';
import { useDialog } from '@/hooks/use-dialog';
import { useGetExplorerUrl } from '@/hooks/use-get-explorer-url';
import {
  signAndExecute,
  throwTXIfNotSuccessful,
  waitForTx,
  ZERO_BIG_NUMBER,
} from '@/utils';
import { SwapForm } from '@/views/swap/swap.types';

import SuccessModal from '../components/success-modal';
import SuccessModalTokenCard from '../components/success-modal/success-modal-token-card';
import { SwapMessagesEnum } from './swap.data';
import { useSwap } from './swap.hooks';

const SwapButton: FC = () => {
  const swap = useSwap();
  const suiClient = useSuiClient();
  const getExplorerUrl = useGetExplorerUrl();
  const currentAccount = useCurrentAccount();
  const formSwap = useFormContext<SwapForm>();
  const { dialog, handleClose } = useDialog();

  const signTransaction = useSignTransaction();

  const resetInput = () => {
    formSwap.setValue('to.display', '0');
    formSwap.setValue('from.display', '0');
    formSwap.setValue('from.value', ZERO_BIG_NUMBER);
  };

  const onClose = () => {
    handleClose();
    resetInput();
  };

  const swapping = useWatch({
    control: formSwap.control,
    name: 'swapping',
  });

  const readyToSwap = useWatch({
    control: formSwap.control,
    name: 'readyToSwap',
  });

  const gotoExplorer = () => {
    window.open(
      formSwap.getValues('explorerLink'),
      '_blank',
      'noopener,noreferrer'
    );

    formSwap.setValue('explorerLink', '');
  };

  const handleSwap = async () => {
    try {
      invariant(currentAccount, 'Need to connect wallet');

      formSwap.setValue('swapping', true);

      const tx = await swap(formSwap.getValues());

      const tx2 = await signAndExecute({
        tx,
        suiClient,
        currentAccount,
        signTransaction,
      });

      throwTXIfNotSuccessful(tx2);
      formSwap.setValue('executionTime', tx2.time);

      await waitForTx({ suiClient, digest: tx2.digest });

      formSwap.setValue(
        'explorerLink',
        getExplorerUrl(tx2.digest, ExplorerMode.Transaction)
      );
    } finally {
      formSwap.setValue('swapping', false);
    }
  };

  const onSwap = async () => {
    readyToSwap &&
      (await dialog.promise(handleSwap(), {
        loading: () => ({
          title: 'Swapping...',
          message: SwapMessagesEnum.swapping,
        }),
        error: () => ({
          title: 'Swap Failure',
          message: SwapMessagesEnum.swapFailure,
          primaryButton: { label: 'Try again', onClick: onClose },
        }),
        success: () => ({
          title: 'Swap Successful',
          message: (
            <SuccessModal
              transactionTime={`${+(
                formSwap.getValues('executionTime') / 1000
              ).toFixed(2)}`}
            >
              <SuccessModalTokenCard
                from={formSwap.getValues('from')}
                to={formSwap.getValues('to')}
              />
            </SuccessModal>
          ),
          primaryButton: {
            label: 'See on Explorer',
            onClick: gotoExplorer,
          },
          secondaryButton: {
            label: 'got it',
            onClick: onClose,
          },
        }),
      }));
  };

  return (
    <Button
      onClick={onSwap}
      variant="filled"
      disabled={!readyToSwap}
      justifyContent="center"
    >
      <Typography variant="label" size="large">
        {swapping ? 'Swapping...' : 'Swap'}
      </Typography>
    </Button>
  );
};

export default SwapButton;
