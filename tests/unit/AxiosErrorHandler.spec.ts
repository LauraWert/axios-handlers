import { AxiosError } from 'axios'
import sinon from 'sinon'
import { AxiosErrorHandler } from '../../src'
import { onRejectInterceptor } from '../../src/types'

describe('AxiosErrorHandler', () => {
  let errorHandler: AxiosErrorHandler
  beforeEach(() => {
    errorHandler = new AxiosErrorHandler()
  })

  context('response interceptor', () => {
    let interceptor: onRejectInterceptor
    let error: AxiosError
    beforeEach((): void => {
      error = {
        config: {},
        message: '',
        name: '',
      }
      interceptor = errorHandler.getErrorInterceptor()
    })

    it('sets and returns the an AxiosError', async (): Promise<void> => {
      error.config.url = 'http://base.nl/path/'
      try {
        await interceptor(error)
      } catch (resultError) {
        expect(errorHandler.getError(error.config.url)).to.equal(error)
        expect(errorHandler.getLastError()).to.equal(error)
        expect(resultError).to.eql(error)
        return
      }

      expect.fail()
    })

    it('sets and returns a default error', async (): Promise<void> => {
      error.config.url = 'http://base.nl/path/'
      const customError = new Error('custom error')
      try {
        await interceptor(customError)
      } catch (resultError) {
        expect(errorHandler.getLastError()).to.equal(customError)
        expect(resultError).to.eql(customError)
        return
      }

      expect.fail()
    })

    it('can handle the error through a custom error handler', async (): Promise<void> => {
      error.config.errorHandler = sinon.stub().returns(true)

      try {
        await interceptor(error)
      } catch (resultError) {
        expect(error.config.errorHandler).to.be.calledOnceWith(error)
        expect(errorHandler.getLastError()).to.be.null
        return
      }

      expect.fail()
    })

    it('can pass the error to the default handler through a custom error handler', async (): Promise<void> => {
      error.config.errorHandler = sinon.stub().returns(false)

      try {
        await interceptor(error)
      } catch (resultError) {
        expect(error.config.errorHandler).to.be.calledOnceWith(error)
        expect(errorHandler.getLastError()).to.equal(error)
        return
      }

      expect.fail()
    })
  })
})
