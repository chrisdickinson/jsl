module.exports = lint

var language = require('cssauron-falafel')
  , concat = require('concat-stream')
  , lines = require('line-stream')
  , falafel = require('falafel')
  , through = require('through')
  , duplex = require('duplexer')

var maybe_trailing_newline = require('./checks/maybe-trailing-newline')
  , fail_nested_function = require('./checks/fail-nested-functions')
  , comma_first_object = require('./checks/comma-first-object')
  , comma_first_array = require('./checks/comma-first-array')
  , comma_first_call = require('./checks/comma-first-call')
  , trailing_newline = require('./checks/trailing-newline')
  , use_preincrement = require('./checks/use-preincrement')
  , too_many_keys = require('./checks/warn-too-many-keys')
  , statement_style = require('./checks/statement-style')
  , var_block_order = require('./checks/var-block-order')
  , function_style = require('./checks/function-style')
  , block_format = require('./checks/block-format')
  , no_semicolons = require('./checks/semicolons') 

var checks = [
  '[type=VariableDeclaration]',               var_block_order
, '[type=VariableDeclaration]',               too_many_keys.check
, 'variable > id ~ object > key + key + key', too_many_keys.flag
, 'object > key function',                    fail_nested_function
, 'for > * + * + update',                     use_preincrement
, 'call',                                     comma_first_call
, 'object',                                   comma_first_object
, 'array',                                    comma_first_array

// no semicolons!
, 'block > *',                                no_semicolons

// trailing newline
, 'expr + *',                                 maybe_trailing_newline
, 'variable-decl + *',                        trailing_newline
, 'if + *',                                   trailing_newline
, 'for + *',                                  trailing_newline
, 'for-in + *',                               trailing_newline
, 'try + *',                                  trailing_newline
, 'while + *',                                trailing_newline
, 'do-while + *',                             trailing_newline
, '[type=FunctionDeclaration] + *',           trailing_newline

// if() {, et al
, 'if',                                       statement_style
, 'for',                                      statement_style
, 'for-in',                                   statement_style
, 'catch',                                    statement_style
, 'while',                                    statement_style
, 'do-while',                                 statement_style
, 'try',                                      statement_style

, 'function',                                 function_style

, 'block',                                    block_format
]

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
    filedata = '(function() {\n'+filedata+'\n})'
    falafel(filedata, function(node) {
      node.start = to_line_col(node.range[0])
      node.end = to_line_col(node.range[0]+node.source().length)
      node.src = node.source()

      for(var i = 0; i < checks.length; i += 2) {
        var check = checks[i]

        if(language(check)(node)) {
          checks[i + 1](node, errors, warnings, node.src)
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
