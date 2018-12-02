import random
import math
import multiprocessing
import numpy
import pickle
from worker import run_browser
import captain
import sys

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

    def breed(self, p1, p2, pMut):
        crossoverIdx = random.randrange(0, min(len(p1), len(p2)) + 1)
        (c1, c2) = tuple([self.mutate(self.cross(a, b, crossoverIdx), pMut, mustMutate) for (a, b, mustMutate) in [(p1, p2, True), (p2, p1, False)]])
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

    def newGeneration(self, scored, pMut, breedingPortion, mutatingPortion):
        numPairs = int(len(scored)*breedingPortion)
        toBreed = numPairs * 2
        toMutate = int(len(scored)*mutatingPortion)
        toKeep = len(scored) - toBreed - toMutate
        breeders = [ gen for (fitness, fresh, gen) in scored[:toBreed]]
        random.shuffle(breeders)
        pairs = zip(breeders[:numPairs], breeders[numPairs:])
        # Might want to pull score out of breed to simplify parallelization
        children = [ child for (p1, p2) in pairs for child in self.breed(p1, p2, pMut)]
        mutated = [ (self.mutate(gen, pMut, True)) for (fitness, fresh, gen) in scored[:toMutate] ]
   
        #children + mutated need to be scored
        #concatenate the two lists
        unscored = children + mutated
        newscored = self.scoreAll(unscored)
        keepers = [ (fitness, False, gen) for (fitness, fresh, gen) in scored[:toKeep] ]
        return keepers + newscored
#        return keepers + mutated + children

    def scoreAll(self, muts):
        pass
        #return [self.score(mut)for mut in muts]

    # Temperature Schedule (for SA): Defines odds of exploring a worse solution over time. Set to always 0 for non-SA
    # Mutation Schedule: Defines odds of mutating an individual gene, over time
    # Breeding portion: Defines number of breeding pairs per generation. Eg portion=1/3 means 2/3 of the populatin will be included in a breeding pair. Set to 0 for SA or HC.
    # Mutating portion: Defines portion of population to mutate (without breeding) each generation. Set to 0 for pure GA.
    def run(self, population, temperatureSchedule, mutationSchedule, breedingPortion, mutatingPortion, iterations, printProgress):
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
            with open(f'./logs/{captain.startTime}/gen_{i}', 'wb') as genomeDump:
                pickle.dump(scored, genomeDump)
            with open(f'./logs/{captain.startTime}/bestScores.log', 'a') as bestLog:
                scores = [ score for (score, fresh, gen) in scored[:10] ]
                positiveScores = [ score for (score, fresh, gen) in scored if score > 0 ]
                average = sum(positiveScores) / max(len(positiveScores), 1)
                print(f"Generation {i}: Avg: {average} Top 10: {scores}", file=bestLog)
            population = self.newGeneration(scored, pMut, breedingPortion, mutatingPortion)
        scored = self.sortGeneration(population, 0)
        if (printProgress):
            print("Value:", scored[0][0])
            self.printInfo(scored[0][2])
            print(scored[0][2])
        return scored[0][0]

    def printInfo(self, gen): pass

# Stuff specific to Knapsack Problem. Should be removed later, but useful as code template
class KittensProblem(GeneralizedBeamSearch):
    def __init__(self, buildings, build_order_length, techVals):
        self.buildings = buildings
        self.techVals = techVals
        self.build_order_length = build_order_length
        #add tech array of fixed size (number of techs)

    # score is the function that should send the genome to another computer to be tested for fitness in Simba
    # we might want to keep a cache of recently-scored genomes, and use the cached result if we have duplicate genomes in the population, since scoring is extremely expensive
    def score(self, mut):
        (fresh, gen) = mut
<<<<<<< HEAD
        return (self.fitness_function(gen), fresh, gen)
=======
        return (run_browser(toSimbaSettings(gen)), fresh, gen)
        #return (self.fitness_function(gen), fresh, gen)

    def scoreAll(self, muts):
        genomes = [ gen for (fresh, gen) in muts ]
        scores = captain.run(genomes)
        return [ (score, fresh, gen) for (score, (fresh, gen)) in zip(scores, muts) ]
