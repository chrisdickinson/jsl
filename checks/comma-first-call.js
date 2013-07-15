module.exports = comma_first_call

var find_tab_depth = require('../utils/find-tab-depth')
  , make_tabs = require('../utils/make-tabs')
  , subsource = require('../utils/source')

function comma_first_call(node, errors, warnings) {
  var nodes = node.arguments.slice()
    , sub = subsource(node)
    , last_node
    , cur_node
    , str

  if(sub(node.callee.range[1], node.callee.range[1] + 1) !== '(') {
    errors.push({
        line: node.start.line
      , message: 'no space between invocation and call'
    })
  }

  if(node.arguments.length === 0) {
    if(node.src.slice(-2) !== '()') {
      errors.push({
          line: node.start.line
        , message: 'empty calls should be written `()`'
      })
    }

    return
  } 

  // this is the easy case, but it misses .pipe, for example:
  //   stdin
  //     .pipe(xxx)
  //     .pipe(yyy)
  if(node.arguments[node.arguments.length - 1].start.line === node.callee.end.line) {
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
      rex = new RegExp('^\\(\\s*\n\\s{'+(2 * depth + 4) +'}$')

      if(!rex.test(str)) {
        errors.push({
            line: cur_node.start.line
          , message: 'expected `'+tabs+'    `, got `'+str+'`'
        })
      }

      rex = new RegExp('^\\s*\\n\\s{'+(2 * depth + 2) +'}, $')
    } else if(!rex.test(str)) {
      errors.push({
          line: cur_node.start.line
        , message: 'expected `'+JSON.stringify(tabs).slice(1, -1)+' , `, got `'+JSON.stringify(str).slice(1, -1)+'`'
      })
    }

    last_node = cur_node
    is_first = false
  } 
}
