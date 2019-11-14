import { AxiosLoadingHandler } from '../../src'

describe('AxiosLoadingHandler', () => {
  const response = { config: {}, data: undefined, headers: undefined, status: 0, statusText: '' }
  let loadingHandler: AxiosLoadingHandler
  beforeEach(() => {
    loadingHandler = new AxiosLoadingHandler()
  })

  it('sets loading to true on the request interceptor', (): void => {
    const interceptor = loadingHandler.getAxiosRequestInterceptor()

    interceptor({})

    expect(loadingHandler.isLoading()).to.be.true
  })

  it('sets loading to false on the fulfilled response', (): void => {
    // @ts-ignore - access private prop
    loadingHandler.loading.value = true
    const interceptor = loadingHandler.getAxiosFulfilledResponseInterceptor()

    interceptor(response)

    expect(loadingHandler.isLoading()).to.be.false
  })

  it('sets loading to false on the reject response ', async (): Promise<void> => {
    // @ts-ignore - access private prop
    loadingHandler.loading.value = true
    const interceptor = loadingHandler.getAxiosRejectResponseInterceptor()

    try {
      await interceptor(response)
    } catch (e) { /**/ }

    expect(loadingHandler.isLoading()).to.be.false
  })
})
