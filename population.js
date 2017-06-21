const R = require('ramda')
const Individual = require('./individual')

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Population {

  constructor (size,fitnessCalculator) {
    this.fitnessCalculator = fitnessCalculator
    this.currentGeneration = 1;
    this.size = size
    this.population = []
    this.generations = [];
    this.config = { keepHistory: true }
  }

  // Create the initial population
  generate () {
    this.population = []
    for(var i = 0; i < this.size; i++) {
      this.population[i] = new Individual(this.fitnessCalculator)
    }
  }

  createNextGeneration () {
    if(this.config.keepHistory) this.generations.push(R.clone(this.population))
    this.orderPopulationByFitness()
    this.removeRunts()
    this.breed()
  }

  orderPopulationByFitness () {
    this.population.sort((first, second) => {
      return second.compareFitness(first)
    })
  }

  removeRunts () {
    // console.log('Average fitness before cull ' + this.getAveragePopulationFitness())
    let percentageToKeep = this.percentageToKeep()
    this.population = this.population.slice(0,Math.floor(this.size * percentageToKeep))
    // console.log('Average fitness after cull (kept: ' + percentageToKeep + '%) = ' + this.getAveragePopulationFitness())
  }

  // returns a percent value (0-1) what percentage to keep (higher = more)
  percentageToKeep () {
    const popFitness = this.getAveragePopulationFitness()
    // Fitness == 0 - 1, lower the fitness more agressive the culling
    if (popFitness > 0 && popFitness < 0.3) return 0.3
    else if (popFitness < 0.5) return 0.5
    return 0.75
  }

  breed () {
    const availableBreeders = this.population.length;
    let newGeneration = []
    let childrenRequired = this.size - this.population.length;

    while (childrenRequired >= 0) {
      let a = generateRandomNumber(0, availableBreeders-1)
      let b = generateRandomNumber(0, availableBreeders-1)
      let father = this.population[a]
      let mother = this.population[b]

      newGeneration.push(mother.breedWith(father))
      childrenRequired--;
    }
    this.currentGeneration++
    this.population = R.concat(this.population,newGeneration)

    // const numberOfChildren = this.population.length;
    // while(newGeneration.length < numberOfChildren){
    //   let a = generateRandomNumber(0, this.population.length-1)
    //   let b = generateRandomNumber(0, this.population.length-1)

    //   let father = this.population[a]
    //   let mother = this.population[b]
    //   newGeneration.push(mother.breedWith(father))
    // }
    // this.currentGeneration++
    // this.population = R.concat(this.population,newGeneration)
  }

  getAveragePopulationFitness () {
    let individuals = R.map(individual => individual.getFitness(), this.getIndividuals() )
    let totalFitness = R.reduce(R.add, 0, individuals)
    return totalFitness / individuals.length
  }

  getIndividuals () {
    return this.population
  }

  reportIndividuals () {
    return JSON.stringify(this.population, null, '  ')
  }

  summaryReport () {
    return 'population [' + this.currentGeneration + ', '+ this.size + ' -> ' + this.population.length + ']'
  }
}

module.exports = Population;