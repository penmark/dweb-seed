'use strict'

const userCtrl = /*@ngInject*/ function ($log, user, $modalInstance) {
  this.user = user
  $log.debug('Hello from user ctrl, user is:', this.user)
  this.close = () => {
    $modalInstance.dismiss()
  }
}
export default userCtrl
