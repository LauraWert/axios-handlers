// tslint:disable-next-line:max-classes-per-file
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import Vue from 'vue'
import { onFulfilledRequestInterceptor, onFulfilledResponseInterceptor, onRejectInterceptor } from './types'

export class AxiosLoadingHandler {
  private loading: Record<'value', number> = Vue.observable({ value: 0 })

  public isLoading(): boolean {
    return this.loading.value > 0
  }

  public getAxiosRequestInterceptor(): onFulfilledRequestInterceptor {
    return (config: AxiosRequestConfig): AxiosRequestConfig => {
      this.loading.value++
      return config
    }
  }

  public getAxiosFulfilledResponseInterceptor(): onFulfilledResponseInterceptor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response: AxiosResponse<any>): AxiosResponse<any> => {
      response.data = Object.freeze(response.data)
      this.loading.value--
      return response
    }
  }

  public getAxiosRejectResponseInterceptor(): onRejectInterceptor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any): Promise<any> => {
      this.loading.value--
      return Promise.reject(error)
    }
  }
}
