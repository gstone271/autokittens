#!/usr/bin/env python

# For selenium to work you will need to install the selenium
# Python package as well as a webdriver executable. Follow the
# installation instructions at https://pypi.org/project/selenium/

import sys
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def run_browser(baseDir, simbaSettings): #Runs the chrome browser
	with open(os.path.join(baseDir, "bot.js")) as f:
		botJs = f.read()
	driver = webdriver.Chrome() #Can be changed to Firefox as well
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
		result = float(element.text.strip()) #Retrieves fitness score as a float
	except TimeoutException:
		#JS failed to create result element within timeout
		result = 0
	finally:
		driver.close() #Closes everything: Simba and kittens game
	return result

def main(argv): #Used for testing. Import file as a module and call run browser
	defaultSettings = '{"queue":[]}'
	run_browser(os.getcwd(), defaultSettings)

if __name__ == '__main__':
	main(sys.argv)
