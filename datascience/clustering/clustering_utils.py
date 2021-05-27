import os
import pprint
import random
import sys
import time

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import plotly.graph_objs as go
import plotly.io as pio
import seaborn as sns
from bson.objectid import ObjectId
from dotenv import dotenv_values
from IPython.display import display
from kneed import KneeLocator
from plotly.offline import iplot
from pymongo import MongoClient
from scipy.spatial import distance
from sklearn.manifold import TSNE  # T-Distributed Stochastic Neighbor Embedding
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler  # used for feature scaling

config = dotenv_values(".env")


def timer_decorator(function):
    # adds timer functionality to function (for how long did it run)
    def wrapper(*args, **kwargs):
        t_start = time.time()
        result = function(*args, **kwargs)
        t_end = time.time() - t_start
        print("{} ran for {} secs \n".format(function.__name__, t_end))
        return result

    return wrapper


def get_service_vectors(with_clusters=False):
    # turn all services into feature vectors and store them in a dict with the service ids as keys
    # {
    #   ID: [AVG_PRICE, RATING, NUM_REVIEWS, NUM_VIEWS, NUM_INTERESTED, NUM_AVAILABILITY_PERIODS]
    #   ...
    # }

    client = MongoClient(config["MONGO_URI"])

    db = client.servport

    services = db.services

    service_vectors = {}

    for service in services.find():
        if not with_clusters:
            service_vector = np.zeros([5], dtype="float")
        else:
            service_vector = np.zeros([7], dtype="float")

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

        if with_clusters:
            if "cluster" in service:
                service_vector[5] = service["cluster"]

        # ID
        service_vectors[str(service["_id"])] = service_vector

    client.close()

    return service_vectors


def get_service_vector(service_id):
    # get feature vector for one particular service given by id

    client = MongoClient(config["MONGO_URI"])
    db = client.servport

    service = db.services.find_one({"_id": ObjectId(service_id)})

    service_vector = np.zeros([5], dtype="float")

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

    client.close()

    return service_vector


def get_services_dataframe(with_clusters=False):
    # get data points in the form of pandas dataframe

    client = MongoClient(config["MONGO_URI"])
    db = client.servport

    services = db.services

    services_df = None
    if not with_clusters:
        services_df = pd.DataFrame(
            columns=[
                "Id",
                "AvgPrice",
                "Rating",
                "NumReviews",
                "NumViews",
                "NumInterested",
            ]
        )
    else:
        services_df = pd.DataFrame(
            columns=[
                "Id",
                "AvgPrice",
                "Rating",
                "NumReviews",
                "NumViews",
                "NumInterested",
                "Cluster",
            ]
        )

    for service in services.find():
        if not with_clusters:
            services_df = services_df.append(
                {
                    "Id": str(service["_id"]),
                    "AvgPrice": float(
                        (service["price"]["minPrice"] + service["price"]["maxPrice"])
                        / 2
                    ),
                    "Rating": float(service["rating"]),
                    "NumReviews": float(len(service["reviews"])),
                    "NumViews": float(service["numViews"]),
                    "NumInterested": float(service["numInterested"]),
                },
                ignore_index=True,
            )
        else:
            if "cluster" in service:
                services_df = services_df.append(
                    {
                        "Id": str(service["_id"]),
                        "AvgPrice": float(
                            (
                                service["price"]["minPrice"]
                                + service["price"]["maxPrice"]
                            )
                            / 2
                        ),
                        "Rating": float(service["rating"]),
                        "NumReviews": float(len(service["reviews"])),
                        "NumViews": float(service["numViews"]),
                        "NumInterested": float(service["numInterested"]),
                        "Cluster": float(service["cluster"]),
                    },
                    ignore_index=True,
                )

    client.close()

    return services_df


def turn_clustered_data_into_dataframe(clustered_data):
    services_df = pd.DataFrame(
        columns=[
            "Id",
            "AvgPrice",
            "Rating",
            "NumReviews",
            "NumViews",
            "NumInterested",
        ]
    )

    for service_id, clustered_feature_vector in clustered_data.items():
        services_df = services_df.append(
            {
                "Id": service_id,
                "AvgPrice": clustered_feature_vector[0],
                "Rating": clustered_feature_vector[1],
                "NumReviews": clustered_feature_vector[2],
                "NumViews": clustered_feature_vector[3],
                "NumInterested": clustered_feature_vector[4],
                "Cluster": clustered_feature_vector[5],
            },
            ignore_index=True,
        )

    return services_df


def compute_distance(X, centroids, distance_metric, minkowski_r=2):
    # similarity measures
    if distance_metric == "minkowski":
        return ((X - centroids) ** minkowski_r).sum(axis=X.ndim - 1) ** (
            1 / minkowski_r
        )
    elif distance_metric == "cosine":
        X = np.transpose(X[..., None])
        centroids = np.transpose(centroids)
        return np.squeeze(np.dot(X, centroids)) / (
            np.linalg.norm(X) * np.linalg.norm(centroids)
        )
    elif distance_metric == "pearson":
        X = X - np.average(X)
        X = np.transpose(X[..., None])
        centroids = centroids - centroids.mean(axis=1, keepdims=True)
        centroids = np.transpose(centroids)
        return np.squeeze(np.dot(X, centroids)) / (
            np.linalg.norm(X) * np.linalg.norm(centroids)
        )


