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
def startScotty(self, genomeList):
    #this function should be parallel, using multiprocessing.Pool again

    fitnessList = list()
    #run simba with each genome
    for x in genomeList:
        fitness = startSimba(genomeList[x])
        fitnessList.append((fitness, genomeList[x]))

if __name__ == '__main__':
    hostname = sys.argv[1]
    genome_file = TODO_file_named_after_hostname
    fitness_file = TODO_file_named_after_hostname
    genomes = pickle.load(genome_file)
    fitnesses = TODO_startScotty
    pickle.dump(fitnesses, fitness_file)
