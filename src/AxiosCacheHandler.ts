import { AxiosAdapter, AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { cacheAdapterEnhancer as orgCacheAdapterEnhancer } from 'axios-extensions'
import LRU from 'lru-cache'
import { onFulfilledRequestInterceptor } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function axiosCacheHandlerMock(mocks: { [_: string]: any } = {}): { [_: string]: any } {
  cacheAdapterEnhancer = mocks.cacheAdapterEnhancer || orgCacheAdapterEnhancer
  return mocks
}

type CacheMap = Record<string, string[]>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CacheContainer = LRU.Cache<string, AxiosPromise<any>>

export interface IAxiosCacheHandlerProps {
  maxThrottleAge?: number
}

let cacheAdapterEnhancer = orgCacheAdapterEnhancer

export class AxiosCacheHandler {
  private readonly map: CacheMap = {}
  private readonly normalCache: CacheContainer
  private readonly throttleCache: CacheContainer

  constructor(props: IAxiosCacheHandlerProps = {}) {
    const maxThrottleAge = props.maxThrottleAge === undefined ? 1000 : props.maxThrottleAge
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.normalCache = new LRU<string, AxiosPromise<any>>({ max: 100 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.throttleCache = new LRU<string, AxiosPromise<any>>({ maxAge: maxThrottleAge, max: 100 })
  }

  public getCacheAdapter(client: AxiosInstance): AxiosAdapter {
    return cacheAdapterEnhancer(client.defaults.adapter!, {
      enabledByDefault: true,
      defaultCache: this.throttleCache,
      cacheFlag: 'useCache',
    })
  }

  public getRequestInterceptor(): onFulfilledRequestInterceptor {
    return (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (['get', 'GET'].includes(config.method!)) {
        const url = config.baseURL + config.url!
        if (config.cache !== undefined) {
          this.addRequestToCacheMap(config.cache, url)
          config.useCache = this.normalCache
        }

        if (config.reFetch) {
          this.deleteCache(url)
        }
      }

      if (['post', 'POST', 'put', 'PUT', 'patch', 'PATCH', 'delete', 'DELETE'].includes(config.method!)) {
        this.throttleCache.reset()
        if (config.cache !== undefined) {
          this.clearCacheForDomains(config.cache)
        }
      }

      return config
    }
  }

  private addRequestToCacheMap(domains: string | string[], url: string): void {
    domains = (Array.isArray(domains) ? domains : [domains])
    domains.forEach((key: string) => {
      if (this.map[key] === undefined) {
        this.map[key] = []
      }

      if (this.map[key].includes(url)) {
        return
      }

      this.map[key].push(url)
    })
  }

  private clearCacheForDomains(domains: string | string[]): void {
    domains = (Array.isArray(domains) ? domains : [domains])
    domains.forEach((domain: string) => {
      if (!this.map[domain]) return
      this.map[domain].forEach((url: string) => {
        this.deleteCache(url)
      })
    })
  }

  private deleteCache(url: string): void {
    this.normalCache.del(url)
  }
}
