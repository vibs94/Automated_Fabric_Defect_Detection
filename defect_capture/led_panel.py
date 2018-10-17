#defining the RPi's pins as Input / Output
import RPi.GPIO as GPIO

#importing the library for delaying command.
import time

class LedPanel:
    #defining the pins
    green = 20
    red = 22
    blue = 21
    uv = 23

    #used for GPIO numbering
    GPIO.setmode(GPIO.BCM)

    #closing the warnings when you are compiling the code
    GPIO.setwarnings(False)

    #defining the pins as output
    GPIO.setup(red, GPIO.OUT)
    GPIO.setup(green, GPIO.OUT)
    GPIO.setup(blue, GPIO.OUT)
    GPIO.setup(uv, GPIO.OUT)
    
    #choosing a frequency for pwm
    Freq = 200

    #defining the pins that are going to be used with PWM
    RED = GPIO.PWM(red, Freq)
    GREEN = GPIO.PWM(green, Freq)
    BLUE = GPIO.PWM(blue, Freq)
    UV = GPIO.PWM(uv, Freq)
    
    
    def __init__(self):
        LedPanel.RED.start(100)
        LedPanel.GREEN.start(1)
        LedPanel.BLUE.start(1)
        LedPanel.UV.start(100)
        
    def set_color_uv(self):
        LedPanel.UV.ChangeDutyCycle(0)
        LedPanel.GREEN.ChangeDutyCycle(100)
        LedPanel.RED.ChangeDutyCycle(100)
        LedPanel.BLUE.ChangeDutyCycle(100)

    def test(self):
        LedPanel.UV.ChangeDutyCycle(100)
        LedPanel.GREEN.ChangeDutyCycle(0)
        LedPanel.RED.ChangeDutyCycle(-1)
        LedPanel.BLUE.ChangeDutyCycle(0)
        
    def set_color_rgb(self, input_str):
        try:
            #turn of the uv liht
            LedPanel.UV.ChangeDutyCycle(100)
                
            duty_s_r, duty_s_g, duty_s_b = map(int, input_str.split())
            
            # Convert into Integer Value
            duty_r = float(duty_s_r)
            duty_g = float(duty_s_g)
            duty_b = float(duty_s_b)

            duty_r = ((255-duty_r)/255) * 100
            duty_g = ((255-duty_g)/255) * 100
            duty_b = ((255-duty_b)/255) * 100

            LedPanel.GREEN.ChangeDutyCycle(duty_g)
            LedPanel.RED.ChangeDutyCycle(duty_r)
            LedPanel.BLUE.ChangeDutyCycle(duty_b)
        except Exception as e:
            print ("Error Occurs, Exiting Program: "+str(e))

    def reset(self):
        # the purpose of this part is, when you interrupt the code,
        #it will stop the while loop and turn off the pins, which means your LED won't light anymore
        GPIO.cleanup()

        

