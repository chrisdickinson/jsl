module.exports = function_style

var subsource = require('../utils/source')

function function_style(node, errors, warnings, src) {
  var slice = subsource(node)
    , ident = node.id
    , string = 'function'
    , varnames = {}
    , result
    , valid

  if(ident) {
    string += ' '+node.id.name
  }

  string += '('+node.params.map(function(child) {
    if(child.type === 'Identifier') {
      if(varnames[child.name]) {
        errors.push({
          line: child.start.line
        , message: 'saw `'+child.name+'` multiple times!' 
        })
      }
      varnames[child.name] = true
    }
    return child.src
  }).join(', ')+')'

  result = slice(node.range[0], node.range[0] + string.length)
  valid = result === string

  if(!valid) {
    errors.push({
        line: node.start.line
      , message: 'expected `'+string+'`, got `'+JSON.stringify(result)+'`'
    })
  }

  result = slice(node.range[0] + string.length - 1, node.body.range[0] + 1)

  if(result !== ') {') {
    errors.push({
        line: node.start.line
      , message: 'expected `'+string+'`, got `'+JSON.stringify(result)+'`'
    })
    
  }

}
