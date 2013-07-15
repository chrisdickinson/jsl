module.exports = function(node, errors, warnings) {
  errors.push({
      line: node.start.line
    , message: 'expected sanity, got `eval` instead (do not use eval)'
  })
}
