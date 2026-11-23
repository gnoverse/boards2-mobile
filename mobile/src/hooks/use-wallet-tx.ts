import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { selectLastTx, useAppDispatch, useAppSelector } from '@gno/redux'

/** How long to wait for the answer once the user is back without one. */
const ANSWER_GRACE_MS = 3000

/**
 * Sends a transaction through the wallet and follows its outcome.
 *
 * `send` takes the action of a thunk which returns the `state` of its request.
 * `pending` is true from there until the transaction is in a block, or the
 * wallet or the chain refused it. The snackbar says why, so the screen only has
 * to stop waiting and keep its form.
 *
 * Only this screen's own request is followed, so a screen kept mounted under
 * another one does not react to a transaction which is not its own.
 */
export const useWalletTx = (onCommitted: () => void) => {
  const dispatch = useAppDispatch()
  const lastTx = useAppSelector(selectLastTx)

  const [requestState, setRequestState] = useState<string | undefined>(undefined)
  const [pending, setPending] = useState(false)

  const status = requestState !== undefined && lastTx?.state === requestState ? lastTx?.status : undefined

  useEffect(() => {
    if (status === 'broadcasting') setPending(true)
    if (status !== 'committed' && status !== 'failed') return
    setRequestState(undefined)
    setPending(false)
    if (status === 'committed') onCommitted()
    // `onCommitted` is a new closure each render; this must run once per outcome.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // A launch is not a promise of an answer. If the user comes back without one,
  // stop waiting, but still accept it if it arrives later.
  useEffect(() => {
    if (!pending || status) return

    let timeout: ReturnType<typeof setTimeout> | undefined
    const subscription = AppState.addEventListener('change', (appState) => {
      clearTimeout(timeout)
      if (appState === 'active') timeout = setTimeout(() => setPending(false), ANSWER_GRACE_MS)
    })
    return () => {
      clearTimeout(timeout)
      subscription.remove()
    }
  }, [pending, status])

  const send = async (action: unknown) => {
    setPending(true)
    try {
      setRequestState(await dispatch(action).unwrap())
    } catch (error) {
      // Nothing reached the wallet, so no answer will come.
      console.error('could not send the request to the wallet', error)
      setPending(false)
    }
  }

  return { send, pending }
}
