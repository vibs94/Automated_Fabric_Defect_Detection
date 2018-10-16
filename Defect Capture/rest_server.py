from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from json import dumps
import threading
import time
from process import *
from check import *

app = Flask(__name__)
api = Api(app)
thread = ""
process = Process()
check = Check(0)

class Start(Resource):
	def get(self):		
		if(check.isVal(0)):
			check.reverseVal()
			process.setup()
			thread = threading.Thread(name='background', target=process.run)
			thread.start()
			print('********************************** thread started *********************************')
			return {'status':'started'}
		else:
			return {'status':'already started'}

class Stop(Resource):
	def get(self):
		process.stop()
		check.reverseVal()
		return {'status':'stoped'}


api.add_resource(Start, '/start') # Route_1
api.add_resource(Stop, '/stop') # Route_2

if __name__ == '__main__':
     app.run(port='5001')