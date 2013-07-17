module.exports = find_tab_depth

var language = require('cssauron-falafel')

function find_tab_depth(node) {
  var any = language('ternary, switch, object, block, array, case')
    , isspecial = language('object, array')
    , wascall = language('call')(node)
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
    if(isspecial(current)) {
      ++object_count
      if(object_count > 1 || wascall) {
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

