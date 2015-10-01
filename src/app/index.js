'use strict'

import angular from 'angular'
import {mainModule, config, run, stateConfig, constants} from './main'

mainModule.config(config)
mainModule.config(stateConfig)
constants.forEach((constant) => {
  mainModule.constant(...constant)
})
mainModule.run(run)
