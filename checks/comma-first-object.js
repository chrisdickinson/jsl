module.exports = comma_first_object

var find_tab_depth = require('../utils/find-tab-depth')
  , make_tabs = require('../utils/make-tabs')

function comma_first_object(node, errors, warnings) {
  var nodes = node.properties.slice()
    , base = node.range[0]
    , last_node
    , cur_node
    , str

  if(node.properties.length === 0) {
    if(node.src !== '{}') {
      errors.push({
          line: node.start.line
        , message: 'empty objects should be written `{}`'
      })
    }

    return
  } 

  if(node.properties[node.properties.length - 1].start.line === node.start.line) {
    return
  }

  var depth = find_tab_depth(node)
    , tabs = make_tabs(depth)
    , is_first = true
    , adjust = 0
    , rex
    , idx

  last_node = node

  while(cur_node = nodes.shift()) {
    str = node.src.slice(
        is_first ? last_node.range[0] - base : last_node.range[1] - base
      , cur_node.range[0] - base
    )

    if(is_first) {
      rex = new RegExp('^\\{\\s*\n\\s{'+(2 * depth + 4) +'}$')

      if(!rex.test(str)) {
        if(false)
        errors.push({
            line: cur_node.start.line
          , message: 'expected `'+tabs+'    `, got `'+str+'`'
        })
      }

      rex = new RegExp('^\\s*\\n\\s{'+(2 * depth) +'}, $')
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


