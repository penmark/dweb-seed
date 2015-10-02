import angular from 'angular'
import uiRouter from 'angular-ui-router'
import uiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngResource from 'angular-resource'
import components from '../components'
import templates from '../templates'

const dependencies = [uiRouter, uiBootstrap, ngAnimate, ngResource, templates].concat(components)

export default angular.module('dweb', dependencies)
