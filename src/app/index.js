'use strict'

import angular from 'angular'
import uiRouter from 'angular-ui-router'
import uiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngResource from 'angular-resource'
import templates from './templates'
import main from './main'
import {userModule, notifyModule} from './components'


const app = angular.module('dweb', [
  uiRouter, uiBootstrap, ngAnimate, ngResource,
  main, templates, userModule, notifyModule
])

export default app
