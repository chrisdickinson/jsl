module.exports = find_tab_depth

var language = require('cssauron-falafel')

function find_tab_depth(node) {
  var isternary = language('ternary')
    , isswitch = language('switch')
    , isobject = language('object')
    , isblock = language('block')
    , isarray = language('array')
    , iscase = language('case')
    , object_count = 0
    , current = node
    , depth = -1
    , any

  any = [
      isternary
    , isblock
    , isobject
    , isarray
    , isswitch
    , iscase
  ]

  any = [].some.bind(any, function(check) {
    return check(current)
  })

  while(current) {
    if(any()) {
      ++depth
    }

    // special case all the things!
    if(isobject(current)) {
      ++object_count
      if(object_count > 1) {
        ++depth
      }
    }

    current = current.parent
  }

  return depth
}