>>>>>>> origin/master

    #working off of Griffin's suggestion, this arbitrary fitness function will find the first instance of 'field'
    #then it will check if a Hut comes after field. 
    #ideal pattern would be Field, Hut, Barn, Library
    def fitness_function(self, gen):
        fitness = 0
        FList = ["Catnip field", "Hut", "Barn", "Library"]
        increment = 0

        for pos in range(len(gen)):
            if gen[pos] == FList[increment]:
                increment = (increment+1)%len(FList)
                fitness += 1
            else:
                fitness -= 1
        return fitness

    #princess kim's implementation of mutate
    def mutate(self, genome, mutationChance, alwaysChange):   
        #TODO: chance of removing should be lower than chance of adding
        #a random number of buildings to add
        numAdded = min(numpy.random.poisson(len(genome) * mutationChance) + alwaysChange, len(genome))
        #a random number of buildings to remove
        numRemoved = min(numpy.random.poisson(len(genome) * mutationChance) + alwaysChange, len(genome))
        #a random number of techs to mutate (copy numAdded/Removed logic for now
        numTechMut = min(numpy.random.poisson(len(self.techVals) * mutationChance) + alwaysChange, len(self.techVals))

        newGenome = genome.copy()
        for x in range(numRemoved):    #loop numRemoved times
            pos = random.randrange(len(newGenome)) 
            del newGenome[pos]    
<<<<<<< HEAD
        for pos in random.sample(range(len(newGenome)), numAdded):        #inserts a random building at random positions
=======
        for x in range(numAdded):
            pos = random.randrange(len(newGenome) + 1) 
>>>>>>> origin/master
            newGenome.insert(pos, random.choice(self.buildings))
        return (alwaysChange, newGenome)
    
        #now mutate techVals
        for t in range(len(techVals)):
            pos = random.randrange(len(techVals)) 
            #mutate techVals[pos]
            techVals = techVals-2 *pos
#TODO: mutate tech array
    def printInfo(self, gen):
        print(toSimbaSettings(gen))

    def AddTech(self, pos, gen):
        #given a position - check tech[pos,1] to get its prereq and check if that prereq exists in genome?
        prereq = tech[pos,1]
        count = techVals[pos]
        newGenome = gen.copy()

        for x in range(len(newGenome)):
            if(newGenome[x] == tech[pos,1]):
                newGenome.insert(pos+count, tech[pos,0])
                return

    def randomGenome(self):
        gen = [] 
        for pos in range(self.build_order_length):
            gen.append(random.choice(self.buildings))
#        return self.score((True, gen)) #Returns the score that corresponds to that list of elements
        return gen      #returns UNSCORED genome?


#example parameters
def temperatureSchedule2(t, iterations):
    #return max((1 - t / iterations * 1.2) * 10000, 0)
    return pow(.98, (t)) * 10000 * max((1 - t / iterations * 1.2), 0)
def temperatureSchedule0(t, iterations):
    return 0
def mutationSchedule(t, iterations):
    #return (1 - t / iterations) * 0.002
    #return T * .002
    return 0.01


