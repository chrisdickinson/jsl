module.exports = whitespace

var subsource = require('../utils/source')

function whitespace(node, errors, warnings) {
  var sub = subsource(node.parent)
    , op = node.parent.operator
    , src

  if(op === 'typeof' || op === 'void') {
    op += ' '  
  }

  src = sub(node.parent.range[0], node.range[0])

  while(src.charAt(src.length - 1) === '(') {
    src = src.slice(0, -1)
  }

  while(src.charAt(0) === ')') {
    src = src.slice(1)
  }

  if(src === ' ' + node.parent.operator + ' ') {
    return
  }

  if(src === op) {
    return
  }

  errors.push({
    line: node.start.line
  , message: 'expected `' + JSON.stringify(op).slice(1, -1) + '`, got `' + 
             JSON.stringify(src).slice(1, -1) + '`'
  })
} 
