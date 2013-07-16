module.exports = if_stmt_order

function if_stmt_order(node, errors, warnings) {
  var chk = language(':any(continue, break, return)')
    , con = node.parent.parent.consequent
    , alt = node.parent.parent.alternate
    , test = node.parent.parent.test

  alt.src = alt.src || alt.source()

  if(alt.src.split('\n').length > con.src.split('\n').length) {
    if(chk(node)) {
      return warnings.push({
          line: test.start.line
        , message: 'decrease nesting by reversing this `if` statement and ' + 
                   'returning early from the consequent.'
      })
    }

    warnings.push({
        line: test.start.line
      , message: 'prefer having the larger of the two cases to be the ' +
                 'consequent of the if statement.'
    })
  }
}