#define and run different problems
def kittensTrial(j):
<<<<<<< HEAD
    buildings = [
      "Catnip Field",
      "Pasture",
      "Aqueduct",
      "Hydro Plant",
      "Hut",
      "Log House",
      "Mansion",
      "Library",
      "Academy",
      "Observatory",
      "Bio Lab",
      "Barn",
      "Warehouse",
      "Harbor",
      "Mine",
      "Quarry",
      "Lumber Mill",
      "Oil Well",
      "Accelerator",
      "Steamworks",
      "Magneto",
      "Smelter",
      "Calciner",
      "Factory",
      "Reactor",
      "Ampitheatre",
      "Broadcast Tower",
      "Chapel",
      "Temple",
      "Workshop",
      "Tradepost"
    ]

    upgrades = [
            ("Ironwood Huts","Reinforced Warehouses"),( "Concrete Huts","Concrete Pillars"), ("Titanium Reflectors","Navigation"), ("Astrolabe","Navigation"),( "Biofuel Processing","Biochemistry"),( "GM Catnip", "Genetics"),( "Expanded Barns", "Barn"),( "Reinforced Barns","Barn"),( "Titanium Barns","Reinforced Barns"),( "Alloy Barns","Chemistry"),( "Concrete Barns","Concrete Pillars"),( "Reinforced Warehouses","Steel"),( "Titanium Warehouses", "Silos"), ("Silos", "Ironwood Huts"), ("Alloy Warehouses", "Chemistry"),( "Concrete Warehouses", "Concrete Pillars"), ("Expanded Cargo", "Navigation"), ( "Deep Mining", "Steel"),("Reinforced Saw", "Construction"),( "Steel Saw","Physics"),( "Titanium Saw","Steel Saw"),( "Alloy Saw","Titanium Saw"),( "Pumpjack", "Mechanization"),("Oil Refinery", "Combustion"),("Oil Distillation","Rocketry"),( "Printing Press", "Machinery"),("Offset Press", "Combustion"),( "High Pressure Engine", "Steel"),( "Fuel Injectors","Combustion"),( "Gold Ore", "Currency"),("Coal Furnace", " Steel"),("Electrolytic Smelting", "Metallurgy"),("Oxidation", "Metallurgy"),( "Rotary Kiln", "Robotics"), ("Caravanserai", "Navigation"),( "Bolas","Mining"),( "Hunting Armour","Metal Working"),( "Celestial Mechanics", "Mathematics"),("Composite Bow", "Construction"),("Catnip Enrichment", "Construction"),( "Register","Writing"),("Steel Axe","Steel"),("Steel Armour", "Steel"),("Crossbow", "Machinery"),("Titanium Axe","Navigation"),( "Pyrolysis", "Physics"),("Alloy Axe", "Chemistry"),( "Alloy Armour","Chemistry"),( "Geodesy", "Geology"),( "Biofuel processing", "Biochemistry"),( "Logistics", "Industrialization"),( "Concrete Pillars", "Mechanization"),("Mining Drill","Metallurgy"),( "Refrigeration", "Electronics"),("CAD System", "Electronics"),("Telecommunication", "Electronics"),( "Factory Logistics","Electronics"),( "Robotic Assistance", "Electronics")
    ]


    religion = [
        ("Scholasticism", "Temple"), ("Golden Spire", "Temple"), ("Sun Altar", "Temple"), ("Stained Glass", "Temple"), ("Basilica", "Temple"), ( "Templars", "Temple"), ("Apocrypha", "Temple"), ("Transcendence", "Temple")
    ]

    tech = [
        ("Calendar", "Library"),("Agriculture","Calendar"), ( "Mining", "Agriculture"),( "Archery", "Agriculture"),("Metal Working", "Mining"),( "Mathematics","Animal Husbandry"), ( "Animal Husbandry", "Archery"), ("Civil Service","Animal Husbandry"),( "Construction","Animal Husbandry"), ( "Currency", "Civil Service"), ( "Engineering", "Construction"),("Steel", "Writing"),( "Writing", "Engineering"),( "Machinery", "Writing"),("Philosophy","Writing"),( "Theology","Philosophy"),( "Astronomy","Theology"),( "Biology", "Geology"),( "Geology", "Navigation"),( "Navigation","Astronomy"),( "Architecture", "Navigation"),("Acoustics", "Architecture"),( "Biochemistry","Biology"),( "Chemistry", "Physics"),( "Physics", "Navigation"),( "Drama and Poetry", "Acoustics"),( "Genetics", "Biochemistry"),( "Electricity","Physics"),( "Metallurgy", "Industrialization"),( "Industrialization", "Electricity"),( "Combustion", "Industrialization"),( "Mechanization", "Industrialization"),("Robotics", "Electronics"),( "Electronics", "Mechanization"),( "Rocketry", "Electronics")
    ]

    
#   build order length is used to initialize the genomes size at first. 
#   size is not fixed, genomes can shrink or grow depending on how it is mutated    
#   buildings can be bought (and should be bought) multiple times, so the build length is a multiple of the number of buildings
    build_order_length = len(buildings) * 3
    techVals = []
    techVals = [random.randrange(5) for T in range (len(tech))]
    kittensProblem = KittensProblem(buildings, build_order_length, techVals)
    populationSize = 800
    #score population? 
    unscored_population = [ kittensProblem.randomGenome() for i in range(populationSize) ]
    #TODO: initialize tech array. 
    population = [kittensProblem.score((True, gen)) for gen in unscored_population]
=======

