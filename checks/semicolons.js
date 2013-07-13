module.exports = check_for_no_semicolons

function check_for_no_semicolons(node, errors, warnings, src) {
  var i = src.length - 1
  while(/\s/.test(src[i])) {
    --i
  }

  if(src[i] !== ';') {
    return
  }

  errors.push({
    line: node.start.line
  , message: 'semicolons are not allowed'
  })
}
