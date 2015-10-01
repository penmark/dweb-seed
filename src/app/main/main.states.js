"use strict"
const StateConfig = /*@ngInject*/ ($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true)

  $stateProvider.state('index', {
    url: '/',
    template: '<div class="index"><i>I am index.</i> <a ui-sref="user">Go to users</a>.</div>'
  }).state('user', {
    url: '/user',
    templateUrl: 'app/components/user/index.html',
    controller: 'usersCtrl as vm',
    resolve: {
      users: /*@ngInject*/ (userService) => {
        return userService.query().$promise
      }
    }
  }).state('user.detail', {
    url: '/{id}',
    onEnter: /*@ngInject*/ ($state, $stateParams, $modal) => {
      $modal.open({
        templateUrl: 'app/components/user/user.html',
        resolve: {
          user: /*@ngInject*/ (userService) => {
            return userService.get({id: $stateParams.id}).$promise
          }
        },
        controller: 'userCtrl as vm'
      }).result.finally(() => $state.go('^'))
    }

  })
  $urlRouterProvider.otherwise('index')
}
export default StateConfig
