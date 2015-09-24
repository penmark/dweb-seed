"use strict"
var StateConfig = /*@ngInject*/ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('dummy', {
    url: '/dummy',
    templateUrl: 'app/components/dummy/index.html',
    controller: 'dummyCtrl',
    controllerAs: 'vm',
    resolve: {
      values: /*@ngInject*/ (dummyService) => dummyService.values()
    }
  })
  $urlRouterProvider.otherwise('/dummy')
}
export default StateConfig
