import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { StorybookLayout } from '../storybook/StorybookLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StorybookLayout>
      <Component {...pageProps} />
    </StorybookLayout>
  );
}
