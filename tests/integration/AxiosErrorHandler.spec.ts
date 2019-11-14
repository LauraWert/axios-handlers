import { installErrorHandler } from '../../src'
import axios, { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('AxiosErrorHandler', () => {
  let mock: MockAdapter
  let client: AxiosInstance
  beforeEach(() => {
    mock = new MockAdapter(axios)
    client = axios.create({
      baseURL: '',
    })
  })

  it('sets an axios error in the handler', async (): Promise<void> => {
    mock.onGet('/users').reply(400, {
      message: 'an_error',
    })
    const axiosErrorHandler = installErrorHandler(client)

    try {
      await client.get('/users')
    } catch (e) { /**/ }

    expect(axiosErrorHandler.getLastError()!.response!.data).to.eql({
      message: 'an_error',
    })
  })

  it('doesn\'t set an error on a success call', async (): Promise<void> => {
    mock.onGet('/users').reply(200, {})
    const axiosErrorHandler = installErrorHandler(client)

    await client.get('/users')

    expect(axiosErrorHandler.getLastError()).to.be.null
  })
})
