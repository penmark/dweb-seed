'use strict'

const usersCtrl = /*@ngInject*/ function ($log, $state, users) {
  $log.debug('Hello from users ctrl, users are:', users)
  this.users = users
  this.columns = [
    {key: 'username', label: 'Användarnamn', reverse: false},
    {key: 'name', label: 'Namn', reverse: false},
    {key: 'email', label: 'E-post', reverse: false}
  ]
  this._sort = this.columns[0]
  this.sort = (column) => {
    if (!column)
      return this._sort
    if (column == this._sort)
      column.reverse = !column.reverse
    this._sort = column
  }

  this.details = (user) => $state.go('user.detail', {id: user.id})
}
export default usersCtrl
