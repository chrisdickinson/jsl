module.exports = function_style

function_style.selector = 'function'

function function_style(node, subsource, alert) {
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
        alert(
          child.start.line
        , 'saw `'+child.name+'` multiple times!' 
        )
      }
      varnames[child.name] = true
    }
    return child.src
  }).join(', ')+')'

  result = slice(node.range[0], node.range[0] + string.length)
  valid = result === string

  if(!valid) {
    alert(
        node.start.line
      , 'expected `'+string+'`, got `'+JSON.stringify(result)+'`'
    )
  }

  result = slice(node.range[0] + string.length - 1, node.body.range[0] + 1)

  if(result !== ') {') {
    alert(
        node.start.line
      , 'expected `'+string+'`, got `'+JSON.stringify(result)+'`'
    )
  }
}
