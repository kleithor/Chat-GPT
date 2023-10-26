import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { type Session } from 'next-auth';
import { appWithTranslation } from 'next-i18next';
import { type AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

function AppWrapper({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <App Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}

function App({ Component, pageProps }: any) {
  const queryClient = new QueryClient();

  const { data: session, status } = useSession();
  const loading = status === 'loading';

  React.useEffect(() => {
    if (process.env.NODE_ENV != 'production') {
      console.log(session);
    }
  }, [session]);

  if (loading) return null;
  if (!session) {
    signIn();
    return null;
  }

  return (
    <div className={inter.className}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
}

export default appWithTranslation(AppWrapper);
