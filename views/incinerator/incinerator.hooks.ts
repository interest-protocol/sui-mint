import {
  useCurrentAccount,
  useSignTransactionBlock,
  useSuiClient,
} from '@mysten/dapp-kit';
import { SuiTransactionBlockResponse } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  CoinObjectData,
  ObjectData,
} from '@/context/all-objects/all-objects.types';
import { CoinObject } from '@/hooks/use-get-all-coins/use-get-all-coins.types';
import { useWeb3 } from '@/hooks/use-web3';
import { FixedPointMath } from '@/lib';
import { throwTXIfNotSuccessful } from '@/utils';
import { ZERO_BIG_NUMBER } from '@/utils';
import { isCoinObject } from '@/views/components/select-object-modal/select-object-modal.utils';

import {
  IncineratorForm,
  IncineratorTabEnum,
  ObjectField,
} from './incinerator.types';

export const useIncineratorManager = () => {
  const currentAccount = useCurrentAccount();
  const { control, setValue } = useFormContext<IncineratorForm>();
  const tab = useWatch({ control: control, name: 'tab' });
  const checked = useWatch({ control: control, name: 'checked' });
  const {
    objects,
    coinsMap,
    ownedNfts,
    otherObjects,
    coinsObjects,
    isFetchingCoinBalances,
  } = useWeb3();

  const formObjects = useWatch({
    control,
    name: 'objects',
  });

  const displayObjects = {
    [IncineratorTabEnum.All]: objects,
    [IncineratorTabEnum.Coin]: coinsObjects,
    [IncineratorTabEnum.NFT]: ownedNfts,
    [IncineratorTabEnum.Other]: otherObjects,
  };

  const updateAssets = (active: boolean) => {
    setValue(
      'objects',
      displayObjects[tab].map((object: ObjectData, index) => {
        const coin = coinsMap[(object.display as CoinObject)?.type];
        const editable = coin && coin.balance && !coin.balance.isZero();

        return {
          index,
          ...object,
          value: coin
            ? `${FixedPointMath.toNumber(coin.balance, coin.decimals)}`
            : '1',
          editable,
          isEditing: false,
          active,
        };
      })
    );
  };

  const updateBalances = () => {
    setValue(
      'objects',
      formObjects.map((object: ObjectField): ObjectField => {
        if (!object.display) return object;

        if (!object.display.balance) return object;

        const coin = coinsMap[(object.display as CoinObject).type] ?? {
          balance: ZERO_BIG_NUMBER,
          decimals: 0,
        };

        return {
          ...object,
          display: {
            ...object.display,
            balance: coin.balance,
          } as CoinObjectData['display'],
          ...(!object.isEditing && {
            value: coin.balance.lt(
              FixedPointMath.toBigNumber(object.value, coin.decimals)
            )
              ? String(FixedPointMath.toNumber(coin.balance, coin.decimals))
              : object.value,
          }),
        };
      })
    );
  };

  useEffect(() => {
    if (!isFetchingCoinBalances && currentAccount && !formObjects.length)
      updateAssets(checked);
  }, [isFetchingCoinBalances]);

  useEffect(() => {
    if (objects.length !== formObjects.length) {
      updateAssets(checked);
      return;
    }
    if (coinsMap) updateBalances();
  }, [objects, coinsMap]);

  useEffect(() => {
    updateAssets(checked);
  }, [checked, tab, currentAccount]);

  return;
};

export const useBurn = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const signTransactionBlock = useSignTransactionBlock();

  return async (
    objects: ReadonlyArray<ObjectField>,
    onSuccess: (tx: SuiTransactionBlockResponse) => void
  ) => {
    if (!suiClient) throw new Error('Provider not found');
    if (!currentAccount) throw new Error('There is not an account');

    const txb = new TransactionBlock();

    const objectsToTransfer = objects.map((object) => {
      if (!isCoinObject(object as ObjectData)) return object.objectId;

      const [firstCoin, ...otherCoins] = (object as CoinObjectData).display
        .objects;

      const firstCoinObject = txb.object(firstCoin.coinObjectId);

      if (otherCoins.length)
        txb.mergeCoins(
          firstCoinObject,
          otherCoins.map((coin) => coin.coinObjectId)
        );

      const [splittedCoin] = txb.splitCoins(firstCoinObject, [
        txb.pure(
          FixedPointMath.toBigNumber(
            object.value,
            Number(object.display!.decimals!)
          ).toString()
        ),
      ]);

      return splittedCoin;
    });

    txb.transferObjects(objectsToTransfer, txb.pure.address('0x0'));

    const { transactionBlockBytes, signature } =
      await signTransactionBlock.mutateAsync({
        transactionBlock: txb,
      });

    const tx = await suiClient.executeTransactionBlock({
      transactionBlock: transactionBlockBytes,
      signature,
      requestType: 'WaitForLocalExecution',
      options: {
        showEffects: true,
      },
    });

    throwTXIfNotSuccessful(tx);

    onSuccess(tx);
  };
};
