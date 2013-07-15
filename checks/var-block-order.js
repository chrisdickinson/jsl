module.exports = var_block_order

function var_block_order(node, errors, warnings, src) {
  var decl = node.declarations
    , allow_transition = true
    , length = Infinity
    , line_len
    , assign

  assign = decl[0] && !!decl[0].init

  if(!assign) {
    allow_transition = false
  }

  if(node.parent.type === 'ForStatement') {
    return
  }

  for(var i = 0, len = decl.length; i < len; ++i) {
    // skip this check for `self`/`proto` decls.
    if(decl[i].id.name === 'proto' || decl[i].id.name === 'self') {
      continue
    }

    if(!decl[i].init && assign) {
      assign = false
      length = Infinity
    } else if(decl[i].init && !assign) {
      errors.push({
        line: decl[i].start.line
      , message: 'should not transition from no-assign to assign in var block'
      }) 
    }

    line_len = Math.max.apply(null, decl[i].src.split('\n').map(function(x) {
      return x.length
    }))

    if(line_len > length) {
      errors.push({
          line: decl[i].start.line
        , message: 'variable declarations should be in order of assign, no assign; then line length'
      })
    }

    length = line_len
  } 
}

