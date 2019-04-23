;(function () {
  'use strict'

  window.__deepSelectorAlias = window.__deepSelectorAlias || '/deep/'

  const toArray = foo =>
    foo && foo.length !== undefined ? Array.from(foo) : [foo]

  const queryInShadowRoot = (el, selector, elSel, queryfn) => {
    if (!el) throw new Error(elSel + ' does not exist.')
    if (!el.shadowRoot) throw new Error(elSel + ' does not have a shadow root.')

    return el.shadowRoot[queryfn](selector)
  }

  const chainShadowQueries = (root, path, queryfn) => {
    const nodes = chainShadowQueriesMulti(toArray(root), path, queryfn)
    return queryfn === 'querySelectorAll' ? nodes : nodes[0]
  }

  const chainShadowQueriesMulti = (root, path, queryfn) =>
    path.reduce(
      (elements, selector, idx, path) =>
        elements
          .map(el => queryInShadowRoot(el, selector, path[idx - 1], queryfn))
          .map(nodelist => toArray(nodelist))
          .flat(),
      root
    )

  /**
   * Queries the context for an element matching the selector.
   * Navigates the shadow roots.
   *
   * @example
   *  $('some-element /deep/ shadow-child')
   * @example
   *  $('/deep/ shadow-child', someEl)
   *
   * @param  {String} selector a css selector with shadow root accessors
   * @param  {Node}   context  a context to search in
   * @return {Node|null}       the matched element
   */
  const $ = function (selector, context, multi = false) {
    const queryfn = multi ? 'querySelectorAll' : 'querySelector'

    // split the selector by the shadow accessor
    // each split represents an ingress into a shadow root
    const path = selector.split(window.__deepSelectorAlias).map(i => i.trim())

    // get the selector for the root element
    const root = path[0]

    // query for the root element
    // if `selector` begins with '/deep/', then the root element is the context
    const rootEl = root ? context[queryfn](root) : context

    // chain shadow root queries
    return chainShadowQueries(rootEl, path.slice(1), queryfn)
  }

  const shim = (base, fn, multi) => {
    const orig = base[fn]
    base[fn] = function (selector) {
      return !selector.includes(window.__deepSelectorAlias)
        ? orig.call(this, selector)
        : $(selector, this, multi)
    }
  }

  const install = () => {
    shim(document, 'querySelector', false)
    shim(document, 'querySelectorAll', true)
    shim(Element.prototype, 'querySelector', false)
    shim(Element.prototype, 'querySelectorAll', true)
  }

  install()
})()
