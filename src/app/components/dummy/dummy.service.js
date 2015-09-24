'use strict'

var dummyService = /*@ngInject*/ ($log, $q, $timeout) => {
  $log.debug('Hello from dummy service')
  const valuePromise = $q.defer()
  $timeout(() => valuePromise.resolve('a b c d'.split(' ')), 500);
  return {
    values: () => valuePromise.promise
  }
}
export default dummyService
