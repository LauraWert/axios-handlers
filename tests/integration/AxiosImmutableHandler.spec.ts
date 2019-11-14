import { installImmutableHandler } from '../../src'
import axios, { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('AxiosImmutableHandler', () => {
  let mock: MockAdapter
  let client: AxiosInstance
  beforeEach(() => {
    mock = new MockAdapter(axios)
    client = axios.create({
      baseURL: '',
    })
  })

  it('makes the response immutable', async (): Promise<void> => {
    mock.onGet('/users').reply(200, {
      foo: 'bar',
    })
    installImmutableHandler(client)

    const response = await client.get('/users')

    try {
      response.data.foo = 'baz'
    } catch (e) {
      return
    }

    expect.fail()
  })
})
