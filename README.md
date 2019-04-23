# deep-selector-polyfill

This polyfill adds the ability to query for elements nested deep in the shadow roots.
The polyfill only applies to `querySelector` and `querySelectorAll`. The selector has no effect in `<style>` elements.

## Example

```js
document.querySelector('#root /deep/ #nested /deep/ input')
```

## Development

```bash
# clone repo
# install dependencies
yarn
# start dev server
yarn start
# access test page
# http://127.0.0.1:8081/components/deep-selector-polyfill/test/
```

### Running tests

Tests are run using [Web Component Tester](https://www.npmjs.com/package/web-component-tester).

```bash
yarn test
```
