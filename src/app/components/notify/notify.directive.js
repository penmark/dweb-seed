'use strict'
const notifyDirective = /*@ngInject*/ ($log, $rootScope, $templateCache, $compile, $timeout, $animate) => {
  return {
    restrict: 'A',
    link: (scope, elem) => {
      const notifications = []
      const template = $templateCache.get('app/components/notify/notify.html')
      const classMap = {
        error: 'alert-danger',
        success: 'alert-success',
        info: 'alert-info',
        warning: 'alert-warning'
      }
      scope.notifyClass = (level) => classMap[level]

      const dismiss = (notifyElem) => {
        $animate.leave(notifyElem).then(() => {
          notifications.splice(notifications.indexOf(notifyElem), 1)
          $log.debug('notifications', notifications)
        })
      }

      $rootScope.$on('dweb.notify', (e, message) => {
        let notifyElem
        scope.message = message
        scope.dismiss = () => dismiss(notifyElem)

        notifications.push(notifyElem = $compile(template)(scope))
        //notifyElem.css('top', notifyElem.height * notifications.length)
        $animate.enter(notifyElem, elem).then(() => {
          if (message.timeout > 0) {
            $timeout(scope.dismiss, message.timeout * 1000)
          }
        })
        $log.debug('notifications', notifications)
      })


    }
  }
}
export default notifyDirective
