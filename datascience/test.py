import matplotlib.pyplot as plt
import numpy as np
import pymongo
from bson.objectid import ObjectId
from dotenv import dotenv_values

config = dotenv_values(".env")

# print("Welcome to ServPort")

# x = np.linspace(0, 20, 100)  # create a list of evenly-spaced numbers over the range
# plt.plot(x, np.sin(x))  # plot the sine of each x point
# plt.show()  # display the plot

client = pymongo.MongoClient(config["MONGO_URI"])
db = client.test

user = db.users.find_one({"_id": ObjectId("6075cdf02f197639f83de95e")})
print(user)
