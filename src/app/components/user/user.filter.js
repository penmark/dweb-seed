'use strict'

const userFilter = /*@ngInject*/ ($log) => {
  $log.debug('Hello from user filter')
  return (input) => {
    return `User: ${input}`
  }
}

export default userFilter
