module.exports = if_return_early

function if_return_early(node, errors, warnings) {
  var current = node

  while(current && current.type !== 'IfStatement') {
    current = current.parent
  }

  errors.push({
      line: current.test.start.line
    , message: 'unnecessary `else` case.'
  })
}

