module.exports = var_block_order

function var_block_order(node, errors, warnings, src) {
  var decl = node.declarations
    , allow_transition = true
    , length = Infinity
    , assign

  assign = decl[0] && !!decl[0].init

  if(!assign) {
    allow_transition = false
  }

  if(node.parent.type === 'ForStatement') {
    return
  }

  for(var i = 0, len = decl.length; i < len; ++i) {
    if(!decl[i].init && assign) {
      assign = false
      length = Infinity
    } else if(decl[i].init && !assign) {
      errors.push({
        line: decl[i].start.line
      , message: 'should not transition from no-assign to assign in var block'
      }) 
    }

    if(decl[i].src.length > length) {
      errors.push({
          line: decl[i].start.line
        , message: 'variable declarations should be in order of assign, no assign; then line length'
      })
    }

    length = decl[i].src.length
  } 
}

