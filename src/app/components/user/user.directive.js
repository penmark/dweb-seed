'use strict'
const userDirective = /*@ngInject*/ () => {
  return {
    restrict: 'E',
    scope: {text: '@'},
    templateUrl: "app/components/user/user.directive.html",
    transclude: true,
    bindToController: true,
    controllerAs: 'vm',
    controller: /*@ngInject*/ function () {
      this.text = this.text || 'Default text'
    }
  }
}
export default userDirective
