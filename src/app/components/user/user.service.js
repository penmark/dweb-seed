'use strict'

const userService = /*@ngInject*/ ($log, $resource, conf) => {
  const User = $resource(conf.urls.api.users, {id: '@id'})
  $log.debug('Hello from user service', User, conf.urls.api.users)
  return User
}
export default userService
