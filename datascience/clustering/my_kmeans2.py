import random

import matplotlib.pyplot as plt
from kneed import KneeLocator
from sklearn.metrics import silhouette_score

from clustering_utils import *


@timer_decorator
def my_k_means(data_cl, k):
    def get_closest_centroid(x, centroids):
        # loop over each centroid and compute the distance from data point
        dist = get_distance(x, centroids, "minkowski", minkowski_r=2)

        # get the index of the centroid with the smallest distance to the data point
        closest_centroid_index = np.argmin(dist, axis=1)

        return closest_centroid_index

    def compute_sse(data, centroids, assigned_centroids):
        # initialise SSE
        sse = 0

        # compute SSE
        sse = get_distance(
            data, centroids[assigned_centroids], "minkowski", minkowski_r=2
        ).sum() / len(data)

        return sse

    data = np.stack(data_cl.values(), axis=0)

    # shuffle the data
    np.random.shuffle(data)

    # initialise centroids
    centroids = data[random.sample(range(data.shape[0]), k)]

    # create a list to store which centroid is assigned to each dataset
    assigned_centroids = np.zeros(len(data), dtype=np.float64)

    # list to store SSE for each iteration
    sse_list = []

    # main loop
    while True:
        # get closest centroids to each data point
        assigned_centroids = get_closest_centroid(
            data[:, None, :], centroids[None, :, :]
        )

        # compute new centroids
        for c in range(centroids.shape[0]):
            # get data points belonging to each cluster
            cluster_members = data[assigned_centroids == c]

            # compute the mean of the clusters
            cluster_members = cluster_members.mean(axis=0)

            # update the centroids
            centroids[c] = cluster_members

        # compute SSE
        sse = compute_sse(data.squeeze(), centroids.squeeze(), assigned_centroids)
        sse_list.append(sse)

        if sse_list[len(sse_list) - 1] == sse_list[len(sse_list) - 2]:
            break

    i = 0
    for key in data_cl:
        data_cl[key] = np.append(data_cl[key], assigned_centroids[i])
        i += 1
    return data_cl, assigned_centroids, sse_list[len(sse_list) - 1]


def find_best_k_elbow_method():
    service_vectors = get_service_vectors()
    sse = []
    for k in range(2, 11):
        _, _, sse_value = my_k_means(service_vectors, k)
        sse.append(sse_value)

    plt.style.use("fivethirtyeight")
    plt.plot(range(2, 11), sse)
    plt.xticks(range(2, 11))
    plt.xlabel("Number of Clusters")
    plt.ylabel("SSE")
    plt.show()

    kl = KneeLocator(range(2, 11), sse, curve="convex", direction="decreasing")

    return kl.elbow


def find_best_k_silhouette_coefficient():
    service_vectors = get_service_vectors()
    service_vectors_arrays = np.stack(service_vectors.values(), axis=0)
    silhouette_coefficients = []

    for k in range(2, 11):
        _, assigned_centroids, _ = my_k_means(service_vectors, k)
        score = silhouette_score(service_vectors_arrays, assigned_centroids)
        silhouette_coefficients.append(score)

    plt.style.use("fivethirtyeight")
    plt.plot(range(2, 11), silhouette_coefficients)
    plt.xticks(range(2, 11))
    plt.xlabel("Number of Clusters")
    plt.ylabel("Silhouette Coefficient")
    plt.show()


# clustered_data = my_k_means(get_service_vectors(), k=3)
# print(len([x for x in clustered_data.values() if x[6] == 0.0]))
# print(len([x for x in clustered_data.values() if x[6] == 1.0]))
# print(len([x for x in clustered_data.values() if x[6] == 2.0]))

print(find_best_k_elbow_method())
# find_best_k_silhouette_coefficient()
