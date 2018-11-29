# The 'master' program that generates genomes for multiple
# scotty programs to run simba with. 
# Inputs: list of genomes, list of computers, (N run times?)
# Ouputs: list of updated data/ scores
# Operations: start scottys (2/computer?)
#             divide the genomes evenly among the computers and send each its chunk
#             combine the results into a list. 
#             (update genomes?)
#             (run N times?)
# One "leader" program being run has the GA and runs the workers, which run Simba
# Author: Kallen Harvey
# Sources noted where used.
import python-daemon; # for parallelization of scottys across multiple computers?
# possibly need to use bash script to start ssh to
# each computer?

#from genetic import (genome class/where genome info is stored)

