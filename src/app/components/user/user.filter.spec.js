'use strict'
const module = angular.mock.module
describe('dummyFilter', () => {
  beforeEach(module('nyawebben.user'))
  let filter
  beforeEach(inject(($filter) => {
    filter = $filter
  }))

  it('should return a concatenated string', () => {
    expect(filter('user')('apa')).toEqual('User: apa')
  })
})
