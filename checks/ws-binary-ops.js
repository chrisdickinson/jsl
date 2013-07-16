module.exports = whitespace

var subsource = require('../utils/source')

function whitespace(node, errors, warnings) {
  var sub = subsource(node.parent)
    , src

  src = sub(node.parent.left.range[1], node.range[0])

  while(src.charAt(src.length - 1) === '(') {
    src = src.slice(0, -1)
  }

  while(src.charAt(0) === ')') {
    src = src.slice(1)
  }

  if(src === ' ' + node.parent.operator + ' ') {
    return
  }

  if(/\s*\n/.test(src.slice(1 + node.parent.operator.length))) {
    return
  }

  errors.push({
      line: node.start.line
    , message: 'binary operations should be surrounded ' +
               'by a single whitespace, got ' + JSON.stringify(src)
  })
} 
