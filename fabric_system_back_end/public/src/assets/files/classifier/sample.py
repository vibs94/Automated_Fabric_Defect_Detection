import sys
import json

message = "Output from Python"
first_name = sys.argv[1]
second_name = sys.argv[2]

data = {"message": message, "first_name": first_name, "second_name": second_name}
json_data = json.dumps(data)

print(json_data)

