import { Box } from '@interest-protocol/ui-kit';
import { FC } from 'react';

import Layout from '@/components/layout';

import CreateTokenForm from './create-pool-form';
import Hero from './hero';

const CreatePoolPage: FC = () => (
  <Layout>
    <Box
      my="3xl"
      display="flex"
      justifyContent="space-around"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <Hero />
      <CreateTokenForm />
    </Box>
  </Layout>
);

export default CreatePoolPage;
