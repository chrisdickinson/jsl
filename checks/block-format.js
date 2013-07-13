module.exports = block_format

var find_depth = require('../utils/find-tab-depth')
  , subsource = require('../utils/source')

function block_format(node, errors, warnings, src) {
  var slice = subsource(node)
    , result
    , depth
    , stmt
    , cnt

  result = slice(node.range[0], node.range[0] + src.indexOf('\n'))

  if(!/^\{\s*$/.test(result)) { 
    errors.push({
        line: node.start.line
      , message: 'expected `\\n` after `{`'
    })
  }

  if(node.start.line === node.end.line) {
    errors.push({
        line: node.start.line
      , message: 'blocks should always encompass three lines'
    })
  }

  depth = find_depth(node)

  for(var i = 0, len = node.body.length; i < len; ++i) {
    stmt = node.body[i]

    if(depth !== (stmt.start.col - 1) / 2) {
      errors.push({
          line: stmt.start.line
        , message:  'expected indent of '+depth+' ('+
                    (depth * 2)+' spaces), found stmt'+
                    ' preceded by '+(stmt.start.col-1)+
                    ' spaces' 
      })
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

  if(!result.length || cnt !== (depth - 1)<<1) {
    if(cnt === depth && cnt === 0) {
      return
    }

    errors.push({
        line: node.end.line
      , message: 'expected proper `}` dedent'
    })
  }
}
