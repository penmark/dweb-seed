'use strict'
import dummyCtrl from './dummy.controller'
import dummyFilter from './dummy.filter'
import dummyDirective from './dummy.directive'
import dummyService from './dummy.service'
import angular from 'angular'

const dummyModule = 'dweb.dummy'
angular.module(dummyModule, [])
  .controller('dummyCtrl', dummyCtrl)
  .filter('dummy', dummyFilter)
  .directive('dummyDirective', dummyDirective)
  .factory('dummyService', dummyService)
export default dummyModule
