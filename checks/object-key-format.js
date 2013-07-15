var subsource = require('../utils/source')

module.exports = function(node, errors, warnings) {
  var sub = subsource(node)
    , src

  if(node.kind !== 'init') {
    return
  }

  src = sub(node.key.range[1], node.value.range[0])

  if(src !== ': ') {
    errors.push({
        line: node.start.line
      , message: 'expected `: `, got `'+JSON.stringify(src).slice(1, -1)+'`'
    })
  } 
}
