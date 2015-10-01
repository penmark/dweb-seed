'use strict'

import Users from './users.po'

describe('Users page', () => {
  let page
  beforeEach(() => {
    browser.get('/user')
    page = new Users()
  })

  it('should show table heading', () => {
    expect(page.th.count()).toEqual(3)
    expect(page.th.last().getText()).toContain('E-post')
  })

  it('should display 10 users', () => {
    expect(page.rows.count()).toEqual(10)
  })

  it('should filter users', () => {
    page.filter.sendKeys('bret')
    expect(page.rows.count()).toEqual(1)
  })

  it('should sort users', () => {
    expect(page.rows.first().element(by.css('td > a')).getText()).toEqual('Antonette')
    page.th.first().click()
    expect(page.rows.first().element(by.css('td > a')).getText()).not.toEqual('Antonette')
  })
})
