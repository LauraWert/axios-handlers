import axios, { AxiosRequestConfig } from 'axios'
import sinon from 'sinon'
import { AxiosCacheHandler } from '../../src'
import { axiosCacheHandlerMock } from '../../src/AxiosCacheHandler'
import { onFulfilledRequestInterceptor } from '../../src/types'

describe('AxiosCacheHandler', () => {
  let cacheHandler: AxiosCacheHandler

  beforeEach((): void => {
    cacheHandler = new AxiosCacheHandler()
  })

  it('can create the cache adapter enhancer', (): void => {
    const mocks = axiosCacheHandlerMock({
      cacheAdapterEnhancer: sinon.stub(),
    })

    cacheHandler.getCacheAdapter(axios)

    expect(mocks.cacheAdapterEnhancer).to.be.calledOnceWith()
    axiosCacheHandlerMock()
  })

  context('request interceptor', () => {
    let interceptor: onFulfilledRequestInterceptor
    beforeEach((): void => {
      interceptor = cacheHandler.getRequestInterceptor()
    })

    it('changes the request with cache settings on a het request when config.cache is set', (): void => {
      const mockConfig: AxiosRequestConfig = {
        method: 'get',
        cache: 'key',
      }
      interceptor(mockConfig)

      expect(mockConfig.useCache!.constructor.name).to.equal('LRUCache')
    })

    it('adds the url to the cache when config.cache is string', (): void => {
      const mockConfig: AxiosRequestConfig = {
        baseURL: 'http://base.nl/',
        url: 'path/',
        method: 'get',
        cache: 'key',
      }
      interceptor(mockConfig)

      // @ts-ignore access private prop
      expect(cacheHandler.map.key).to.eql(['http://base.nl/path/'])
    })

    it('adds the url to the cache on all keys when config.cache is string array', (): void => {
      const mockConfig: AxiosRequestConfig = {
        baseURL: 'http://base.nl/',
        url: 'path/',
        method: 'get',
        cache: ['key1', 'key2', 'key3'],
      }
      interceptor(mockConfig)

      // @ts-ignore access private prop
      const map = cacheHandler.map
      expect(map.key1).to.eql(['http://base.nl/path/'])
      expect(map.key2).to.eql(['http://base.nl/path/'])
      expect(map.key3).to.eql(['http://base.nl/path/'])
    })

    it('remove url from cache when reFetch is given', (): void => {
      // @ts-ignore  access private prop
      const normalCache = cacheHandler.normalCache = { del: sinon.stub() }

      const mockConfig: AxiosRequestConfig = {
        baseURL: 'http://base.nl/',
        url: 'path/',
        method: 'get',
        reFetch: true,
      }
      interceptor(mockConfig)

      const url = 'http://base.nl/path/'
      expect(normalCache.del).to.be.calledOnceWith(url)
    })

    it('removes all urls of the given domains on a post call', (): void => {
      const url1 = 'http://base.nl/path_1/'
      const url2 = 'http://base.nl/path_2/'
      // @ts-ignore  access private prop
      const normalCache = cacheHandler.normalCache = { del: sinon.stub() }
      // @ts-ignore  access private prop
      cacheHandler.map = { key: [url1, url2], otherKey: ['other_url'] }

      const mockConfig: AxiosRequestConfig = {
        method: 'post',
        cache: 'key',
      }
      interceptor(mockConfig)

      expect(normalCache.del).to.be.calledTwice
      expect(normalCache.del).to.be.calledWith(url1)
      expect(normalCache.del).to.be.calledWith(url2)
    })

    it('removes the complete throttle cache on a patch call', (): void => {
      // @ts-ignore  access private prop
      const throttleCache = cacheHandler.throttleCache = { reset: sinon.stub() }

      interceptor({ method: 'PATCH' })

      expect(throttleCache.reset).to.be.calledOnce
    })
  })
})
