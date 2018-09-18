from pandas import *
import pickle


class ColorPredict:
    loaded_model_r = ''
    loaded_model_g = ''
    loaded_model_b = ''

    def __init__(self):
        ColorPredict.loaded_model_r = pickle.load(open("models/r_model", 'rb'))
        #ColorPredict.loaded_model_g = pickle.load(open("models/g_model.jpg", 'rb'))
        #ColorPredict.loaded_model_b = pickle.load(open("models/b_model.jpg", 'rb'))
        pass
    def predict(self, r, g, b):
        #visible_color = [[200, 200, 200]]
        #visible_color_df = pd.DataFrame(visible_color)
        #visible_color_df.columns = ['r', 'g', 'b']
        #pred_r = ColorPredict.loaded_model_r.predict(visible_color_df)
        #pred_g = ColorPredict.loaded_model_g.predict(visible_color_df)
        #pred_b = ColorPredict.loaded_model_b.predict(visible_color_df)

        #red = int(pred_r[0])
        #green = int(pred_g[0])
        #blue = int(pred_b[0][0])
        #color = str(red) + ' ' + str(green) + ' ' + str(blue)
        #print(color)
        #return
        pass
