import service from './notify.service'
import directive from './notify.directive'
import angular from 'angular'

const moduleName = 'nyawebben.notify'

angular.module(moduleName, [])
  .factory('notify', service)
  .directive('notify', directive)

export default moduleName
