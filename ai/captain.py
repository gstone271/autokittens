# The parallelised 'master' in the master/worker relationship for
# fitness scoring/ running simba. 
# Splits genomeList over computerList, and gives each computer
# a scotty process with many genomes to run simba with. 
# Inputs: list of genomes, list of computers
# Ouputs: list of updated data/ scores
# Operations: start scottys
#             divide the genomes evenly among the computers and send each its chunk
#             combine the results into a list. 
#             (update genomes?)
#             (run N times?)
# One "leader" program being run has the GA and runs the workers, which run Simba
# Author: Kallen Harvey
# Sources noted where used.
from multiprocessing import Pool
import pickle
import subprocess


#from genetic import (genome class/where genome info is stored)

def isComputerRunning(computer):
    return subprocess.run(["ping", "-c", "1", computer]).returncode == 0

def getWorkingComputers(computerList):
    with Pool(len(computerList)) as pool:
        pingResults = pool.map(isComputerRunning, computerList)
    return [ computer for (computer, isRunning) in zip(computerList, pingResults) if isRunning ]

backupComputer = "babbage.cs.pdx.edu"

def runOneComputer(hostname, genomes):
    hostG = "./compGenomes/" + hostname
    hostF = "./compFitness/" + hostname
    genome_file = open(hostG, 'wb')
    fitness_file = open(hostF, 'rb')
    pickle.dump(genomes, genome_file)
    try:
        subprocess.run(["ssh", hostname, f"nice -n 5 python3 ~/simba/ai/scotty.py {hostname}"], check=True, timeout=(60 * 30))
        fitnesses = pickle.load(fitness_file)
        return fitnesses
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as err:
        if hostname == backupComputer:
            print("Warning: Backup computer job failed:", err)
            return [0] * len(genomes)
        else:
            print(f"Warning: {hostname} job failed:", err)
            return runOneComputer(backupComputer, genomes)

#list node has 1 computer (string of name/address) and many genomes 
def start(computerList, genomeList):
    computers = len(computerList)
    genomes = len(genomeList)
    if (computers == 0):
        print("Computer List empty")
        return
    if (genomes == 0):
        print("Genome List empty")
        return

    remain = genomes % computers
    loops = genomes / computers
    splitGenomes = list()
    for x in range(computers):
        thisCompsGenomes = list()
        thisCompsName = computerList[x]
        #create genome and fitness files (for scotty)
        firstDot = thisCompsName.find('.')
        nm = thisCompsName[:firstDot]
        hostG = "./compGenomes/" + nm
        open(hostG, "x")
        hostF = "./compFitness/" + nm
        open(hostF, "x")
        #get genomes from list
        for i in range(loops):
            #from 0 to loops-1, load genomeList[0] into new list for computer[x]
            thisCompsGenomes.append(genomeList[0])
            genomeList.pop(0)
            if (remain != 0):
                thisCompsGenomes.append(genomeList[0])
                genomeList.pop(0)
                remain = remain - 1
            splitGenomes.append((thisCompsName, thisCompsGenomes))
    results = list()
    with Pool(processes = computers) as pool:
        resultsByComputer = pool.starmap(func = runOneComputer, iterable = splitGenomes)
        results.append(resultsByComputer)
    return results


from genetic import KittensProblem

if __name__ == '__main__':
    compFile = "./computers.txt"
    computerList = list()
    with open(compFile) as f:
        computerList.append([line.rstrip('\n') for line in f])
    genomeList = list()
    for x in range(5):
        genomeList.append(KittensProblem.randomGenome())
    start(computerList, genomeList)