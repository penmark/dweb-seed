'use strict'
const messageService = /*@ngInject*/ ($rootScope, $log) => {
  const notify = (level, message, title, timeout) => {
    $log.debug('notify', arguments)
    $rootScope.$emit('dweb.notify', {level: level, message: message, title: title, timeout: timeout})
  }
  return {
    warning: (message, title=null, timeout=3) => {
      notify('warning', message, title, timeout)
    },
    error: (message, title=null, timeout=3) => {
      notify('error', message, title, timeout)
    },
    info: (message, title=null, timeout=3) => {
      notify('info', message, title, timeout)
    },
    success: (message, title=null, timeout=3) => {
      notify('success', message, title, timeout)
    }
  }
}
export default messageService
