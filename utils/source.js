module.exports = function(node) {
  var src = node.src || (node.src = node.source())

  return function(from, to) {
    var bits = src.slice(from - node.range[0], to - node.range[0]).split('')
      , last = null
      , out = []
      , ch

    while(bits.length) {
      ch = bits.shift()
      if(ch === '/' && last === '/') {
        while(bits.length && bits.shift() !== '\n') {
          // noop
        }

        last = null
        ch = bits.shift() || ''
      } else if(ch === '*' && last === '/') {
        out.pop()

        while(bits.length && !(last === '*' && bits[0] === '/')) {
          last = bits.shift()
        }

        bits.shift()
        last = null
        ch = bits.shift() || ''
      }

      out.push(ch)
      last = ch
    }

    return out.join('')
  }
}
