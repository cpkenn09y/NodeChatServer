function analyzeInput(userInput) {
  if (userInput[0] === '/') {
    return { command : userInput }
  } else {
    return { userInput : userInput}
  }
}

module.exports = {analyzeInput : analyzeInput}