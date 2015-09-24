'use strict'

var dummyFilter = /*@ngInject*/ ($log) => {
  $log.debug('Hello from dummy filter')
  return (input) => {
    return `dummy ${input} dummy`
  }
}

export default dummyFilter
