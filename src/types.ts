import { AxiosRequestConfig, AxiosResponse } from 'axios'

export type onFulfilledInterceptor<V> = (value: V) => V
export type onFulfilledRequestInterceptor = onFulfilledInterceptor<AxiosRequestConfig>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type onFulfilledResponseInterceptor = onFulfilledInterceptor<AxiosResponse<any>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type onRejectInterceptor = (error: any) => any
