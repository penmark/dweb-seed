import angular from 'angular'
import userModule from './user'
import notifyModule from './notify'

const componentModule = 'dweb.components'

angular.module(componentModule, [userModule, notifyModule])

export default componentModule
