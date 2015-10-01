'use strict'

class Index {
  constructor() {
    this.panel = element(by.css('.index'))
    this.link = this.panel.element(by.tagName('a'))
  }
}

export default Index
/*
var Index = function () {
    this.panel = element(by.css('.index'))
    this.link = this.panel.element(by.tagName('a'))
}
module.exports = new Index()
*/
