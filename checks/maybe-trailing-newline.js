var trailing_newline = require('./trailing-newline')

module.exports = check_maybe_newline

function check_maybe_newline(node, errors, warnings) {
  if(node.type === 'ExpressionStatement') {
    return
  }

  return trailing_newline(node, errors, warnings)
}

