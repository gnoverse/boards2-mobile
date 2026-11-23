/** Where the wallet answers. It is not a route: app/+native-intent.ts keeps it from the router. */
export const CALLBACK_URL = 'land.gno.boards2://gnoconnect'

export const isWalletCallback = (url: string): boolean => url.split(/[?#]/)[0].replace(/\/$/, '') === CALLBACK_URL
