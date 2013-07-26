module.exports = comma_first_call

var find_tab_depth = require('../utils/find-tab-depth')
  , make_tabs = require('../utils/make-tabs')

comma_first_call.selector = 'call'

function comma_first_call(node, subsource, alert) {
  var nodes = node.arguments.slice()
    , sub = subsource(node)
    , last_node
    , cur_node
    , str

  if(sub(node.callee.range[1], node.callee.range[1] + 1) !== '(') {
    alert(
        node
      , 'no space between invocation and call'
    )
  }

  if(node.arguments.length === 0) {
    if(node.src.slice(-2) !== '()') {
      alert(
          node
        , 'empty calls should be written `()`'
      )
    }

    return
  }

  // this is the easy case, but it misses .pipe, for example:
  //   stdin
  //     .pipe(xxx)
  //     .pipe(yyy)
  var end_line = node.arguments[node.arguments.length - 1].start.line
    , start_line = node.callee.end.line

  if(end_line === start_line) {
    return
  }

  var depth = find_tab_depth(node)
    , tabs = make_tabs(depth)
    , is_first = true
    , rex

  last_node = node.callee

  while(cur_node = nodes.shift()) {
    str = sub(
        last_node.range[1]
      , cur_node.range[0]
    )

    if(is_first) {
      rex = new RegExp('^\\(\\s*\n\\s{' + (2 * depth + 4) + '}$')

      if(!rex.test(str)) {
        alert(
            cur_node
          , 'expected %r, got %r'
          , tabs
          , str
        )
      }

      rex = new RegExp('^\\s*\\n\\s{' + (2 * depth + 2) + '}, $')
    } else if(!rex.test(str)) {
      alert(
          cur_node
        , 'expected %r, got %r'
        , tabs
        , str
      )
    }

    last_node = cur_node
    is_first = false
  }
}
