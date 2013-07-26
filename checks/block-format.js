module.exports = block_format

var find_depth = require('../utils/find-tab-depth')

block_format.selector = 'block'

function block_format(node, subsource, alert) {
  var slice = subsource(node)
    , result
    , depth
    , stmt
    , cnt
    , src

  src = node.src || node.source()

  result = slice(node.range[0], node.range[0] + src.indexOf('\n'))

  if(!/^\{\s*$/.test(result)) {
    alert(
        node
      , 'expected `\\n` after `{`'
    )
  }

  if(node.start.line === node.end.line) {
    alert(
        node
      , 'blocks should always encompass three lines'
    )
  }

  depth = find_depth(node)

  for(var i = 0, len = node.body.length; i < len; ++i) {
    stmt = node.body[i]

    if(depth !== (stmt.start.col - 1) / 2) {
      alert(
          stmt
        , 'expected indent of %d (%d spaces), found ' +
          'statement preceded by %d spaces instead.'
        , depth
        , depth * 2
        , stmt.start.col - 1
      )
    }
  }

  if(!stmt) {
    return
  }

  result = slice(stmt.range[0], node.range[1])
  result = result.split('').reverse()

  while(result.length && result.shift() !== '}') {
    // noop
  }

  cnt = 0

  while(result.length && result.shift() !== '\n') {
    ++cnt
  }

  if(!result.length || cnt !== (depth - 1) << 1) {
    if(cnt === depth && cnt === 0) {
      return
    }

    alert(
        node
      , 'expected proper `}` dedent'
    )
  }
}
