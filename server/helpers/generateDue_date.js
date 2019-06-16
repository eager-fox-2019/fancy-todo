module.exports = (input) => {
  let possibleDivider = [' ', '-', '/'] 
  let divider
  for(let i in input) {
    let found
    for(let j in possibleDivider) {
      found = false
      if(input[i] == possibleDivider[j]) {
        divider = possibleDivider[j]
        found = true
        break
      }
    }
    if(found) {
      break
    }
  }
  input = input.split(divider)
  input = `${input[1]} ${input[0]} ${input[2]}`
  return new Date(input)
}