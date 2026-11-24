import { useCallback, useRef } from 'react'
import { useFocusEffect } from 'expo-router'
import { selectCommittedTxCount, useAppSelector } from '@gno/redux'

/**
 * Refreshes a screen whose data predates a transaction, from this screen or from
 * one above it. A screen which is not visible waits until it is.
 */
export const useRefreshAfterTx = (refresh: () => void) => {
  const committedTxCount = useAppSelector(selectCommittedTxCount)
  const seen = useRef(committedTxCount)

  useFocusEffect(
    useCallback(() => {
      if (seen.current === committedTxCount) return
      seen.current = committedTxCount
      refresh()
      // `refresh` is a new closure each render; this must run once per transaction.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [committedTxCount])
  )
}
