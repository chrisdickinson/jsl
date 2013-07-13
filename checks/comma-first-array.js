module.exports = comma_first_array

function comma_first_array(node, errors, warnings) {
  if(node.elements.length === 0) {
    if(node.src !== '[]') {
      errors.push({
          line: node.start.line
        , message: 'empty arrays should be written `[]`'
      })
    }

    return
  } 
}

