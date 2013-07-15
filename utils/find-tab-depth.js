module.exports = find_tab_depth

var language = require('cssauron-falafel')

function find_tab_depth(node) {
  var any = language('ternary, switch, object, block, array, case')
    , isobject = language('object')
    , isvar = language('variable')
    , object_count = 0
    , current = node
    , depth = -1
    , any

  while(current) {
    if(any(current)) {
      ++depth
    }

    // special case all the things!
    if(isobject(current)) {
      ++object_count
      if(object_count > 1) {
        ++depth
      }
    }

    if(isvar(current) && current.parent.declarations.length > 1) {
      ++depth
    }
    current = current.parent
  }

  return depth
}

