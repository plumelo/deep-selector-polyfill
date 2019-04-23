class MyEl extends HTMLElement {
  constructor () {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const template = this.querySelector('template')
    const content = document.importNode(template.content, true)

    shadow.appendChild(content)
  }
}

customElements.define('my-el', MyEl)