#   build order length is used to initialize the genomes size at first. 
#   size is not fixed, genomes can shrink or grow depending on how it is mutated    
#   buildings can be bought (and should be bought) multiple times, so the build length is a multiple of the number of buildings
    captain.makeLogFolder()
    build_order_length = len(allQueueables) * 3
    kittensProblem = KittensProblem(allQueueables, build_order_length)
    if len(sys.argv) <= 1:
        populationSize = 60 * 8 * 3 // 2
        unscored_population = [ (True, kittensProblem.randomGenome()) for i in range(populationSize) ]
        population = kittensProblem.scoreAll(unscored_population)
    else:
        population = pickle.load(open(sys.argv[1], 'rb'))
        if len(sys.argv) > 2 and sys.argv[2] == "rescore":
            unscored_population = [ (fresh, gen) for (fitness, fresh, gen) in population ]
            population = kittensProblem.scoreAll(unscored_population)
>>>>>>> origin/master
    return kittensProblem.run(population, temperatureSchedule0, mutationSchedule, 1/3, 0/2, 100, j == 0)

# Turns a genome into a save file that Simba can understand and import
# Call Simba's importSaveDecompressed on the return value of this function
def toSimbaSettings(genome):
    blds = []
    genome = ["Moon Mission"] + ["Catnip field"] * 20 + genome + ["Orbital Launch"]
    seen = set()
    for name in genome:
        for (membersOfType, tab, panel) in queueableTypes:
            if name in membersOfType:
                if tab in {"Workshop", "Science", "Religion"}:
                    if name in seen:
                        break
                    seen.add(name)
                elif tab == "Trade":
                    panel = name
                    if name not in seen:
                        blds.append(f'{{"name":"Send explorers","tab":"Trade","panel":""}}')
                        seen.add(name)
                blds.append(f'{{"name":"{name}","tab":"{tab}","panel":"{panel}"}}')
                break
    blds.append(f'{{"name":"Praise the sun!","tab":"Religion","panel":"Order of the Sun"}}')
    queue = ",".join(blds)
    jobQueue = ",".join([f'"{job}"' for job in genome if job in jobsSet])
    return f'{{"queue": [{queue}], "jobQueue": [{jobQueue}], "geneticAlgorithm": true, "speed": 4096, "disableTimeskip": true, "desiredTicksPerLoop": 64, "running": true, "autoHunt": true, "autoSteel": true}}'

buildings = [
  "Catnip field",
  "Catnip field", #include twice to encourage building more
  "Pasture",
  "Aqueduct",
  #"Hydro Plant",
  "Hut",
  "Log House",
  "Mansion",
  "Library",
  "Academy",
  "Observatory",
  "Bio Lab",
  "Barn",
  "Warehouse",
  "Harbour",
  "Mine",
  "Quarry",
  "Lumber Mill",
  "Oil Well",
  #"Accelerator",
  "Steamworks",
  "Magneto",
  "Smelter",
  "Calciner",
  "Factory",
  "Reactor",
  "Amphitheatre",
  #"Broadcast Tower",
  "Chapel",
  "Temple",
  "Workshop",
  "Tradepost",
  "Unic. Pasture"
  #Mint, Solar Farm, Chronosphere useless
]

