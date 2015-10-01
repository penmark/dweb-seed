import angular from 'angular'
import uiRouter from 'angular-ui-router'
import uiBootstrap from 'angular-ui-bootstrap'
import ngAnimate from 'angular-animate'
import ngResource from 'angular-resource'
import userModule from '../components/user'
import templates from '../templates'

export default angular.module('dweb', [uiRouter, uiBootstrap, ngAnimate, ngResource, userModule, templates])
