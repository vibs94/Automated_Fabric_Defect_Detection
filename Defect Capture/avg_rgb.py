from PIL import Image

class PixelCounter(object):
  ''' loop through each pixel and average rgb '''
  def __init__(self, imageName):
      self.pic = Image.open('/home/pi/Desktop/Scripts/images/'+ imageName+'.jpg')
      # load image data
      self.imgData = self.pic.load()
  def averagePixels(self):
      r, g, b = 0, 0, 0
      count = 0
      x_length = self.pic.size[0]
      y_length = self.pic.size[1]
      for x in range(int(x_length/4),int(3*x_length/4)):
          for y in range(int(y_length/4),int(3*y_length/4)):
              tempr,tempg,tempb = self.imgData[x,y]
              r += tempr
              g += tempg
              b += tempb
              count += 1
      # calculate averages
      return int(r/count), int(g/count), int(b/count)

