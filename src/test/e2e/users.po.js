'use strict'

class Users {
  constructor() {
    this.filter = element(by.model('filter'))
    this.table = element(by.tagName('table'))
    this.th = this.table.all(by.repeater('column in vm.columns'))
    this.rows = this.table.all(by.repeater('user in vm.users'))
  }
}

export default Users
