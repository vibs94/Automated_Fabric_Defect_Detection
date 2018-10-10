from avg_rgb import *
from led_panel import *
from camera import *
from color_code import *
import datetime

camera=Camera()
panel= LedPanel()
colorPredict = ColorPredict()

folder_name = 'raw_cloth'
filename='cloth'
    
panel.set_color_rgb('255 50 100')
camera.capture(folder_name,filename,0)
        
pc = PixelCounter(folder_name,filename)
print ("red, green, blue")
r,g,b = pc.averagePixels()

colo = colorPredict.predict(r,g,b)
print(colo)

time = datetime.datetime.now()
folder_name = 'line_cloth'
filename='line_'+ str(time)
panel.set_color_rgb(colo)
camera.capture(folder_name,filename,0)
        
pc = PixelCounter(folder_name,filename)
print ("red, green, blue")
r,g,b = pc.averagePixels()
colo = str(r)+' '+str(g)+' '+str(b)
print(colo)

