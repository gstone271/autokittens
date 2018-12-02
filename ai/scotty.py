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
import subprocess
from subprocess import DEVNULL
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

def cleanupChrome():
    subprocess.run(["pkill", "chromedriver"], stderr=DEVNULL, stdout=DEVNULL)
    subprocess.run(["pkill", "chrome"], stderr=DEVNULL, stdout=DEVNULL)

if __name__ == '__main__':
    cleanupChrome()
    hostname = sys.argv[1]
    geneFile = "./simba/ai/compGenomes/" + hostname
    fitFile = "./simba/ai/compFitness/" + hostname
    genome_file = open(geneFile, 'rb')
    fitness_file = open(fitFile, 'wb')
    genomes = pickle.load(genome_file)
    try:
        fitnesses = startScotty(genomes)
        pickle.dump(fitnesses, fitness_file)
    finally:
        cleanupChrome()
