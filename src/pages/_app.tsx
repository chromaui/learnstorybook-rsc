import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { StorybookModal } from '../storybook/StorybookModal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <StorybookModal />
      <Component {...pageProps} />
    </>
  );
}
