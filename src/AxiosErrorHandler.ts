import { AxiosError } from 'axios'
import Vue from 'vue'
import { onRejectInterceptor } from './types'

export class AxiosErrorHandler {
  private errors: Record<string, AxiosError> = Vue.observable({})
  private lastError: Record<'value', AxiosError | null> = Vue.observable({ value: null })

  public getError(url: string): AxiosError {
    return this.errors[url]
  }

  public getLastError(): AxiosError | null {
    return this.lastError.value
  }

  public getErrorInterceptor(): onRejectInterceptor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any): Promise<any> => {
      const handleError = error.config && error.config.hasOwnProperty('handleError')
        ? error.config.handleError!(error)
        : true

      if (handleError) {
        this.setError(error)
      }

      // always reject because when you use a await on a api call it should never resolve
      return Promise.reject(error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setError(error: any): void {
    if (error.config && error.config.url!) {
      this.errors[error.config.url!] = error
    }

    this.lastError.value = error
  }
}
