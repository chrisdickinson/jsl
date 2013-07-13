module.exports = cli

var through = require('through')
  , linter = require('./rules')
  , path = require('path')
  , fs = require('fs')

function cli() {
  var files = process.argv.slice(2)

  if(!files.length) {
    return help()
  }

  files = files.map(function(filename) {
    var output

    if(filename === '-') {
      output = process.stdin
    } else {
      filename = path.resolve(filename)

      if(!fs.existsSync(filename)) {
        output = through()
      } else {
        output = fs.createReadStream(filename)
      } 
    }

    output.filename = filename

    return output
  })

  process.stdout.setMaxListeners(Infinity)

  consume(files, function(tally) {
    var message = []

    if(tally.errors) {
      message.push(tally.errors + ' error'+(tally.errors > 1 ? 's' : ''))
    }

    if(tally.warnings) {
      message.push(tally.warnings + ' warning'+(tally.errors > 1 ? 's' : ''))
    }

    message = message.join(', ')+'\nchecked '+tally.files+'; '+(tally.errors ? 'NOT ' : '')+'OK\n'
    process.stdout.write(message)
    process.exit(tally.errors)
  })
}

function consume(files, baton, ready) {

  if(arguments.length === 2) {
    ready = baton
    baton = {errors: 0, warnings: 0, files: 0}
  }

  if(!files.length) {
    return ready(baton)
  }

  ++baton.files

  var stream = files.shift()

  stream
    .pipe(linter())
      .on('error', note_error)
      .on('data', tally) 
    .pipe(format(stream.filename))
    .pipe(through(null, function() { consume(files, baton, ready) }))
    .pipe(process.stdout, {end: false})


  function tally(msg) {
    if(msg.type === 'error') {
      ++baton.errors
    } else {
      ++baton.warnings
    }
  }

  function note_error(err) {
    ++baton.errors
    process.stderr.write(
      stream.filename.replace(process.cwd(), '.') +
      ' Parse Error:'+ err.message + '\n'
    )
    consume(files, baton, ready)
  }
}

function help() {

}

function format(filename) {
  var stream = through(write)

  return stream

  function write(msg) {
    return stream.queue(
        (msg.type === 'error' ? 'E' : 'W')+' '+
        filename.replace(process.cwd(), '.')+' L'+msg.line+': '+msg.message+'\n')
  }
}

if(module.id === '.') {
  cli()
}
