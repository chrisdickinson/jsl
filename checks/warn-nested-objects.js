module.exports = nested_object

nested_object.selector = 'object > * > object'

function nested_object(node, subsource, alert) {
  alert(
      node
    , 'nesting object literals inside of other object literals is discouraged.'
  )
}

