var _ = require('lodash')

function addhttp(url) {
  if(url.indexOf('http') === -1) {
    // it mean not exists
    return 'http:' + url
  }else {
    return url
  }
}

function transform(ary) {
  ary = _.uniq(ary)
  return ary.map(function (url) {
    console.log(url)
    return addhttp(url)
  })
}

module.exports = {
  transform: transform
}
