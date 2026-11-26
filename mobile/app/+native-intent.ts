import { isWalletCallback } from '@gno/utils/wallet-callback'

/**
 * Keeps the wallet's answers from the router; LinkingProvider handles them.
 *
 * Coming back from the wallet, the screen which made the request is still there
 * with its form, so there is nowhere to go. If the OS killed the app meanwhile
 * that screen is gone, so open the root.
 */
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }): string | null {
  if (!isWalletCallback(path)) return path
  return initial ? '/' : null
}
