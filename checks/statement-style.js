module.exports = check_statement_style

var stmt_types = [
    'if'
  , 'for'
  , 'for-in'
  , 'catch'
  , 'while'
  , 'do-while'
  , 'try'
]

check_statement_style.selector = ''+stmt_types

function check_statement_style(node, subsource, alert) {
  var first_node = node.init || node.param || node.test
    , src = node.src || node.source()
    , last_node
    , body
    , type
    , ch

  last_node = node.update.range ? node.update : first_node
  type = node.type.replace(/(Clause|Statement|Declaration)/g, '').toLowerCase()
  type = type.replace('dowhile', 'while')

  if(first_node) {
    ch = src.slice(first_node.range[0] - node.range[0] - 2, first_node.range[0] - node.range[0])

    if(/\s/.test(ch)) {
      alert(
          node
        , /\s/.test(ch[1]) ? 
            'no space between `(` and expression' :
            'no space between `'+type+'` and `(`'
      )
    }

    if(last_node && node.type !== 'DoWhileStatement') {
      ch = src.slice(last_node.range[1] - node.range[0], last_node.range[1] - node.range[0] + 3)

      if(!/^\)\s{1}\{$/.test(ch)) {
        alert(
            node
          , '`'+JSON.stringify(ch).slice(1, -1)+'` should match `) {`'
        )
      }
    }
  }

  if(node.type === 'IfStatement') {
    if(node.consequent.type !== 'BlockStatement') {
      alert(
        node
      , 'if statements must always use braces'
      )
    } else if(node.consequent.start.line !== node.start.line) {
      alert(
        node
      , 'open block brace belongs on same line as statement'
      )
    }

    if(!node.alternate) {
      return
    }

    if(node.consequent.end.line !== node.alternate.start.line) {
      alert(
        node
      , '`else if` should be on one line'
      )
    }

    if(node.alternate.type !== 'BlockStatement' && node.alternate.type !== 'IfStatement') {
      alert(
        node.alternate
      , 'else statements must always use braces'
      )
    }

    return
  }

  body = node.body || node.block

  if(body.type !== 'BlockStatement') {
    if(node.type !== 'ForInStatement' && body.type !== 'IfStatement') {
      alert(
        node
      , type+' statements must always use braces'
      )
    }
  } else if(body.start.line !== node.start.line) {
    alert(
      node
    , 'open block brace belongs on same line as statement'
    )
  }

  if(node.type === 'TryStatement') {
    for(var i = 0, len = node.handlers.length; i < len; ++i) {

      if(src.slice(node.handlers[i].range[0] - node.range[0] - '} '.length, node.handlers[i].range[0] - node.range[0]) !== '} ') {
        alert(
            node.handlers[i]
          , '`catch` should be on the same line as `}`'
        )
      }
    }

    if(!node.finalizer) {
      return
    }

    var lhs = node.handlers.length ? node.handlers[node.handlers.length - 1] : body
    
    if(src.slice(lhs.range[1] - node.range[0], node.finalizer.range[0] - node.range[0]) === ' finally ') {
      return
    }

    alert(
        node.finalizer
      , 'expected `} finally {`'
    )
  }

}
