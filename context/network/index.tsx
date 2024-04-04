import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { RPC_URL } from '@/constants';
import { Network } from '@/constants/network';

interface INetworkContext {
  network: Network;
  changeNetwork: (network: Network) => void;
}

const LOCAL_NETWORK_KEY = 'movement:network';

const networkContext = createContext<INetworkContext>({} as INetworkContext);

const { networkConfig } = createNetworkConfig({
  [Network.TESTNET]: {
    url: RPC_URL[Network.TESTNET] || getFullnodeUrl('testnet'),
  },
  [Network.DEVNET]: {
    url: RPC_URL[Network.DEVNET] || getFullnodeUrl('devnet'),
  },
});

export const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  const { Provider } = networkContext;
  const [network, setNetwork] = useState<Network>(Network.DEVNET);

  useEffect(() => {
    setNetwork(
      (window.localStorage.getItem(LOCAL_NETWORK_KEY) as Network) ??
        Network.DEVNET
    );
  }, []);

  const changeNetwork = (network: Network) => {
    setNetwork(network);
    window.localStorage.setItem(LOCAL_NETWORK_KEY, network);
  };

  return (
    <SuiClientProvider
      network={network}
      networks={networkConfig}
      onNetworkChange={(network) => {
        changeNetwork(network);
      }}
    >
      <Provider value={{ network, changeNetwork }}>{children}</Provider>
    </SuiClientProvider>
  );
};

export const useNetwork = () => useContext(networkContext);

export default networkContext;
