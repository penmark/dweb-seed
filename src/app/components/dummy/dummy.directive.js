'use strict'
var dummyDirective = /*@ngInject*/ () => {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: "app/components/dummy/dummy.directive.html",
    transclude: true,
    bindToController: true,
    controllerAs: 'vm',
    controller: /*@ngInject*/ function () {
      this.data = 'Some Data'
    }
  }
}
export default dummyDirective
