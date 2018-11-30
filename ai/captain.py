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
#list node has 1 computer (string of name/address) and many genomes 
class Captain:
    def start(self, computerList, genomeList):
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

def isComputerRunning(computer):
    return subprocess.run(["ping", "-c", "1", computer]).returncode == 0

def getWorkingComputers(computerList):
    with Pool(len(computerList)) as pool:
        pingResults = pool.map(isComputerRunning, computerList)
    return [ computer for (computer, isRunning) in zip(computerList, pingResults) if isRunning ]

backupComputer = "babbage.cs.pdx.edu"

def runOneComputer(hostname, genomes):
    genome_file = TODO_file_named_after_hostname
    fitness_file = TODO_file_named_after_hostname
    pickle.dump(genomes, genome_file)
    try:
        subprocess.run(["ssh", hostname, f"nice -n 5 python3 ~/simba/ai/scotty.py {hostname}"], check=True, timeout=(60 * 30))
        fitnesses = pickle.load(fitness_file)
        return fitnesses
    except (CalledProcessError, TimeoutExpired) as err:
        if hostname == backupComputer:
            print("Warning: Backup computer job failed:", err)
            return [0] * len(genomes)
        else:
            print(f"Warning: {hostname} job failed:", err)
            return runOneComputer(backupComputer, genomes)
