import random
import copy

#Genetic Algorithm for Kittens Game (in progress)

#number of individuals in each generation
POPULATION_SIZE = 100


Buildings = ['Catnip Field', 'Pasture', 'Aqueduct', 'Hut', 'Log House',
'Mansion', 'Library', 'Academy', 'Observatory', 'Bio Lab', 'Barn', 'Warehouse',
'Harbor', 'Mine', 'Quarry', 'Lumber Mill', 'Oil Well','Solar Farm', 'Hydro Plant',
'Accelerator', 'Steamworks', 'Magneto', 'Smelter', 'Calciner', 'Factory', 'Reactor',
'Ampitheatre', 'Broadcast Tower', 'Chapel', 'Temple', 'Workshop', 'Tradepost', 'Mint',
'Unicorn Pasture', 'Ziggurat', 'Chronosphere', 'AI Core' ]

Gene_Length = len(Buildings)

class Gene(object):
    def _init_(self, chromosome):
        self.chromosome = chromosome
        self.fitness = self.fitness() #calls fitness function

    @classmethod
    def mutate_gene(self, gene_to_mutate = []):
        
        global Buildings
        index1 = random.choice(range(len(Buildings)))
        index2 = index1

        #ensure next element will never be the same as index1
        while index2 is index1:
            index2 = random.choice(range(len(Buildings)))

        #swap
        gene_to_mutate[index1], gene_to_mutate[index2] = gene_to_mutate[index2], gene_to_mutate[index1]
        return gene_to_mutate


    #Generates a single chromosome
    def Generate_Single():
        global Buildings
        a_gene = []
        while len(a_gene) < len(Buildings):
            choice = random.choice(Buildings)
            if choice not in a_gene:
                a_gene.append(choice)

        return a_gene


    #takes two parents and produces a child
    def Breed(P1 = [], P2 = []):
         child = []
         while len(child) < len(Buildings):
             for ind1, ind2 in zip(P1, P2):
                prob = random.random()

                # if prob is less than 0.45 insert from P1
                if prob < 0.45:
                    if ind1 not in child:
                        child.append(ind1)
                # if prob is between 0.45 and 0.90, insert from P2
                elif prob < 0.90:
                    if ind2 not in child:
                        child.append(ind2)

         print("\nChild length = ", len(child), "Gene_Length = ", Gene_Length)
         return child
            
    


#driver code
def main():
    population = []
    print("Parents")
    one_gene = Gene.Generate_Single()
    two_gene = Gene.Generate_Single()

    print(one_gene, "\n", two_gene)
    a_child = Gene.Breed(one_gene, two_gene)
    print("\nThe child\n", a_child)

    for i in range (0, POPULATION_SIZE):
        #generate a single gene
        one_gene = Gene.Generate_Single()
        #add that single gene to the population
        population.append(one_gene)



    return 

if __name__ == "__main__":
    main()






    
