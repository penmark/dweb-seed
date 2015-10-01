'use strict'
import Index from './index.po'

describe('Index page', () => {
  let page
  beforeEach(() => {
    browser.get('/')
    page = new Index()
  })
  it('should link to users page', () => {
    expect(page.link.getAttribute('href')).toContain('/user')
  })
})

