import pprint

import matplotlib.pyplot as plt
import numpy as np
from bson.objectid import ObjectId
from dotenv import dotenv_values
from pymongo import MongoClient

config = dotenv_values(".env")

# print("Welcome to ServPort")

# x = np.linspace(0, 20, 100)  # create a list of evenly-spaced numbers over the range
# plt.plot(x, np.sin(x))  # plot the sine of each x point
# plt.show()  # display the plot

client = MongoClient(config["MONGO_URI"])
db = client.servport

user = db.users.find_one({"_id": ObjectId("6075cdf02f197639f83de95e")})
pprint.pprint(user)

client.close()
