module.exports = check_trailing_newline

var subsource = require('../utils/source')

var nl_types = [
    'variable-decl'
  , 'if'
  , 'for'
  , 'for-in'
  , 'try'
  , 'while'
  , 'do-while'
  , '[type=FunctionDeclaration]'
]

check_trailing_newline.selector = ':any(' + nl_types + ') + *'

function check_trailing_newline(node, subsource, alert) {
  var parent_src
    , prev
    , body
    , idx

  body = !Array.isArray(node.parent.body) ?
    (node.parent.body || {}).body :
    node.parent.body

  if(!body) {
    return
  }

  idx = body.indexOf(node)

  if(idx < 0) {
    return
  }

  idx -= 1
  prev = body[idx]
  parent_src = subsource(node.parent)(prev.range[1], node.range[0])

  if(/\n\s*\n\s*$/g.test(prev.src)) {
    return
  }

  if(parent_src.replace(/[^\n]/g, '').length === 2) {
    return
  }

  alert(
      node
    , 'expected a single blank newline to precede'
  )
}

