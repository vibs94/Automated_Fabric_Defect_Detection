Open anaconda prompt

Create a virtual environment using Anaconda:- conda create -n tensorflow_env python=x.x

Activate your virtual environment:- activate yourenvname

Go to the project folder :- cd "File path"

Install additional packages to a virtual environment:- pip install tensorflow

pip install keras

Train the model:- 
python train.py --dataset dataset --model fashion.model --labelbin mlb.pickle

Predict by the model:- 
python classify.py --model fashion.model --labelbin mlb.pickle --image examples/1.jpg