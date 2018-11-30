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
def startScotty(self, computerName, genomeList):
    #ssh open computer

    fitnessList = list()
    #run simba with each genome
    for x in genomeList:
        fitness = startSimba(genomeList[x])
        fitnessList.append((fitness, genomeList[x]))