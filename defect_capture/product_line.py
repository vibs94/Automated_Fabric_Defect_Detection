from avg_rgb import *
from led_panel import *
from camera import *
from color_code import *
import datetime
from PIL import Image
from io import BytesIO


camera = ""
panel = ""
colorPredict = ""

class ProductLine:                
	def __init__(self):
		ProductLine.camera = Camera()
		ProductLine.panel = LedPanel()
		ProductLine.colorPredict = ColorPredict()

	def setLEDColor(self,r,g,b):
		colo = str(r)+" "+str(g)+" "+str(b)
		ProductLine.panel.set_color_rgb(colo)

	def getClothColor(self):
		older_name = 'raw_cloth'
		filename='cloth'
		    
		ProductLine.panel.set_color_rgb('255 50 100')
		ProductLine.camera.capture(folder_name,filename,0)
		        
		pc = PixelCounter(folder_name,filename)
		r,g,b = pc.averagePixels()

		colo = ProductLine.colorPredict.predict(r,g,b)
		print("=============================================== Cloth color captured - "+colo+" ===============================================")

		ProductLine.panel.set_color_rgb(colo)
		return colo

	def getImage(self):

		time = datetime.datetime.now()
		folder_name = 'new_cloth'
		filename='cloth_'+ str(time)
		
		ProductLine.camera.capture(folder_name,filename,0)
		        
		print("================================================ Image captured ===============================================")
		image = Image.open('/home/pi/Desktop/FYP/Images/'+folder_name+'/'+ filename+'.jpg')
		x, y, h, w = 400, 150, 550, 500
		croped_image = image.crop((x, y, x+h, y+w))
##		croped_image.show()
		buffered = BytesIO()
		croped_image.save(buffered, format = "JPEG")
		byte_image = buffered.getvalue()
		return byte_image, folder_name, filename
##		return "test"

