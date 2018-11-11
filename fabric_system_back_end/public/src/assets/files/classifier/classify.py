# USAGE
# python classify.py --image examples/1.jpg

# import the necessary packages
import os
import sys
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
from keras.preprocessing.image import img_to_array
from keras.models import load_model
sys.stderr = stderr
import numpy as np
import argparse
import imutils
import pickle
import cv2
import os
import json


# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
# ap.add_argument("-m", "--model", required=False,
# 	help="path to trained model model")
# ap.add_argument("-l", "--labelbin", required=False,
# 	help="path to label binarizer")
ap.add_argument("-i", "--image", required=True,
	help="path to input image")
args = vars(ap.parse_args())

# load the image
image = cv2.imread(args["image"])
output = imutils.resize(image, width=400)

# pre-process the image for classification
image = cv2.resize(image, (96, 96))
image = image.astype("float") / 255.0
image = img_to_array(image)
image = np.expand_dims(image, axis=0)

# load the trained convolutional neural network and the multi-label
# binarizer
#print("[INFO] loading network...")

# file_origin = "C:/Users/Administrator/Desktop/Final FYP Project Files [LocalHost]/Automated_Fabric_Defect_Detection/fabric_system_back_end/public/src/assets/files/classifier/"
file_origin = "G:/Final Year Project Development/Embedded_Device/Automated_Fabric_Defect_Detection/fabric_system_back_end/public/src/assets/files/classifier/"

model = load_model(file_origin + "fabric.model")
mlb = pickle.loads(open(file_origin + "mlb.pickle", "rb").read())

# classify the input image then find the indexes of the two class
# labels with the *largest* probability
#print("[INFO] classifying image...")
proba = model.predict(image)[0]
#print(proba)
idxs = np.argsort(proba)[::-1][:2]

# loop over the indexes of the high confidence class labels
# for (i, j) in enumerate(idxs):
# 	if(proba[j] * 100>50):
# 	# build the label and draw the label on the image
# 		label = "{}: {:.2f}%".format(mlb.classes_[j], proba[j] * 100)
# 		cv2.putText(output, label, (10, (i * 30) + 25), 
# 			cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

# show the probabilities for each of the individual labels
data = {}
for (label, p) in zip(mlb.classes_, proba):
	data[label] = p*100
	#print("{}: {:.2f}%".format(label, p * 100))
json_data = json.dumps(data)
print(json_data)

# show the output image
# cv2.imshow("Output", output)
# cv2.waitKey(0)