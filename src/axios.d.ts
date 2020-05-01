import { AxiosError } from 'axios'

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface AxiosRequestConfig {
    cacheDomain?: string | string[]
    reFetch?: boolean
    errorHandler?: (_: AxiosError) => boolean
  }
}
