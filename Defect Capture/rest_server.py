from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from json import dumps
import threading
import time
from test_class import *
from check import *

app = Flask(__name__)
api = Api(app)
b = ""
t = Test()
c = Check(0)

class Start(Resource):
	def get(self):		
		if(c.isVal(0)):
			c.reverseVal()
			t.setup()
			b = threading.Thread(name='background', target=t.run)
			b.start()
			print('********************************** thread started *********************************')
			return {'status':'started'}
		else:
			return {'status':'already started'}

class Stop(Resource):
	def get(self):
		t.stop()
		c.reverseVal()
		return {'status':'stoped'}


api.add_resource(Start, '/start') # Route_1
api.add_resource(Stop, '/stop') # Route_2

if __name__ == '__main__':
     app.run(port='5001')