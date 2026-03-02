import { config } from 'bundled-eslint-config'


export default config({}, [
  {
    ignores: [ 'test/*', '.wrangler/*' ]
  }
])
