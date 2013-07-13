module.exports = find_tab_depth

var language = require('cssauron-falafel')

function find_tab_depth(node) {
  var isobject = language('object')
    , isblock = language('block')
    , isarray = language('array')
    , current = node
    , depth = -1
    , any

  any = [].some.bind([isblock, isobject, isarray], function(check) {
    return check(current)
  })

  while(current) {
    if(any()) {
      ++depth
    }

    current = current.parent
  }

  return depth
}

