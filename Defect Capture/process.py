import time
from product_line import *
from check import *
import requests
import base64


class Process:
	
	check = 1
	count = 0
	url = "https://edc1cfc0.ngrok.io"
	productLine = ProductLine()

	def _init_(self):
                Process.check = 1
                Process.count = 0
                Process.productLine = ProductLine()

	def run(self):
		while(Process.check == 1):
			print("=============================================== Running ===============================================")
			image, folder_name, file_name = Process.productLine.getImage()
			time.sleep(1)
			image_base64 = base64.b64encode(image)
			file_name = "Cloth_frame_"+str(Process.count)
			data = {'encode_str':image_base64,'file_name':file_name,'file_suffix':folder_name}
			request = requests.post(Process.url + "/admin/upload_and_process",data = data)
			print("Request responce: " + request.text)
			print("Status code: " + str(request.status_code) + " Reason: "+ str(request.reason))
			Process.count = Process.count + 1
		print("=============================================== Stoped ===============================================")

	def stop(self):
		Process.check = 0

	def setup(self):
                Process.count = 0
                Process.check = 1
