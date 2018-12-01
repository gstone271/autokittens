# The "worker" program being run simultaneously by captain
# Inputs: Genome for this instance for Simba to run
# Outputs: fitness score?
# Operations: start Simba (wait for Simba to stop)
#             send back fitness value
# Author: Kallen Harvey
# Sources noted where used.

# selenium starts Simba, baris will do
# baris: get fitness from simba
# me: get genome to each computer (captain)
from multiprocessing import Pool
import pickle
import sys
from worker import run_browser
from genetic import toSimbaSettings

def startScotty(genomeList):
    genomes = len(genomeList)
    fitnessList = list()
    #run simba with each genome
    with Pool(processes = genomes) as pool:
        fitnessList = pool.map(func = simbaSetup, iterable =genomeList)
    return fitnessList

def simbaSetup(genome):
    simbaSettings = toSimbaSettings(genome)
    fitness = run_browser(simbaSettings)
    return fitness

if __name__ == '__main__':
    hostname = sys.argv[1]
    geneFile = "./compGenomes/" + hostname
    fitFile = "./compFitness/" + hostname
    genome_file = open(geneFile, 'rb')
    fitness_file = open(fitFile, 'wb')
    genomes = list()
    genomes.append(pickle.load(genome_file))
    fitnesses = startScotty(genomes)
    pickle.dump(fitnesses, fitness_file)
