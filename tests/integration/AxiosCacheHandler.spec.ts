import axios, { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { installCacheHandler } from '../../src'

describe('AxiosCacheHandler', () => {
  let mock: MockAdapter
  let client: AxiosInstance
  beforeEach(() => {
    mock = new MockAdapter(axios)
    client = axios.create({
      baseURL: '',
    })
  })

  afterEach(() => {
    mock.reset()
  })

  it('it calls an api only once within given time', async (): Promise<void> => {
    mock.onGet('/users').reply(200, {
      users: [
        { id: 1, name: 'John Smith' },
      ],
    })

    installCacheHandler(client)

    await client.get('/users')
    await client.get('/users')//

    expect(mock.history.get.length).to.equal(1)
  })

  it('it caches an call when cache is given and resets the cache on a post', async (): Promise<void> => {
    mock.onGet('/users').reply(200, {})
    mock.onPost('/users').reply(200, {})

    installCacheHandler(client, { maxThrottleAge: -1 })

    await client.get('/users', { cacheDomain: 'user' })
    await client.get('/users', { cacheDomain: 'user' })

    expect(mock.history.get.length).to.equal(1)

    await client.post('/users', {}, { cacheDomain: 'user' })
    await client.get('/users', { cacheDomain: 'user' })

    expect(mock.history.get.length).to.equal(2)
  })
})
