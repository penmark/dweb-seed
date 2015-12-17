import angular from 'angular'
import userModule from './user'
import notifyModule from './notify'

const componentModule = 'nyawebben.components'

angular.module(componentModule, [userModule, notifyModule])

export default componentModule
