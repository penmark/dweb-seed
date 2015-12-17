'use strict'

import angular from 'angular'
import uiRouter from 'angular-ui-router'
import uiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngResource from 'angular-resource'
import templates from './templates'
import main from './main'
import componentModule from './components'


const app = angular.module('nyawebben', [
  uiRouter, uiBootstrap, ngAnimate, ngResource,
  main, templates, componentModule
])

angular.bootstrap(document, ['nyawebben'], {strictDi: true})

export default app
