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
from subprocess import DEVNULL
import os
import time

#from genetic import (genome class/where genome info is stored)

def isComputerRunning(computer):
    return subprocess.run(["ping", "-c", "1", "-4", computer], stdout=DEVNULL).returncode == 0

def getWorkingComputers(computerList):
    with Pool(len(computerList)) as pool:
        pingResults = pool.map(isComputerRunning, computerList)
    return [ computer for (computer, isRunning) in zip(computerList, pingResults) if isRunning ]

backupComputer = "babbage.cs.pdx.edu"

def runOneComputer(hostname, genomes, postfix=""):
    if len(genomes) == 0:
        return []
    hostG = "./compGenomes/" + hostname + postfix
    hostF = "./compFitness/" + hostname + postfix
    with open(hostG, 'wb') as genome_file:
        pickle.dump(genomes, genome_file)
    if (os.path.exists(hostF)):
        os.remove(hostF)
    thisCompStartTime = time.time()
    try:
        subprocess.run(["ssh", "-4", hostname, f"bash -c '. ~/cs541ve/bin/activate; nice -n 5 python3 ~/simba/ai/scotty.py {hostname}{postfix} 2>>~/simba/ai/logs/{startTime}/errors.log'"], check=True, timeout=(60 * 25))
        fitnesses = pickle.load(open(hostF, 'rb'))
        return fitnesses
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, EOFError, IOError) as err:
        if (isinstance(err, subprocess.TimeoutExpired)):
            print(f"Warning: {hostname} timed out")
        if (isinstance(err, EOFError) or isinstance(err, IOError)):
            print(f"Warning: Could not read output of {hostname}", err)
        if hostname == backupComputer or (time.time() - thisCompStartTime) > 100:
            return [0] * len(genomes)
        else:
            return runOneComputer(backupComputer, genomes, hostname)

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
    loops = genomes // computers
    splitGenomes = list()
    for x in range(computers):
        thisCompsGenomes = list()
        thisCompsName = computerList[x]
        #create genome and fitness files (for scotty)
        firstDot = thisCompsName.find('.')
        nm = thisCompsName[:firstDot]
        #get genomes from list
        for i in range(loops + (remain != 0)):
            #from 0 to loops-1, load genomeList[0] into new list for computer[x]
            thisCompsGenomes.append(genomeList[0])
            genomeList.pop(0)
        if (remain != 0):
            remain = remain - 1
        splitGenomes.append((thisCompsName, thisCompsGenomes))
    results = list()
    with Pool(processes = computers) as pool:
        resultsByComputer = pool.starmap(func = runOneComputer, iterable = splitGenomes)
        for resultSublist in resultsByComputer:
            results += resultSublist
    return results



