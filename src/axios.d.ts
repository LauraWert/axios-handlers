import { AxiosError } from 'axios'
import LRU from 'lru-cache'

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface AxiosRequestConfig {
    cache?: string | string[]
    useCache?: boolean | LRU.Cache<string, AxiosPromise> | Cache
    reFetch?: boolean
    handleError?: (_: AxiosError) => boolean
  }
}
