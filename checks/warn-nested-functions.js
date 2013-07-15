module.exports = nested_function

function nested_function(node, errors, warnings) {
  warnings.push({
      line: node.start.line
    , message: 'nesting function expressions inside of object literals is discouraged.'
  })
}

