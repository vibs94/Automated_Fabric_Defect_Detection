import time

class Test:
	
	i = 1

	def _init_(self):
		Test.i = 1
	def run(self):
		while(Test.i):
			print("----------------runing------------------")
			time.sleep(1)
		print("----------------stoped------------------")

	def stop(self):
		Test.i = 0

	def setup(self):
		Test.i = 1