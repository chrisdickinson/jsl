module.exports = fail_nested_function

function fail_nested_function(node, errors, warnings) {
  errors.push({
    line: node.line
  , message: 'nesting function expressions inside of object literals is not allowed.'
  })
}

