import random
import math
import multiprocessing
import numpy

# Generalized Beam Search: Based on parameters (see run function), can run GA, SA, HC, or a hybrid of these strategies.
class GeneralizedBeamSearch:
    def cross(self, p1, p2, idx):
        return p1[:idx] + p2[idx:]

    def mutate(self, gen, mutationChance, alwaysChange):
        numMutated = min(numpy.random.poisson(len(gen) * mutationChance) + alwaysChange, len(gen))
        newGen = gen.copy()
        for pos in random.sample(range(len(gen)), numMutated):
            newGen[pos] = self.mutate1(newGen[pos])
        return (alwaysChange, newGen)

    def breed(self, p1, p2, problem, pMut):
        crossoverIdx = random.randrange(0, len(p1))
        (c1, c2) = tuple([ self.score(self.mutate(self.cross(a, b, crossoverIdx), pMut, mustMutate), problem) for (a, b, mustMutate) in [(p1, p2, True), (p2, p1, False)]])
        return (c1, c2)

    def sortGeneration(self, pop, T):
        best = sorted(pop, key=lambda s: s[0], reverse=True)
        if (T == 0):
            return best
        nextBestPos = (len(pop)-1)//2
        nextBestFitness = best[nextBestPos][0]
        for i in range(len(pop)//2):
            (fitness, fresh, gen) = best[i]
            if (not fresh):
                fitnessDiff = fitness - nextBestFitness
                pKill = math.exp(- fitnessDiff / T)
                if (random.random() < pKill):
                    nextBestPos += 1
                    nextBestFitness = best[nextBestPos][0]
                else:
                    best[i] = (fitness, True, gen)
        return sorted(best, key=lambda s: s[0] if s[1] else -1, reverse=True)

    def newGeneration(self, scored, problem, pMut, breedingPortion, mutatingPortion):
        numPairs = int(len(scored)*breedingPortion)
        toBreed = numPairs * 2
        toMutate = int(len(scored)*mutatingPortion)
        toKeep = len(scored) - toBreed - toMutate
        breeders = [ gen for (fitness, fresh, gen) in scored[:toBreed]]
        random.shuffle(breeders)
        pairs = zip(breeders[:numPairs], breeders[numPairs:])
        children = [ child for (p1, p2) in pairs for child in self.breed(p1, p2, problem, pMut)]
        mutated = [ self.score(self.mutate(gen, pMut, True), problem) for (fitness, fresh, gen) in scored[:toMutate] ]
        keepers = [ (fitness, False, gen) for (fitness, fresh, gen) in scored[:toKeep] ]
        return keepers + mutated + children

    # Temperature Schedule (for SA): Defines odds of exploring a worse solution over time. Set to always 0 for non-SA
    # Mutation Schedule: Defines odds of mutating an individual gene, over time
    # Breeding portion: Defines number of breeding pairs per generation. Eg portion=1/3 means 2/3 of the populatin will be included in a breeding pair. Set to 0 for SA or HC.
    # Mutating portion: Defines portion of population to mutate (without breeding) each generation. Set to 0 for pure GA.
    def run(self, problem, population, temperatureSchedule, mutationSchedule, breedingPortion, mutatingPortion, iterations, printProgress):
        printed = 0
        for i in range(iterations):
            T = temperatureSchedule(i, iterations)
            pMut = mutationSchedule(i, iterations)
            scored = self.sortGeneration(population, T)
            if (printProgress and pow(1.5, printed - 7) + printed*printed / 12 + printed * 2 - 3 <= i):
                printed += 1
                scores = [ score for (score, fresh, gen) in scored[:10] ]
                print(f"Generation {i}: {scores}")
                if (len(scored[0][2]) < 50):
                    print(scored[0][2])
            population = self.newGeneration(scored, problem, pMut, breedingPortion, mutatingPortion)
        scored = self.sortGeneration(population, 0)
        if (printProgress):
            print("Value:", scored[0][0])
            self.printInfo(scored[0][2], problem)
            print(scored[0][2])
        return scored[0][0]

    def printInfo(self, gen, problem): pass

# Stuff specific to Knapsack Problem. Should be removed later, but useful as code template
class KnapsackProblem(GeneralizedBeamSearch):
    # score is the function that should send the genome to another computer to be tested for fitness in Simba
    # we might want to keep a cache of recently-scored genomes, and use the cached result if we have duplicate genomes in the population, since scoring is extremely expensive
    def score(self, mut, problem):
        (objs, cap) = problem
        (fresh, gen) = mut
        if (self.overWeight(gen, objs, cap)):
            return (0, fresh, gen)
        return (sum([ take*value for take, (weight, value) in zip(gen, objs) ]), fresh, gen)

    def mutate1(self, gene):
        return gene ^ 1

    def printInfo(self, gen, problem):
        print("Weight:", self.totalWeight(gen, problem[0]))

    def totalWeight(self, gen, objs): 
        return sum([ take*weight for take, (weight, value) in zip(gen, objs) ])

    def overWeight(self, gen, objs, cap): 
        for take, (weight, value) in zip(gen, objs):
            if (take):
                cap -= weight
                if (cap < 0):
                    return True
        return False

    def randomObj(self, capacity):
        return (random.randrange(1, capacity), random.randrange(1, capacity))

    def randomGenome(self, objs, cap):
        numTaken = numpy.random.poisson(2)
        gen = [0] * len(objs)
        for pos in random.sample(range(len(objs)), numTaken):
            gen[pos] = 1
        return self.score((True, gen), (objs, cap))

class ImprovedKnapsackProblem(KnapsackProblem):
    def score(self, mut, problem):
        (objs, cap) = problem
        (fresh, gen) = mut
        totalValue = 0
        for take, (weight, value) in zip(gen, objs):
            if (take):
                cap -= weight
                if (cap < 0):
                    break
                totalValue += value
        return (totalValue, fresh, gen)

# Code to find better parameters to GA/SA/HC. May be removed later, but useful as code template
class MetaBeamSearch(GeneralizedBeamSearch):
    def __init__(self, subSearch, subIterations):
        self.subSearch = subSearch
        self.subIterations = subIterations

    def sigmoid(self, gene):
        return 1 / (1 + math.exp(-gene))

    def runSubTrial(self, instance, gen):
        (logBaseT, sigTExp, tLinear, logBaseMut, sigMutExp, mutLinear, sigBreedingPortion, sigMutatingPortion) = gen
        baseT = math.exp(logBaseT)
        tExp = self.sigmoid(sigTExp) * 2
        baseMut = math.exp(logBaseMut)
        mutExp = self.sigmoid(sigMutExp) * 2
        def temperatureSchedule(t, iterations):
            try:
                return max(baseT * pow(tExp, t) * (1 + tLinear * t / iterations), 0)
            except OverflowError:
                return math.inf
        def mutationSchedule(t, iterations):
            try:
                return max(min(baseMut * pow(mutExp, t) * (1 + mutLinear * t / iterations), 1), 0)
            except OverflowError:
                return 1
        breedingPortion = self.sigmoid(sigBreedingPortion) / 2
        mutatingPortion = self.sigmoid(sigMutatingPortion) * (1 - breedingPortion * 2)
        (subProblem, subPop) = instance
        return self.subSearch.run(subProblem, subPop, temperatureSchedule, mutationSchedule, breedingPortion, mutatingPortion, self.subIterations, False)

    def score(self, mut, problem):
        (fresh, gen) = mut
        #todo def schedules based on float params
        with multiprocessing.Pool(24) as p:
            return (sum(p.starmap(self.runSubTrial, zip(problem, [gen] * len(problem)))) / len(problem), fresh, gen)

    def mutate1(self, gene):
        return (gene + random.random() - .5) * (random.random() + .5)

    #todo generalize capacity--include data in these objects
    def randomObj(self, capacity, numObjects, populationSize):
        objs = [ self.subSearch.randomObj(capacity) for i in range(numObjects) ]
        population = [ self.subSearch.randomGenome(objs, capacity) for i in range(populationSize) ]
        return ((objs, capacity), population)

    def randomGenome(self, problem):
        gen = [ (random.random() - .5) * 4 for i in range(8) ]
        return self.score((True, gen), problem)

#example parameters
capacity = 1000
def temperatureSchedule2(t, iterations):
    #return max((1 - t / iterations * 1.2) * 10000, 0)
    return pow(.98, (t)) * 10000 * max((1 - t / iterations * 1.2), 0)
def temperatureSchedule0(t, iterations):
    return 0
def mutationSchedule(t, iterations):
    #return (1 - t / iterations) * 0.002
    #return T * .002
    return 0.004

#define and run different problems
knapsack = KnapsackProblem()
def knapsackTrial(j):
    numObjects = 20
    populationSize = 800
    objs = [ knapsack.randomObj(capacity) for i in range(numObjects) ]
    population = [ knapsack.randomGenome(objs, capacity) for i in range(populationSize) ]
    if (numObjects < 50):
        print("Objects:", objs)
    return knapsack.run((objs, capacity), population, temperatureSchedule0, mutationSchedule, 1/3, 0/2, 1000, j == 0)

metaSearch = MetaBeamSearch(ImprovedKnapsackProblem(), 1000)
def metaTrial(j):
    numObjects = 24
    populationSize = 80
    problem = [ metaSearch.randomObj(capacity, 80, 150) for i in range(numObjects) ]
    population = [ metaSearch.randomGenome(problem) for i in range(populationSize) ]
    return metaSearch.run(problem, population, temperatureSchedule0 , mutationSchedule, 1/3, 0/2, 500, True)

def averageKnapsackTrial(trials):
    with multiprocessing.Pool(8) as p:
        results = p.map(knapsackTrial, range(trials))
        print(results)
        print("Average: ", sum(results)/trials)

#problem = [ metaSearch.randomObj(capacity, 80, 150) for i in range(24) ]
#print(metaSearch.score((True, [-0.6054259396832666, -1.2123086049650311, -0.4978623552545826, 0.29816281468476546, -7.81723492065458, -1.041818686799827, 0.17616663713567887, 1.1142006038490322]), problem))
#print(metaSearch.score((True, [-99, -99, -99, -7, 0, 0, 0.8, -99]), problem))
#metaTrial(0)

knapsackTrial(0)
#averageKnapsackTrial(8)
