import { AlertProvider } from '@/src/components/AlertProvider'
import { LoginStateProvider } from '@/src/components/LoginProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppNavBar } from '../components/AppNavBar'

export default function App({ Component, pageProps }: AppProps) {
  return (<AlertProvider>
    <LoginStateProvider>
      <div className='p-3'>
        <AppNavBar />
        <div><Component {...pageProps} /></div>
      </div>
    </LoginStateProvider>
  </AlertProvider>)
}



