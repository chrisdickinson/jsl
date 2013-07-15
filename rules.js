module.exports = lint

var language = require('cssauron-falafel')
  , concat = require('concat-stream')
  , lines = require('line-stream')
  , falafel = require('falafel')
  , through = require('through')
  , duplex = require('duplexer')

var maybe_trailing_newline = require('./checks/maybe-trailing-newline')
  , warn_nested_function = require('./checks/warn-nested-functions')
  , warn_nested_object = require('./checks/warn-nested-objects')
  , comma_first_object = require('./checks/comma-first-object')
  , comma_first_array = require('./checks/comma-first-array')
  , use_triple_equals = require('./checks/use-triple-equals')
  , comma_first_call = require('./checks/comma-first-call')
  , trailing_newline = require('./checks/trailing-newline')
  , use_preincrement = require('./checks/use-preincrement')
  , too_many_keys = require('./checks/warn-too-many-keys')
  , object_key_fmt = require('./checks/object-key-format')
  , statement_style = require('./checks/statement-style')
  , var_block_order = require('./checks/var-block-order')
  , function_style = require('./checks/function-style')
  , binary_op_ws = require('./checks/ws-binary-ops')
  , block_format = require('./checks/block-format')
  , no_semicolons = require('./checks/semicolons') 
  , unary_op_ws = require('./checks/ws-unary-ops')
  , dont_use_eval = require('./checks/no-eval')

var nl_types = [
    'variable-decl'
  , 'if'
  , 'for'
  , 'for-in'
  , 'try'
  , 'while'
  , 'do-while'
  , '[type=FunctionDeclaration]'
]

var stmt_types = [
    'if'
  , 'for'
  , 'for-in'
  , 'catch'
  , 'while'
  , 'do-while'
  , 'try'
]

var checks = [
    ['[type=VariableDeclaration]',               var_block_order]
  , ['[type=VariableDeclaration]',               too_many_keys.check]
  , ['variable > object > * + * + *',            too_many_keys.flag]
  , ['object > * > function',                    warn_nested_function]
  , ['object > * > object',                      warn_nested_object]
  , ['object > *',                               object_key_fmt]
  , ['for > * + * + update',                     use_preincrement]
  , ['call',                                     comma_first_call]
  , ['object',                                   comma_first_object]
  , ['array',                                    comma_first_array]
  , ['block > *',                                no_semicolons]
  , ['expr + *',                                 maybe_trailing_newline]
  , [':any(' + nl_types + ') + *',               trailing_newline]
  , ['' + stmt_types,                            statement_style]
  , ['function',                                 function_style]
  , ['block',                                    block_format]
  , [':any(binary, assign) > * + *',             binary_op_ws]
  , ['unary > *',                                unary_op_ws]
  , ['binary[operator=\\=\\=]',                  use_triple_equals]
  , ['id[name=eval]',                            dont_use_eval]
]

checks = checks.map(function(item) {
  return [language(item[0]), item[1]]
})

function lint(name) {
  var input = through(write, end)
    , warnings = []
    , errors = []
    , num = 0
    , line
    , cat
   
  line = lines()

  line.on('data', function(line) {
    ++num

    if(line.length > 80) {
      errors.push({line: num, message: 'exceeded 80 chars'})
    } 
  })

  function safely(perform) {
    return function(buf) {
      try {
        return perform(buf)
      } catch(err) {
        input.emit('error', err)
      }
    }
  }

  cat = concat(safely(function(filedata) {
    filedata = '(function() {\n' + filedata + '\n})'
    falafel(filedata, function(node) {
      node.start = to_line_col(node.range[0])
      node.end = to_line_col(node.range[0] + node.source().length)
      node.src = node.source()

      for(var i = 0; i < checks.length; ++i) {
        var check = checks[i]

        if(check[0](node)) {
          check[1](node, errors, warnings, node.src)
        }
      }
    })

    function to_line_col(pos) {
      var column = 0
        , line = 0 

      for(var i = 0; i <= pos; ++i) {
        ++column

        if(filedata[i] === '\n') {
          ++line
          column = 0
        }
      }

      return {line: line, col: column}
    }
  }))

  function write(buf) {
    cat.write(buf)
    line.write(buf)
  }

  function end() {
    var next

    cat.end()
    line.end()

    while(errors.length) {
      next = errors.shift()
      next.type = 'error'
      input.queue(next)
    }

    while(warnings.length) {
      next = warnings.shift()
      next.type = 'warning'
      input.queue(next)
    }

    input.queue(null)
  }

  return input
}
