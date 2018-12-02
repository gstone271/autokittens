import genetic
import pickle
import sys

def getBestStrat(filename):
    genomes = pickle.load(open(filename, "rb"))
    return genetic.toSimbaSettings(genomes[0][2])

if __name__ == "__main__":
    print(getBestStrat(sys.argv[1]))
