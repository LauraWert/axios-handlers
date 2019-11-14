import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).expect = expect
chai.use(sinonChai)
