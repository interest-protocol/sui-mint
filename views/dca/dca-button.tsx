import { WITNESSES } from '@interest-protocol/dca-sdk';
import { Button, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
  useSuiClientContext,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { EXPLORER_URL, Network } from '@/constants';
import useDcaSdk from '@/hooks/use-dca-sdk';
import { useDialog } from '@/hooks/use-dialog';
import { useWeb3 } from '@/hooks/use-web3';
import { coinOfValue, signAndExecute, ZERO_BIG_NUMBER } from '@/utils';
import { DCAForm } from '@/views/dca/dca.types';

import { DCAMessagesEnum } from './dca.data';

const DELEGATEE =
  '0xc23ea8e493616b1510d9405ce05593f8bd1fb30f44f92303ab2c54f6c8680ecb';

const DCAButton: FC = () => {
  const dcaSdk = useDcaSdk();
  const { coinsMap } = useWeb3();
  const suiClient = useSuiClient();
  const formDCA = useFormContext<DCAForm>();
  const { network } = useSuiClientContext();
  const currentAccount = useCurrentAccount();
  const { dialog, handleClose } = useDialog();
  const signTransaction = useSignTransaction();

  const resetInput = () => {
    formDCA.setValue('to.display', '0');
    formDCA.setValue('from.display', '0');
    formDCA.setValue('from.value', ZERO_BIG_NUMBER);
  };

  const starting = useWatch({
    control: formDCA.control,
    name: 'starting',
  });

  const gotoExplorer = () => {
    window.open(
      formDCA.getValues('explorerLink'),
      '_blank',
      'noopener,noreferrer'
    );

    formDCA.setValue('explorerLink', '');
  };

  const handleStartDCA = async () => {
    try {
      const { to, from, intervals, orders, periodicity, min, max } =
        formDCA.getValues();

      invariant(currentAccount, 'Need to connect wallet');

      formDCA.setValue('starting', true);

      const initTx = new Transaction();

      const coinIn = coinOfValue({
        coinsMap,
        tx: initTx,
        coinType: from.type,
        coinValue: from.value.toString(),
      });

      const tx = dcaSdk.newAndShare({
        tx: initTx,
        coinOutType: to.type,
        coinInType: from.type,
        coinIn,
        timeScale: periodicity,
        numberOfOrders: Number(orders),
        every: Number(intervals),
        delegatee: DELEGATEE,
        min: BigInt(min.value.toString()),
        max: BigInt(max.value.toString()),
        witnessType: WITNESSES.testnet.WHITELIST_ADAPTER,
      });

      const txResult = await signAndExecute({
        tx,
        suiClient,
        currentAccount,
        signTransaction,
      });

      formDCA.setValue(
        'explorerLink',
        `${EXPLORER_URL[network as Network]}/tx/${txResult.digest}`
      );
    } catch (e) {
      console.log({ e });
      throw e;
    } finally {
      resetInput();
      formDCA.setValue('starting', false);
    }
  };

  const onStartDCA = () =>
    dialog.promise(handleStartDCA(), {
      loading: () => ({
        title: 'Starting DCA...',
        message: DCAMessagesEnum.starting,
      }),
      error: () => ({
        title: 'DCA Failure',
        message: DCAMessagesEnum.dcaFailure,
        primaryButton: { label: 'Try again', onClick: handleClose },
      }),
      success: () => ({
        title: 'DCA Successfully',
        message: DCAMessagesEnum.dcaSuccess,
        primaryButton: {
          label: 'See on Explorer',
          onClick: gotoExplorer,
        },
        secondaryButton: (
          <Button variant="outline" mr="s" onClick={handleClose}>
            got it
          </Button>
        ),
      }),
    });

  return (
    <Button onClick={onStartDCA} variant="filled" justifyContent="center">
      <Typography variant="label" size="large">
        {starting ? 'Loading...' : 'Start DCA'}
      </Typography>
    </Button>
  );
};

export default DCAButton;
