const R = require('ramda')
const Population = require('./population')
const Individual = require('./individual')

//console.log('Population: ' + Population)
//console.log('Individual: ' + Individual)

const populationAverageValues = (population) => {
    let totalDna = 0
    let totalFitness = 0
    for(var i=0; i<population.length; i++) {
      totalDna += population[i].dna
      totalFitness = population[i].getFitness()
    }
    return {
      averageDNA: totalDna / population.length,
      averageFitness: totalFitness / population.length
    }
}
let history = [];
const hasStagnated = (dna) => {
  const memorySize = 5
  let allSame = false
  if(history.length < memorySize) allSame = false;
  else allSame = R.all(olddna => olddna === dna, history)

  // console.log(JSON.stringify(history));
  if (history.length > memorySize) history.shift()
  history.push(dna)
  return allSame;
}

const populationSummary = (population) => {
  const {averageDNA, averageFitness} = populationAverageValues(population)
  return "[" + averageFitness + "] Average DNA value (target 50) is " + averageDNA
}
const populationReport = (pop) => {
  console.log('-------------------')
  console.log("Average pop fitness = " + pop.getAveragePopulationFitness());
  pop.getIndividuals().forEach(individual => {
    console.log(individual)
  });
}
const TARGET = 20
const fitnessCalculator = individual => {
  const target = TARGET
  let distanceFromTarget = Math.abs(target - individual.dna)
  return 1 - (distanceFromTarget / target)
}

let pop = new Population(50,fitnessCalculator);
let continueToNextGeneration = true;

pop.generate();

let debugCount = 0;
while(continueToNextGeneration){
  let individuals = pop.getIndividuals()

  // console.log(populationSummary(individuals));
  //populationReport(pop)
  let {averageDNA, averageFitness} = populationAverageValues(individuals)
  let stagnated = hasStagnated(averageDNA)
  console.log(`Pop avg fitness: ${averageFitness}, average DNA: ${averageDNA} :: ${stagnated}`)
  let targetDNA = TARGET
  if (Math.abs(targetDNA - averageDNA) < 1) {
    console.log("Found my target " + targetDNA);
    continueToNextGeneration = false
  } else if (stagnated) {
    console.log("Stagnated " + history.join("/"));
    continueToNextGeneration = false
  } else {
    pop.createNextGeneration()
  }

  // if( debugCount++ > 5 ) continueToNextGeneration = false
}

// pop.orderPopulationByFitness()
// pop.getIndividuals().forEach(individual => {
//   console.log(individual.getFitness())
// })