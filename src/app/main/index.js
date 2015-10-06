import config from './main.config'
import run from './main.run'
import stateConfig from './main.states'
import constants from './main.constants'
import angular from 'angular'
const mainModule = 'dweb.main'
const m = angular.module(mainModule, [])
  .config(config)
  .config(stateConfig)
  .run(run)
constants.forEach(constant => m.constant(...constant))
export default mainModule


