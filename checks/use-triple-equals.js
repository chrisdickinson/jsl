module.exports = triple_equals

function triple_equals(node, errors, warnings) {
  errors.push({
      line: node.start.line
    , message: 'use `===`'
  })
}