upgrades = [
   ("Mineral Hoes", "Workshop"), ("Mineral Axe", "Workshop"), ("Iron Hoes", "Workshop"), ("Iron Axe", "Workshop"),
("Ironwood Huts","Reinforced Warehouses"),( "Concrete Huts","Concrete Pillars"), ("Titanium Reflectors","Navigation"), ("Astrolabe","Navigation"),( "Biofuel processing","Biochemistry"),( "GM Catnip", "Genetics"),( "Expanded Barns", "Barn"),( "Reinforced Barns","Barn"),( "Titanium Barns","Reinforced Barns"),( "Alloy Barns","Chemistry"),( "Concrete Barns","Concrete Pillars"),( "Reinforced Warehouses","Steel"),( "Titanium Warehouses", "Silos"), ("Silos", "Ironwood Huts"), ("Alloy Warehouses", "Chemistry"),( "Concrete Warehouses", "Concrete Pillars"), ("Expanded Cargo", "Navigation"), ( "Deep Mining", "Steel"),("Reinforced Saw", "Construction"),( "Steel Saw","Physics"),( "Titanium Saw","Steel Saw"),( "Alloy Saw","Titanium Saw"),( "Pumpjack", "Mechanization"),("Oil Refinery", "Combustion"),("Oil Distillation","Rocketry"),( "Printing Press", "Machinery"),("Offset Press", "Combustion"),( "High Pressure Engine", "Steel"),( "Fuel Injectors","Combustion"),( "Gold Ore", "Currency"),("Coal Furnace", " Steel"),("Electrolytic Smelting", "Metallurgy"),("Oxidation", "Metallurgy"),( "Rotary Kiln", "Robotics"), ("Caravanserai", "Navigation"),( "Bolas","Mining"),( "Hunting Armour","Metal Working"),( "Celestial Mechanics", "Mathematics"),("Composite Bow", "Construction"),("Catnip Enrichment", "Construction"),( "Register","Writing"),("Steel Axe","Steel"),("Steel Armour", "Steel"),("Crossbow", "Machinery"),("Titanium Axe","Navigation"),( "Pyrolysis", "Physics"),("Alloy Axe", "Chemistry"),( "Alloy Armour","Chemistry"),( "Geodesy", "Geology"),( "Biofuel processing", "Biochemistry"),( "Logistics", "Industrialization"),( "Concrete Pillars", "Mechanization"),("Mining Drill","Metallurgy"),( "Refrigeration", "Electronics"),("CAD System", "Electronics"),("Telecommunication", "Electronics"),( "Factory Logistics","Electronics"),( "Robotic Assistance", "Electronics")
]


religion = [
    ("Scholasticism", "Theology"), ("Golden Spire", "Theology"), ("Sun Altar", "Theology"), ("Stained Glass", "Theology"), ("Basilica", "Theology"), ( "Templars", "Theology"), #("Apocrypha", "Theology"), ("Transcendence", "Theology")
]

science = [
    ("Calendar", "Library"),("Agriculture","Calendar"), ( "Mining", "Agriculture"),( "Archery", "Agriculture"),("Metal Working", "Mining"),( "Mathematics","Animal Husbandry"), ( "Animal Husbandry", "Archery"), ("Civil Service","Animal Husbandry"),( "Construction","Animal Husbandry"), ( "Currency", "Civil Service"), ( "Engineering", "Construction"),("Steel", "Writing"),( "Writing", "Engineering"),( "Machinery", "Writing"),("Philosophy","Writing"),( "Theology","Philosophy"),( "Astronomy","Theology"),( "Biology", "Geology"),( "Geology", "Navigation"),( "Navigation","Astronomy"),( "Architecture", "Navigation"),("Acoustics", "Architecture"),( "Biochemistry","Biology"),( "Chemistry", "Physics"),( "Physics", "Navigation"),( "Drama and Poetry", "Acoustics"),( "Genetics", "Biochemistry"),( "Electricity","Physics"),( "Metallurgy", "Industrialization"),( "Industrialization", "Electricity"),( "Combustion", "Industrialization"),( "Mechanization", "Industrialization"),("Robotics", "Electronics"),( "Electronics", "Mechanization"),( "Rocketry", "Electronics")
]

#space is special, and not included as a regular queueable
space = [
    "Orbital Launch",
    "Moon Mission",
]

trade = [
    "Lizards",
    "Sharks",
    "Griffins",
    "Nagas",
    "Zebras", # need this for titanium!
    "Spiders",
]

craft = [
    "Trade Ship" # need this for titanium!
]

special = [
    "Promote kittens",
    "Hold Festival"
]

def techsOf(techList):
    return [tech for (tech, requirement) in techList]
queueableTypes = [(set(buildings), "Bonfire", ""), (set(techsOf(upgrades)), "Workshop", "Upgrades"), (set(techsOf(science)), "Science", ""), (set(techsOf(religion)), "Religion", "Order of the Sun"), (set(space), "Space", "Ground Control"), (set(trade), "Trade", ""), (set(craft), "Workshop", "Crafting"), (set(special), "Village", "Management")]
jobs = [
    "woodcutter",
    "scholar",
    "miner",
    "farmer",
    "hunter",
    "geologist",
    #"priest",
]
jobsSet = set(jobs)
allQueueables = buildings + techsOf(upgrades) + techsOf(science) + jobs + techsOf(religion) + trade + craft + special


if __name__ == "__main__":
    kittensTrial(0)
