import time
from product_line import *
from check import *

class Process:
	
	check = ""
	productLine = ""

	def _init_(self):
		Process.check = Check(1)
		productLine = ProductLine()

	def run(self):
		while(check.isVal(1)):
			print("=============================================== Running ===============================================")
			image = productLine.getImage()
			time.sleep(1)
		print("=============================================== Stoped ===============================================")

	def stop(self):
		check.reverseVal()

	def setup(self):
		Process.check = Check(1)