const R = require('ramda')
const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  })
}
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const generateRandomNumberUpTo100 = R.partial(generateRandomNumber, [0, 100])

class Individual {

  constructor (fitnessCalculator, dna) {
    this.fitnessCalculator = fitnessCalculator
    this.dna = (dna == undefined) ? generateRandomNumberUpTo100() : dna
    this.identifier = generateGUID()
  }

  compareFitness (individual) {
    return this.getFitness() - individual.getFitness()
  }

  getFitness () {
    return this.fitnessCalculator(this)
  }

  dnaToBinaryString (dna) {
    let binaryString = (dna >>> 0).toString(2)
    // Pad to 6 digits - 100 -> 1100100
    return "000000".substr(binaryString.length)+binaryString;
  }

  binaryStringToDNA (binary) {
    return parseInt(parseInt(binary,2).toString(10))
  }

  breedWith (individual) {
    let babyDNA = Math.floor((this.dna + individual.dna) / 2)
    return new Individual(this.fitnessCalculator, babyDNA)
  }

  toString () {
    return this.identifier + " -> " + this.dna + " -> " + this.getFitness()
  }
}

module.exports = Individual
