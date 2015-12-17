'use strict'

const module = angular.mock.module

describe('userDirective', () => {
  beforeEach(module('nyawebben.user'))
  beforeEach(module('nyawebben.templates'))
  let compile, scope

  beforeEach(inject(($compile, $rootScope) => {
    compile = $compile
    scope = $rootScope.$new()
  }))

  it('should transclude', () => {
    const element = compile('<user-directive><i>Great content</i></user-directive>')(scope)
    scope.$digest()
    expect(element.html()).toContain('User content')
    expect(element.html()).toContain('Great content')
  })

  it('should have default text', () => {
    const element = compile(angular.element('<user-directive></user-directive>'))(scope)
    scope.$digest()
    expect(element.html()).toContain('Default text')
  })

  it('should accept text', () => {
    scope.valueInScope = 'Great responsibility'
    const element = compile('<user-directive text="{{valueInScope}}"></user-directive>')(scope)
    scope.$digest()
    const controller = element.controller('userDirective')
    expect(controller.text).toEqual('Great responsibility')
    expect(element.html()).toContain('Great responsibility')
  })
})
