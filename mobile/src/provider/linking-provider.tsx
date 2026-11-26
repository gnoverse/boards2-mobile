import * as Linking from 'expo-linking'
import { useEffect } from 'react'
import { broadcastTx, setLinkingData, useAppDispatch } from '@gno/redux'
import { consumeState } from '@gno/utils/callback-state'
import { isWalletCallback } from '@gno/utils/wallet-callback'

const LinkingProvider = ({ children }: { children: React.ReactNode }) => {
  // Not `useURL`: when the OS killed the app, Android restores it with the
  // callback before JavaScript runs, and React Native drops that URL. This hook
  // reads it from the native side, which keeps it.
  const url = Linking.useLinkingURL()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!url || !isWalletCallback(url)) return
    const linkingParsedURL = Linking.parse(url)
    console.log('wallet callback received')

    // The callback scheme is public — anything installed can open
    // `land.gno.boards2:/…` — so accept only a callback echoing a single-use
    // `state` we issued. A missing one is rejected too: every link we open
    // sends one, and exempting them would let a forger skip the check by
    // omitting the parameter.
    const { state, status, signedtx } = (linkingParsedURL.queryParams ?? {}) as Record<string, string | undefined>
    if (!state || !consumeState(state)) {
      console.warn('ignoring gnokey callback with missing or unknown state')
      return
    }

    if (status === 'success' && signedtx) {
      // `signedtx` is base64 amino-binary, which the RPC takes as is. The standard
      // requires we broadcast it unmodified — see `broadcast`.
      dispatch(broadcastTx({ state, signedTx: signedtx }))
    } else {
      dispatch(setLinkingData(linkingParsedURL))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return <>{children}</>
}

export { LinkingProvider }
