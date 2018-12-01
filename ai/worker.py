#!/usr/bin/env python

# For selenium to work you will need to install the selenium
# Python package as well as a webdriver executable. Follow the
# installation instructions at https://pypi.org/project/selenium/

import sys
import os
import os.path
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def run_browser(simbaSettings, displayPage=False): #Runs the chrome browser
	baseDir = os.path.abspath(os.path.join(sys.path[0], os.pardir))
	with open(os.path.join(baseDir, "bot.js")) as f:
		botJs = f.read()
	options = webdriver.ChromeOptions()
	options.add_argument('headless')
	driver = webdriver.Chrome(chrome_options=options) #Can be changed to Firefox as well
	driver.get("http://bloodrizer.ru/games/kittens/") #Loads the kittens game
	#Wait for deferred loading
	#initGame unhides the #game element
	try:
		WebDriverWait(driver, 20).until(
			EC.visibility_of(driver.find_element(By.ID, "game"))) #Tries for 20 seconds to load kittens game
			#We are waiting for the game to open for 20 seconds. Once it opens we will launch Simba
	except TimeoutException: #If the game does not load in 20 seconds
		driver.close() #Close the game
		return 0
	driver.execute_script(botJs) #Loads Simba (bot js)
	driver.execute_script("importSaveDecompressed(arguments[0]);", simbaSettings) #Give genome information through Simba
	# See https://selenium-python.readthedocs.io/waits.html
	try:
		# When the simulation is finished, the JS will create an element
		# with ID "fitnessValue"
		timeout_seconds = 60
		element = WebDriverWait(driver, timeout_seconds).until( #Waiting for element Simba will create when it's done
			EC.presence_of_element_located((By.ID, "fitnessValue")))
		if displayPage:
		    print(re.sub(r'\n[\s]*\n', '\n', driver.find_element_by_tag_name('html').text))
		result = int(element.get_attribute('innerHTML').strip()) #Retrieves fitness score
	except TimeoutException:
		#JS failed to create result element within timeout
		if displayPage:
		    print(re.sub(r'\n[\s]*\n', '\n', driver.find_element_by_tag_name('html').text))
		result = 0
	finally:
		driver.close() #Closes everything: Simba and kittens game
	return result

def main(argv): #Used for testing. Import file as a module and call run browser
	defaultSettings = '{"queue": [{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Hut","tab":"Bonfire","panel":""},{"name":"Barn","tab":"Bonfire","panel":""},{"name":"Library","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Hut","tab":"Bonfire","panel":""},{"name":"Barn","tab":"Bonfire","panel":""},{"name":"Library","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Hut","tab":"Bonfire","panel":""},{"name":"Barn","tab":"Bonfire","panel":""},{"name":"Library","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Hut","tab":"Bonfire","panel":""},{"name":"Barn","tab":"Bonfire","panel":""},{"name":"Library","tab":"Bonfire","panel":""},{"name":"Catnip field","tab":"Bonfire","panel":""},{"name":"Hut","tab":"Bonfire","panel":""},{"name":"Barn","tab":"Bonfire","panel":""},{"name":"Library","tab":"Bonfire","panel":""}], "jobQueue": [], "geneticAlgorithm": true, "speed": 2048, "disableTimeskip": true, "desiredTicksPerLoop": 8, "running": true}'
	print(run_browser(defaultSettings, True))

if __name__ == '__main__':
	main(sys.argv)
