const fs = require('fs')

const likeChars = {
  b: 'b',
  f: 'b',
  p: 'b',
  v: 'b',

  c: 'c',
  g: 'c',
  j: 'c',
  k: 'c',
  q: 'c',
  s: 'c',
  x: 'c',
  z: 'c',

  d: 'd',
  t: 'd',
  
  l: 'l',

  m: 'm',
  n: 'm',

  r: 'r',
}

const charNumMapping = {
  b: 1,
  c: 2,
  d: 3,
  l: 4,
  m: 5,
  r: 6,
};

const sanitizeName = (name: string) => {
  const originalName = name
  const firstLetter = originalName[0]
  const simplifiedName = originalName.split('').map(letter => likeChars[letter] || letter)
  
  // remove like sounds
  const reducedNameAsArr = []
  simplifiedName.forEach( (letter, index) => {
    if (index == 0) {
      reducedNameAsArr.push(letter)
    }
    else {
      if (letter != simplifiedName[index-1]) {
        reducedNameAsArr.push(letter)
      }
    }
  })
  const reducedName = reducedNameAsArr.join('')

  // remove vowels
  const noVowelName = reducedName.replace(/[aeiouywh]/gi, '')
  return {
    firstLetter,
    sanitizedEnd: noVowelName
  }
}

const mapNameToNumbers = (sanitizedName: string) => {
  const letters = sanitizedName.split('')
  const vals = letters.map(l => charNumMapping[l] || -1)
  const result = vals.join('') + "000"
  return result.substr(0, 3)
}

const soundEx = (name: string) => {
  const {firstLetter, sanitizedEnd} = sanitizeName(name)
  const numbers = mapNameToNumbers(sanitizedEnd)
  return `${firstLetter}${numbers}`
}


function main() {
  const nameMap = {}

  const data = fs.readFileSync('./names.txt', 'utf8')
  const names = data.split('\n').map(name => name.trim())

  names.forEach(name => {
    const result = soundEx(name)
    let existingList = nameMap[result]
    if (!existingList) {
      nameMap[result] = []
      existingList = nameMap[result];
    }
    existingList.push(name)
  })

  console.log(nameMap)
}

main()
