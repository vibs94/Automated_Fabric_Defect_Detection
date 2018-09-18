from avg_rgb import *
from led_panel import *
from camera import *

camera=Camera()
panel= LedPanel()

filename='cloth'
    
panel.set_color_rgb('255 50 100')
camera.capture(filename,1)
        
pc = PixelCounter(filename)
print ("red, green, blue")
r,g,b = pc.averagePixels()
colo = str(r)+' '+str(g)+' '+str(b)
print(colo)


filename='cloth_to_extr'
    
panel.set_color_rgb(colo)
camera.capture(filename,1)
        
pc = PixelCounter(filename)
print ("red, green, blue")
r,g,b = pc.averagePixels()
colo = str(r)+' '+str(g)+' '+str(b)
print(colo)