def plot_separate_clustered_attributes(clustered_data):
    service_vectors_clustered = np.stack(clustered_data.values(), axis=0)
    titles = {
        0: "average price",
        1: "rating",
        2: "num. of reviews",
        3: "num. of views",
        4: "num. of interested",
    }
    clusters = [int(service_vector[5]) for service_vector in service_vectors_clustered]

    val = 0.0

    # _, axs = plt.subplots(nrows=2, ncols=3, constrained_layout=True)
    # i = 0
    # for ax in axs.flat:
    #     scatter = ax.scatter(
    #         service_vectors_clustered[:, i],
    #         np.zeros_like(service_vectors_clustered[:, i]) + val,
    #         c=clusters,
    #     )
    #     ax.set_xlabel("value", fontsize=8)
    #     ax.set_title(titles[i], fontsize=10)

    #     legend = ax.legend(
    #         *scatter.legend_elements(), loc="upper left", title="Clusters"
    #     )
    #     ax.add_artist(legend)

    #     i += 1

    # plt.show()

    for i in range(0, 5):
        _, ax = plt.subplots()
        scatter = ax.scatter(
            service_vectors_clustered[:, i],
            np.zeros_like(service_vectors_clustered[:, i]) + val,
            c=clusters,
        )
        ax.set_xlabel("value", fontsize=8)
        ax.set_title(titles[i], fontsize=10)

        legend = ax.legend(
            *scatter.legend_elements(), loc="upper left", title="Clusters"
        )
        ax.add_artist(legend)

        plt.show()


def plot_data_t_sne(clustered_dataframe, verbose=1, perplexity=50, n_iter=300):
    df = clustered_dataframe.drop("Id", axis=1)

    # T-SNE with two dimensions
    tsne_2d = TSNE(
        n_components=2, verbose=verbose, perplexity=perplexity, n_iter=n_iter
    )
    # the two dimensions values, built by T-SNE
    tsne_2d_results = pd.DataFrame(tsne_2d.fit_transform(df.drop("Cluster", axis=1)))
    tsne_2d_results.columns = ["TSNE_2D_one", "TSNE_2D_two"]

    df = pd.concat([df, tsne_2d_results], axis=1, join="inner")

    plotting_data = []

    for cluster_index in df["Cluster"].unique():
        cluster = df[df["Cluster"] == cluster_index]

        r = random.randint(0, 255)
        g = random.randint(0, 255)
        b = random.randint(0, 255)

        trace = go.Scatter(
            x=cluster["TSNE_2D_one"],
            y=cluster["TSNE_2D_two"],
            mode="markers",
            name="cluster " + str(int(cluster_index)),
            marker=dict(
                line=dict(
                    color="rgba(" + str(r) + "," + str(g) + "," + str(b) + ",0.8)",
                    width=10,
                )
            ),
            text=None,
        )

        plotting_data.append(trace)

    title = (
        "visualizing clusters in 2 dimensions using T-SNE (perplexity = "
        + str(perplexity)
        + ")"
    )

    layout = dict(
        title=title,
        xaxis=dict(title="TSNE_2D_one", ticklen=5, zeroline=False),
        yaxis=dict(title="TSNE_2D_two", ticklen=5, zeroline=False),
    )

    fig = go.Figure(data=plotting_data, layout=layout)

    fig.write_html(os.path.join(sys.path[0], "t_sne.html"), auto_open=True)


# labels assigned to each cluster/service due to previous manual observations/analysis
def clusters_to_labels(k):
    clusters_to_labels = {
        0: {"price": "small", "rating": "small", "numReviews": "small"},
        1: {"price": "medium", "rating": "small", "numReviews": "small"},
        2: {"price": "large", "rating": "small", "numReviews": "medium"},
        3: {"price": "small", "rating": "medium", "numReviews": "small"},
        4: {"price": "medium", "rating": "medium", "numReviews": "large"},
        5: {"price": "large", "rating": "medium", "numReviews": "small"},
        6: {"price": "small", "rating": "large", "numReviews": "medium"},
        7: {"price": "medium", "rating": "large", "numReviews": "medium"},
        8: {"price": "large", "rating": "large", "numReviews": "large"},
        9: {"price": "large", "rating": "large", "numReviews": "large"},
        10: {},
        11: {},
        12: {},
        13: {},
        14: {},
        15: {},
        16: {},
        17: {},
        18: {},
        19: {},
        20: {},
        21: {},
        22: {},
        23: {},
        24: {},
        25: {},
        26: {},
        27: {},
        28: {},
        29: {},
        30: {},
        31: {},
        32: {},
        33: {},
        34: {},
        35: {},
        36: {},
        37: {},
        38: {},
        39: {},
        40: {},
        41: {},
        42: {},
        43: {},
        44: {},
        45: {},
        46: {},
        47: {},
        48: {},
        49: {},
    }

    # clusters_to_labels = {}
    # for i in range(0, k):
    #     clusters_to_labels[i] = {"label": "label " + str(i)}

    return clusters_to_labels
