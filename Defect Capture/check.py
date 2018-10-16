import threading

class Check:

	val = 1
	sem = threading.Semaphore()

	def __init__(self, int):
		Check.val = int

	def isVal(self, int):
		if(Check.val==int):
			return True
		else:
			return False

	def reverseVal(self):
		Check.val = 1 - Check.val

