// tslint:disable-next-line:max-classes-per-file
import { AxiosResponse } from 'axios'
import { onFulfilledResponseInterceptor } from './types'

export class AxiosImmutableHandler {
  public getAxiosImmutableInterceptor(): onFulfilledResponseInterceptor {
    // @todo can we make a copy instead?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response: AxiosResponse<any>): AxiosResponse<any> => {
      response.data = Object.freeze(response.data)
      return response
    }
  }
}
