'use strict'
const emailDirective = /*@ngInject*/ ($log) => {
  return {
    restrict: 'E',
    transclude: true,
    scope: {email: '@'},
    templateUrl: "app/components/user/email.directive.html",
    bindToController: true,
    controllerAs: 'vm',
    controller: () => {}
  }
}
export default emailDirective
