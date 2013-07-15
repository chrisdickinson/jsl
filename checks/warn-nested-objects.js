module.exports = nested_object

function nested_object(node, errors, warnings) {
  warnings.push({
      line: node.start.line
    , message: 'nesting object literals inside of other object literals is discouraged.'
  })
}

