import pprint
import time

import numpy as np
import pandas as pd
from bson.objectid import ObjectId
from dotenv import dotenv_values
from IPython.display import display
from pymongo import MongoClient
from scipy.spatial import distance
from sklearn.manifold import TSNE  # T-Distributed Stochastic Neighbor Embedding
from sklearn.preprocessing import StandardScaler  # used for feature scaling

config = dotenv_values(".env")


def get_service_vectors():
    # {
    #   ID: [AVG_PRICE, RATING, NUM_REVIEWS, NUM_VIEWS, NUM_INTERESTED, NUM_AVAILABILITY_PERIODS]
    #   ...
    # }

    client = MongoClient(config["MONGO_URI"])

    db = client.servport

    services = db.services

    service_vectors = {}

    for service in services.find().limit(100):
        service_vector = np.zeros([6], dtype="float")

        # AVG_PRICE
        service_vector[0] = float(
            (service["price"]["minPrice"] + service["price"]["maxPrice"]) / 2
        )

        # RATING
        service_vector[1] = float(service["rating"])

        # NUM_REVIEWS
        service_vector[2] = float(len(service["reviews"]))

        # NUM_VIEWS
        service_vector[3] = float(service["numViews"])

        # NUM_INTERESTED
        service_vector[4] = float(service["numInterested"])

        # NUM_AVAILABILITY_PERIODS
        service_vector[5] = float(len(service["availabilityPeriods"]))

        # ID
        service_vectors[str(service["_id"])] = service_vector

    client.close()

    return service_vectors


def get_service_vector(service_id):
    client = MongoClient(config["MONGO_URI"])
    db = client.servport

    service = db.services.find_one({"_id": ObjectId(service_id)})

    service_vector = np.zeros([6], dtype="float")

    # AVG_PRICE
    service_vector[0] = float(
        (service["price"]["minPrice"] + service["price"]["maxPrice"]) / 2
    )

    # RATING
    service_vector[1] = float(service["rating"])

    # NUM_REVIEWS
    service_vector[2] = float(len(service["reviews"]))

    # NUM_VIEWS
    service_vector[3] = float(service["numViews"])

    # NUM_INTERESTED
    service_vector[4] = float(service["numInterested"])

    # NUM_AVAILABILITY_PERIODS
    service_vector[5] = float(len(service["availabilityPeriods"]))

    client.close()

    return service_vector


def get_services_dataframe():
    client = MongoClient(config["MONGO_URI"])
    db = client.servport

    services = db.services

    services_df = pd.DataFrame(
        columns=[
            "Id",
            "AvgPrice",
            "Rating",
            "NumReviews",
            "NumViews",
            "NumInterested",
            "NumAvailabilityPeriods",
        ]
    )

    for service in services.find().limit(100):
        services_df = services_df.append(
            {
                "Id": str(service["_id"]),
                "AvgPrice": float(
                    (service["price"]["minPrice"] + service["price"]["maxPrice"]) / 2
                ),
                "Rating": float(service["rating"]),
                "NumReviews": float(len(service["reviews"])),
                "NumViews": float(service["numViews"]),
                "NumInterested": float(service["numInterested"]),
                "NumAvailabilityPeriods": float(len(service["availabilityPeriods"])),
            },
            ignore_index=True,
        )

    client.close()

    return services_df


def get_distance(x, centroids, distance_metric, minkowski_r=2):
    if distance_metric == "minkowski":
        return ((x - centroids) ** minkowski_r).sum(axis=centroids.ndim - 1) ** (
            1 / minkowski_r
        )
    elif distance_metric == "cosine":
        x = np.transpose(x[..., None])
        centroids = np.transpose(centroids)
        return np.squeeze(np.dot(x, centroids)) / (
            np.linalg.norm(x) * np.linalg.norm(centroids)
        )
    elif distance_metric == "pearson":
        x = x - np.average(x)
        x = np.transpose(x[..., None])
        centroids = centroids - centroids.mean(axis=1, keepdims=True)
        centroids = np.transpose(centroids)
        return np.squeeze(np.dot(x, centroids)) / (
            np.linalg.norm(x) * np.linalg.norm(centroids)
        )


def timer_decorator(function):
    # adds timer functionality to function (for how long did it run)
    def wrapper(*args, **kwargs):
        t_start = time.time()
        result = function(*args, **kwargs)
        t_end = time.time() - t_start
        print("{} ran for {} secs \n".format(function.__name__, t_end))
        return result

    return wrapper


def plot_data_t_sne():
    df = get_services_dataframe()
    df = df.drop("Id", axis=1)

    plotX = df
    plotX.columns = df.columns

    # set the perplexity
    perplexity = 50

    # T-SNE with two dimensions
    tsne_2d = TSNE(n_components=2, perplexity=perplexity)

    return 0


plot_data_t_sne()
