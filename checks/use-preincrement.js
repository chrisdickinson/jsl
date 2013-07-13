module.exports = use_preincrement

function use_preincrement(node, errors, warnings) {
  if(!node.prefix) {
    warnings.push({
        line: node.start.line
      , message: 'prefer `++i` style in for loop update statements'
    })
  }
}
