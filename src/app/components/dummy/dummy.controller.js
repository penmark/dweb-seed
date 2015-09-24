'use strict'

const dummyCtrl = /*@ngInject*/ function ($log, values) {
  this.values = values
  $log.debug('Hello from dummy ctrl, values are:', this.values)
}
export default dummyCtrl
