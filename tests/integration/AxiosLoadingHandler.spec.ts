import axios, { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { installLoadingHandler } from '../../src'

describe('AxiosLoadingHandler', () => {
  let mock: MockAdapter
  let client: AxiosInstance
  beforeEach(() => {
    mock = new MockAdapter(axios, { delayResponse: 1 })
    client = axios.create({
      baseURL: '',
    })
  })

  async function itStartsAndStopsLoadingOn(url: string): Promise<string> {
    return new Promise((resolve): void => {
      let doneCount = 0
      const loadingHandler = installLoadingHandler(client)

      expect(loadingHandler.isLoading()).to.be.false
      client.get(url).then(() => {
        expect(loadingHandler.isLoading()).to.be.false
        if (doneCount === 1) {
          resolve('success')
        }
      }).catch(() => {
        expect(loadingHandler.isLoading()).to.be.false
        if (doneCount === 1) {
          resolve('error')
        }
      })
      // the axios interceptor starts on next tick so we only can check the loading state after that tick
      setTimeout(() => {
        expect(loadingHandler.isLoading()).to.be.true
        doneCount++
      })
    })
  }

  it('starts and stops loading on a success call', async (): Promise<void> => {
    mock.onGet('/users').reply(200, {})
    const result = await itStartsAndStopsLoadingOn('/users')
    expect(result).to.equal('success')
  })

  it('starts and stops loading on a error call', async (): Promise<void> => {
    mock.onGet('/users').reply(400, {})
    const result = await itStartsAndStopsLoadingOn('/users')
    expect(result).to.equal('error')
  })
})
