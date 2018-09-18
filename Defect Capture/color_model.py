import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
from sklearn.preprocessing import Imputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.neighbors import KNeighborsRegressor

file = pd.read_csv(r'C:\Users\vibodha\Downloads\results.txt',header=None)
file.columns = ['real','visible']

_visible = []
visible = file.visible.to_string(index=False).strip().split('\n')
for i in visible:
    i =  i.strip().split(' ')
    ints = []
    for j in i:
        ints.append(int(j))
    _visible.append(ints)
#print(_visible)
visible_data = pd.DataFrame(_visible)
visible_data.columns = ['r','g','b']

_real = []
r = []
g = []
b = []
real = file.real.to_string(index=False).strip().split('\n')
for i in real:
    i =  i.strip().split(' ')
    ints = []
    for j in i:
        ints.append(int(j))
    r.append(ints[0])
    g.append(ints[1])
    b.append(ints[2])
    _real.append(ints)
real_data = pd.DataFrame(_real)
r_data = pd.DataFrame(r)
r_data.columns = ['r']
g_data = pd.DataFrame(g)
g_data.columns = ['g']
b_data = pd.DataFrame(b)
b_data.columns = ['b']
real_data.columns = ['r','g','b']

r_model = RandomForestRegressor(n_estimators=50,criterion='mae',max_depth=6,warm_start=True)
x_r, val_x_r, y_r, val_y_r = train_test_split(visible_data, r_data, test_size=0.1, random_state=0, shuffle=False)
r_model.fit(x_r, y_r)
pred_val_r = r_model.predict(val_x_r)
print("MAE : " + str(mean_absolute_error(val_y_r, pred_val_r)))

g_model = RandomForestRegressor(n_estimators=100,criterion='mae',max_depth=6,warm_start=True)
x_g, val_x_g, y_g, val_y_g = train_test_split(visible_data, g_data, test_size=0.1, random_state=0, shuffle=False)
g_model.fit(x_g, y_g)
pred_val_g = g_model.predict(val_x_g)
print("MAE : " + str(mean_absolute_error(val_y_g, pred_val_g)))

b_model = KNeighborsRegressor()
x_b, val_x_b, y_b, val_y_b = train_test_split(visible_data, b_data, test_size=0.1, random_state=0, shuffle=False)
b_model.fit(x_b, y_b)
pred_val_b = b_model.predict(val_x_b)
print("MAE : " + str(mean_absolute_error(val_y_b, pred_val_b)))

import joblib
joblib.dump(r_model, open("r_model", 'wb'))
joblib.dump(g_model, open("g_model", 'wb'))
joblib.dump(b_model, open("b_model", 'wb'))
###########################
loaded_model_r = joblib.load(open("r_model", 'rb'))
loaded_model_g = joblib.load(open("g_model", 'rb'))
loaded_model_b = joblib.load(open("b_model", 'rb'))
test = [[200,200,200]]
test_df = pd.DataFrame(test)
test_df.columns = ['r','g','b']
pred_r = loaded_model_r.predict(test_df)
pred_g = loaded_model_g.predict(test_df)
pred_b = loaded_model_b.predict(test_df)
# print(pred_r)
# print(pred_g)
# print(pred_b)
red = pred_r[0]
green = pred_g[0]
blue = pred_b[0][0]
color = [red,green,blue]
print(color)