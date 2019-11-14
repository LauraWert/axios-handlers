import { AxiosInstance } from 'axios'
import { AxiosCacheHandler, IAxiosCacheHandlerProps } from './AxiosCacheHandler'
import { AxiosErrorHandler } from './AxiosErrorHandler'
import { AxiosImmutableHandler } from './AxiosImmutableHandler'
import { AxiosLoadingHandler } from './AxiosLoadingHandler'

interface IAxiosHandlers {
  cacheHandler: AxiosCacheHandler
  errorHandler: AxiosErrorHandler
  immutableHandler: AxiosImmutableHandler
  loadingHandler: AxiosLoadingHandler
}

export function installCacheHandler(client: AxiosInstance, props?: IAxiosCacheHandlerProps): AxiosCacheHandler {
  const axiosCacheHandler = new AxiosCacheHandler(props)
  client.defaults.adapter = axiosCacheHandler.getCacheAdapter(client)
  client.interceptors.request.use(axiosCacheHandler.getRequestInterceptor())
  return axiosCacheHandler
}

export function installErrorHandler(client: AxiosInstance): AxiosErrorHandler {
  const axiosErrorHandler = new AxiosErrorHandler()
  client.interceptors.response.use(
    (v) => v,
    axiosErrorHandler.getErrorInterceptor(),
  )
  return axiosErrorHandler
}

export function installImmutableHandler(client: AxiosInstance): AxiosImmutableHandler {
  const axiosImmutableHandler = new AxiosImmutableHandler()
  client.interceptors.response.use(axiosImmutableHandler.getAxiosImmutableInterceptor())
  return axiosImmutableHandler
}

export function installLoadingHandler(client: AxiosInstance): AxiosLoadingHandler {
  const axiosLoadingHandler = new AxiosLoadingHandler()
  client.interceptors.request.use(axiosLoadingHandler.getAxiosRequestInterceptor())
  client.interceptors.response.use(
    axiosLoadingHandler.getAxiosFulfilledResponseInterceptor(),
    axiosLoadingHandler.getAxiosRejectResponseInterceptor(),
  )
  return axiosLoadingHandler
}

export function installAllHandlers(client: AxiosInstance): IAxiosHandlers {
  return {
    cacheHandler: installCacheHandler(client),
    errorHandler: installErrorHandler(client),
    immutableHandler: installImmutableHandler(client),
    loadingHandler: installLoadingHandler(client),
  }
}
