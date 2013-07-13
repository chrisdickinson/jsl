module.exports = check_trailing_newline

var subsource = require('../utils/source')

function check_trailing_newline(node, errors, warnings, source) {
  var body = Array.isArray(node.parent.body) ? node.parent.body : node.parent.body.body
    , idx = body.indexOf(node)
    , parent_src
    , prev

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

  errors.push({
      line: node.start.line
    , message: 'expected a single blank newline to precede'
  })
}

