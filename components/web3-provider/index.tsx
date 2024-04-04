import 'react-loading-skeleton/dist/skeleton.css';

import { WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

import { NetworkProvider } from '@/context/network';
import Web3Manager from '@/context/web3-manager';

import ThemeManager from '../theme-manager';

const queryClient = new QueryClient();

const Web3Provider: FC<PropsWithChildren> = ({ children }) => (
  <ThemeManager>
    <NetworkProvider>
      <QueryClientProvider client={queryClient}>
        <WalletProvider autoConnect>
          <Web3Manager>{children}</Web3Manager>
        </WalletProvider>
      </QueryClientProvider>
    </NetworkProvider>
  </ThemeManager>
);

export default Web3Provider;
