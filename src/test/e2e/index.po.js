'use strict'

class Index {
  constructor() {
    this.panel = element(by.css('.index'))
    this.link = this.panel.element(by.css('[ui-sref="user"]'))
    this.notifyText = this.panel.element(by.model('vm.message'))
    this.notifyTimeout = this.panel.element(by.model('vm.timeout'))
    this.errorButton = this.panel.element(by.css('.btn-danger'))
    this.notification = element(by.css('.notify'))
  }
}

export default Index

