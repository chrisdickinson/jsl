module.exports = {flag: flag, check: check}

function flag(node, errors, warnings) {
  var cur = node

  while(cur && cur.type !== 'VariableDeclaration') {
    cur = cur.parent
  }

  if(!cur) {
    return
  }

  cur.__obj_count__ = (cur.__obj_count__ || 0)
  ++cur.__obj_count__ 
}

function check(node, errors, warnings) {
  if(node.declarations.length > 1 && node.__obj_count__ >= 1) {
    errors.push({
        line: node.start.line
      , message: 'do not nest complex (>3 keys) objects in var declarations.'
    })
  }
}
