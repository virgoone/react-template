
interface Window {
  __webpack_public_path__: string
  __APP_LOADED__: boolean
  wxjs_is_wkwebview: any
}

interface NodeModule {
  hot: any
}

interface ESModule {
  __esModule: boolean
  default: any
}

declare let __webpack_public_path__: string

declare const __DEV__: boolean
declare const APP_ENV: string

declare module '*.less'

declare module '*.png'

declare module '*.less?useable'

declare module 'penv.macro'

declare module 'debug'