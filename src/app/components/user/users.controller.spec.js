'use strict'

const module = angular.mock.module
import userModule from './'

describe('usersCtrl', () => {
  beforeEach(module(userModule))
  const state = {
    go: jasmine.createSpy('$state.go')
  }
  beforeEach(() => {
    module(($provide) => {
      $provide.value('users', [{id: 1, name: 'Olle'}, {id: 2, name: 'Kalle'}])
      $provide.value('$state', state)
    })
  })
  let controller
  beforeEach(inject(($controller) => {
    controller = $controller('usersCtrl')
  }))

  it('should have users', () => {
    expect(controller.users[1].id).toEqual(2)
  })

  it('should navigate to user details', () => {
    controller.details(controller.users[0])
    expect(state.go).toHaveBeenCalledWith('user.detail', {id: 1})
  })
})