exampleGenomes = [['miner', 'Catnip field', 'woodcutter', 'miner', 'Library', 'miner', 'Pasture', 'hunter', 'hunter', 'Pasture', 'Barn', 'woodcutter', 'Mine', 'Iron Axe', 'Barn', 'priest', 'Calendar', 'hunter', 'miner', 'scholar', 'Catnip field', 'miner', 'miner', 'Iron Hoes', 'miner', 'Mineral Hoes', 'Barn', 'Mining', 'hunter', 'Agriculture', 'Mine', 'priest', 'miner', 'Library', 'Mineral Hoes', 'scholar', 'miner', 'Agriculture', 'Iron Axe', 'Barn', 'Calendar', 'Calendar', 'Mining', 'Iron Hoes', 'Iron Axe', 'geologist', 'priest', 'Iron Hoes', 'geologist', 'Iron Hoes', 'Iron Axe', 'Library', 'scholar', 'woodcutter', 'Mineral Axe', 'Iron Axe', 'Mineral Hoes', 'scholar', 'Archery', 'miner', 'Hut', 'Catnip field', 'Calendar', 'Catnip field', 'Mining', 'geologist', 'Iron Hoes', 'Agriculture', 'Library', 'Mineral Hoes', 'Iron Axe', 'Barn', 'Mine', 'Mine', 'Library', 'Iron Axe', 'Pasture', 'Mineral Axe', 'priest', 'hunter', 'Hut', 'Mining', 'geologist', 'Archery', 'Iron Hoes', 'Mineral Axe', 'geologist', 'Mining', 'scholar', 'Barn', 'Calendar', 'Archery', 'Pasture', 'geologist', 'Agriculture', 'Catnip field', 'Iron Hoes', 'Pasture', 'Calendar', 'Library', 'Barn', 'priest', 'Catnip field', 'miner', 'Barn'], ['woodcutter', 'Catnip field', 'scholar', 'Mineral Hoes', 'Catnip field', 'farmer', 'scholar', 'Mine', 'Mining', 'Iron Axe', 'Mineral Hoes', 'geologist', 'Mineral Axe', 'miner', 'priest', 'Catnip field', 'Calendar', 'Catnip field', 'Mineral Hoes', 'geologist', 'Mining', 'farmer', 'Mineral Hoes', 'Hut', 'farmer', 'miner', 'Pasture', 'Mineral Hoes', 'Mining', 'Calendar', 'Hut', 'miner', 'Mine', 'Hut', 'Agriculture', 'woodcutter', 'Barn', 'Library', 'Catnip field', 'Iron Hoes', 'geologist', 'Hut', 'miner', 'Archery', 'Archery', 'Hut', 'geologist', 'woodcutter', 'Mineral Axe', 'scholar', 'priest', 'geologist', 'Calendar', 'Archery', 'Calendar', 'Iron Hoes', 'Barn', 'woodcutter', 'Catnip field', 'Mineral Hoes', 'miner', 'Agriculture', 'woodcutter', 'Calendar', 'woodcutter', 'Catnip field', 'scholar', 'Hut', 'Hut', 'Barn', 'scholar', 'Catnip field', 'geologist', 'Mineral Hoes', 'Archery', 'Mine', 'scholar', 'Calendar', 'woodcutter', 'Pasture', 'Mine', 'farmer', 'Mine', 'Library', 'Iron Hoes', 'Iron Hoes', 'Library', 'Mine', 'woodcutter', 'Barn', 'priest', 'hunter', 'Pasture', 'woodcutter', 'scholar', 'Calendar', 'Pasture', 'Hut', 'miner', 'Hut', 'geologist', 'Agriculture', 'Hut', 'Library', 'Mining'], ['farmer', 'Iron Axe', 'Mineral Hoes', 'Pasture', 'Mineral Hoes', 'woodcutter', 'Mine', 'geologist', 'Library', 'Barn', 'Hut', 'Pasture', 'Calendar', 'Iron Hoes', 'Archery', 'Catnip field', 'geologist', 'Mining', 'Mineral Axe', 'geologist', 'Catnip field', 'Mining', 'Library', 'scholar', 'Barn', 'Library', 'Mine', 'miner', 'miner', 'Mineral Axe', 'priest', 'scholar', 'Calendar', 'geologist', 'Calendar', 'priest', 'miner', 'Library', 'Archery', 'Mineral Axe', 'priest', 'priest', 'Library', 'miner', 'Iron Hoes', 'farmer', 'Library', 'Library', 'hunter', 'Mineral Axe', 'Barn', 'Calendar', 'priest', 'Mineral Hoes', 'woodcutter', 'geologist', 'Mining', 'priest', 'miner', 'Iron Axe', 'hunter', 'Mine', 'Archery', 'Agriculture', 'Iron Hoes', 'Mineral Axe', 'Calendar', 'woodcutter', 'Iron Axe', 'scholar', 'Iron Hoes', 'Mining', 'Agriculture', 'Iron Axe', 'Mineral Hoes', 'Agriculture', 'woodcutter', 'scholar', 'Archery', 'Archery', 'hunter', 'farmer', 'Mining', 'Iron Axe', 'hunter', 'geologist', 'Pasture', 'Mineral Axe', 'farmer', 'miner', 'Mineral Axe', 'Catnip field', 'priest', 'hunter', 'Library', 'Catnip field', 'Mineral Axe', 'miner', 'hunter', 'scholar', 'Iron Hoes', 'Pasture', 'woodcutter', 'Mineral Axe', 'Hut'], ['Library', 'Pasture', 'woodcutter', 'miner', 'priest', 'Archery', 'farmer', 'geologist', 'Mineral Axe', 'Barn', 'Mining', 'woodcutter', 'Mine', 'Hut', 'miner', 'Barn', 'hunter', 'farmer', 'Agriculture', 'hunter', 'geologist', 'hunter', 'Catnip field', 'Mine', 'priest', 'Hut', 'miner', 'priest', 'Mineral Axe', 'Calendar', 'Hut', 'geologist', 'Mine', 'farmer', 'Catnip field', 'Mineral Hoes', 'Agriculture', 'farmer', 'geologist', 'Mining', 'scholar', 'miner', 'priest', 'Archery', 'Iron Axe', 'Archery', 'Mineral Axe', 'Iron Hoes', 'woodcutter', 'miner', 'Iron Axe', 'geologist', 'Hut', 'woodcutter', 'Mine', 'woodcutter', 'Barn', 'Iron Axe', 'Iron Hoes', 'geologist', 'geologist', 'scholar', 'Agriculture', 'Mineral Hoes', 'Iron Axe', 'Calendar', 'Mineral Axe', 'woodcutter', 'Hut', 'Pasture', 'Mineral Axe', 'Barn', 'Mineral Axe', 'miner', 'scholar', 'hunter', 'Mineral Axe', 'Hut', 'Iron Axe', 'miner', 'Mining', 'Mine', 'Hut', 'woodcutter', 'Agriculture', 'scholar', 'scholar', 'farmer', 'Agriculture', 'Pasture', 'woodcutter', 'Mineral Hoes', 'priest', 'hunter', 'Agriculture', 'Agriculture', 'Mineral Axe', 'Agriculture', 'Mine', 'hunter', 'Barn', 'Library', 'Hut', 'Library', 'Library'], ['farmer', 'Iron Hoes', 'Library', 'priest', 'Pasture', 'hunter', 'geologist', 'miner', 'Calendar', 'Iron Axe', 'Mineral Axe', 'farmer', 'Calendar', 'Mineral Axe', 'Archery', 'Mineral Axe', 'woodcutter', 'Iron Hoes', 'priest', 'hunter', 'Library', 'Archery', 'Mineral Hoes', 'scholar', 'Hut', 'Library', 'Library', 'priest', 'priest', 'Catnip field', 'Library', 'Agriculture', 'miner', 'Pasture', 'Catnip field', 'Hut', 'Mining', 'Pasture', 'Mineral Hoes', 'woodcutter', 'Hut', 'Pasture', 'miner', 'Barn', 'Iron Hoes', 'Mining', 'priest', 'Mining', 'hunter', 'Library', 'scholar', 'priest', 'farmer', 'Pasture', 'hunter', 'Hut', 'Mining', 'hunter', 'Barn', 'Mine', 'Iron Axe', 'scholar', 'Archery', 'miner', 'Mining', 'priest', 'Calendar', 'geologist', 'Pasture', 'priest', 'Iron Hoes', 'Iron Axe', 'Mining', 'Pasture', 'Agriculture', 'Agriculture', 'Catnip field', 'Catnip field', 'scholar', 'Archery', 'priest', 'Barn', 'farmer', 'priest', 'Iron Axe', 'Hut', 'miner', 'woodcutter', 'woodcutter', 'miner', 'Mineral Axe', 'Hut', 'Library', 'Mineral Hoes', 'hunter', 'miner', 'geologist', 'Mineral Hoes', 'Iron Axe', 'Catnip field', 'Catnip field', 'Mineral Hoes', 'scholar', 'Iron Axe', 'Agriculture'], ['Mineral Axe', 'Hut', 'Mining', 'miner', 'Mine', 'Calendar', 'Calendar', 'farmer', 'Archery', 'Mineral Hoes', 'Calendar', 'scholar', 'Hut', 'Archery', 'geologist', 'Hut', 'priest', 'Pasture', 'miner', 'Iron Axe', 'Iron Hoes', 'scholar', 'hunter', 'Library', 'Catnip field', 'Mine', 'Hut', 'Pasture', 'Agriculture', 'priest', 'Library', 'Catnip field', 'woodcutter', 'Library', 'miner', 'Mining', 'miner', 'Agriculture', 'priest', 'Iron Axe', 'Iron Hoes', 'woodcutter', 'hunter', 'Hut', 'farmer', 'woodcutter', 'Calendar', 'priest', 'miner', 'Barn', 'woodcutter', 'Agriculture', 'Barn', 'miner', 'scholar', 'Hut', 'hunter', 'geologist', 'Iron Axe', 'miner', 'Library', 'Agriculture', 'Hut', 'Agriculture', 'Archery', 'Mineral Axe', 'Library', 'hunter', 'Mine', 'geologist', 'Iron Axe', 'Mining', 'Library', 'miner', 'Pasture', 'Mineral Hoes', 'Calendar', 'Mine', 'geologist', 'Archery', 'priest', 'Iron Axe', 'Mineral Hoes', 'woodcutter', 'miner', 'geologist', 'Barn', 'Archery', 'Agriculture', 'Mine', 'scholar', 'Pasture', 'Iron Axe', 'Catnip field', 'Mineral Hoes', 'Barn', 'miner', 'Mineral Hoes', 'hunter', 'Barn', 'Barn', 'Calendar', 'Catnip field', 'Mine', 'Iron Hoes'], ['scholar', 'scholar', 'miner', 'priest', 'scholar', 'hunter', 'priest', 'Pasture', 'geologist', 'priest', 'Mineral Axe', 'Catnip field', 'woodcutter', 'hunter', 'Pasture', 'Barn', 'Barn', 'Calendar', 'Archery', 'scholar', 'hunter', 'Mine', 'Barn', 'priest', 'Archery', 'Archery', 'Agriculture', 'Mineral Axe', 'Iron Axe', 'Calendar', 'Hut', 'Barn', 'Agriculture', 'miner', 'Barn', 'woodcutter', 'Mineral Axe', 'woodcutter', 'hunter', 'hunter', 'Archery', 'Catnip field', 'Pasture', 'Mineral Hoes', 'Agriculture', 'Calendar', 'Hut', 'Mineral Axe', 'Iron Axe', 'Agriculture', 'Barn', 'Library', 'Mining', 'Calendar', 'Pasture', 'hunter', 'Library', 'Library', 'Barn', 'Agriculture', 'Hut', 'Barn', 'Mining', 'scholar', 'Mineral Hoes', 'Hut', 'Iron Axe', 'priest', 'woodcutter', 'Mineral Axe', 'Mineral Hoes', 'Mineral Hoes', 'woodcutter', 'Library', 'Iron Axe', 'Iron Hoes', 'miner', 'Mining', 'Hut', 'Agriculture', 'Archery', 'Hut', 'scholar', 'Mineral Hoes', 'Calendar', 'scholar', 'farmer', 'scholar', 'Mineral Hoes', 'Mine', 'farmer', 'Hut', 'woodcutter', 'Hut', 'Catnip field', 'farmer', 'Agriculture', 'Hut', 'Mineral Axe', 'Iron Hoes', 'geologist', 'Mineral Axe', 'miner', 'Agriculture', 'Catnip field'], ['Pasture', 'Calendar', 'woodcutter', 'Archery', 'Iron Axe', 'Barn', 'woodcutter', 'Mining', 'scholar', 'geologist', 'scholar', 'miner', 'Catnip field', 'Catnip field', 'Mineral Hoes', 'Catnip field', 'Iron Axe', 'priest', 'Hut', 'farmer', 'priest', 'Pasture', 'Barn', 'Iron Axe', 'Archery', 'Iron Hoes', 'Mining', 'Iron Axe', 'Pasture', 'scholar', 'Catnip field', 'Barn', 'Barn', 'Mining', 'Agriculture', 'scholar', 'woodcutter', 'scholar', 'Agriculture', 'Mineral Hoes', 'hunter', 'Calendar', 'Iron Axe', 'Archery', 'Mining', 'Library', 'Mining', 'Mineral Axe', 'priest', 'Barn', 'Mineral Axe', 'hunter', 'Agriculture', 'miner', 'Iron Axe', 'Mine', 'Archery', 'Mineral Hoes', 'Library', 'Iron Hoes', 'Catnip field', 'Hut', 'Mineral Hoes', 'hunter', 'Iron Axe', 'woodcutter', 'Barn', 'priest', 'woodcutter', 'hunter', 'Iron Hoes', 'Mine', 'Iron Hoes', 'scholar', 'scholar', 'hunter', 'miner', 'Library', 'Hut', 'miner', 'farmer', 'Barn', 'woodcutter', 'Archery', 'Library', 'Mineral Axe', 'scholar', 'Barn', 'Pasture', 'Library', 'Archery', 'farmer', 'scholar', 'Mineral Axe', 'Mining', 'Mineral Hoes', 'Iron Hoes', 'scholar', 'Iron Axe', 'Catnip field', 'Library', 'miner', 'priest', 'Archery', 'Library']]

compFile = "./computers.txt"
fullComputerList = list()
startTime = round(time.time())

def makeLogFolder():
    try:
        os.mkdir(f'./logs/{startTime}')
    except FileExistsError:
        pass

def run(genomeList):
    global fullComputerList
    if (fullComputerList == list()):
        with open(compFile) as f:
            fullComputerList = [line.rstrip('\n') for line in f]
    computerList = getWorkingComputers(fullComputerList)
    generationStartTime = time.time()
    result = start(computerList, genomeList)
    timePassed = time.time() - generationStartTime
    with open(f'./logs/{startTime}/timings.log', 'a') as f:
        print(timePassed, file=f)
    return result

if __name__ == '__main__':
    genomeList = exampleGenomes
    print(run(genomeList))


