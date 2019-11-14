import { AxiosImmutableHandler } from '../../src'
import { AxiosResponse } from 'axios'

describe('AxiosImmutableHandler', () => {
  let response: AxiosResponse
  beforeEach((): void => {
    response = {
      config: {},
      headers: {},
      status: 0,
      statusText: '',
      data: {},
    }
  })

  it('makes the response data immutable', (): void => {
    const axiosImmutableHandler = new AxiosImmutableHandler()
    const interceptor = axiosImmutableHandler.getAxiosImmutableInterceptor()
    response.data = {
      foo: 'bar',
    }

    const result = interceptor(response)
    try {
      result.data.foo = 'baz'
    } catch (e) {
      return
    }

    expect.fail()
  })
})
