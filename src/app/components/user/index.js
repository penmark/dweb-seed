'use strict'
import userCtrl from './user.controller'
import usersCtrl from './users.controller'
import userFilter from './user.filter'
import userDirective from './user.directive'
import userService from './user.service'
import angular from 'angular'

const userModule = 'dweb.user'
angular.module(userModule, [])
  .controller('usersCtrl', usersCtrl)
  .controller('userCtrl', userCtrl)
  .filter('user', userFilter)
  .directive('userDirective', userDirective)
  .factory('userService', userService)
export default userModule
