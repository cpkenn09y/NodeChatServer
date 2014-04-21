function analyzeInput(userInput) {
  if (userInput[0] === '/') {
    var specification
    var splitInput = userInput.split(' ')
    if (splitInput[1]) { var specification = splitInput[1].trim() }
    return { command : splitInput[0].trim(), specification : specification }
  } else {
    return { dialog : userInput }
  }
}

module.exports = { analyzeInput : analyzeInput }