'use strict'

const module = angular.mock.module
import userModule from './'

describe('userCtrl', () => {
  let controller
  beforeEach(module(userModule))
  beforeEach(() => {
    module(($provide) => {
      $provide.value('user', {id: 1, name: 'Olle'})
      $provide.value('$modalInstance', {
        close: jasmine.createSpy('$modalInstance.close')
      })

    })
  })

  beforeEach(inject(($controller) => {
    controller = $controller('userCtrl')
  }))

  it('should have a user', () => {
    expect(controller.user.id).toEqual(1)
  })
})
