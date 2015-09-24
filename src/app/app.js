'use strict'

import angular from 'angular'
import {mainModule, config, run, stateConfig} from './main'
import dummyModule from './components'

mainModule.config(config)
mainModule.config(stateConfig)
mainModule.run(run)
