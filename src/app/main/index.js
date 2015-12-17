import mainRun from './main.run'
import mainConfig from './main.config'
import stateConfig from './main.states'
import constants from './main.constants'
import angular from 'angular'
const mainModule = 'nyawebben.main'
const m = angular.module(mainModule, [])
  .config(mainConfig)
  .config(stateConfig)
  .run(mainRun)
constants.forEach(constant => m.constant(...constant))
export default mainModule


