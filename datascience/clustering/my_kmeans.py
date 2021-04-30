import random

from clustering_utils import *


@timer_decorator
def my_kmeans(data, k, similarity_measure="minkowski", minkowski_r=2):
    def get_closest_centroids(X, centroids, similarity_measure="minkowski", minkowski_r=2):
        # get distances between the data point and all centroids
        dist = compute_distance(X, centroids, similarity_measure, minkowski_r=minkowski_r)

        # get the index of the centroid with the smallest distance to the data point
        closest_centroid_index = np.argmin(dist, axis=1)

        return closest_centroid_index

    def compute_sse(
        data, centroids, assigned_centroids, similarity_measure="minkowski", minkowski_r=2
    ):
        # initialise Sum of Squared Errors
        sse = 0

        # compute sse
        sse = compute_distance(
            data, centroids[assigned_centroids], similarity_measure, minkowski_r=minkowski_r
        ).sum() / len(data)

        return sse

    # turn data dictionary into array of feature vectors
    data_vectors = np.stack(data.values(), axis=0)

    # initialise centroids (k different values from the dataset)
    centroids = data_vectors[random.sample(range(data_vectors.shape[0]), k)]

    # list storing the centroid assigned to each data point
    assigned_centroids = np.zeros(len(data_vectors), dtype=np.float64)

    # list storing sse for each iteration
    sse_list = [-1]

    # main loop (iterations)
    while True:
        # get closest centroids to each data point
        assigned_centroids = get_closest_centroids(
            data_vectors[:, None, :], centroids[None, :, :], similarity_measure=similarity_measure, minkowski_r=minkowski_r
        )

        # compute new centroids
        for c in range(centroids.shape[0]):
            # get data points belonging to each cluster
            cluster_members = data_vectors[assigned_centroids == c]

            # compute the mean of the clusters
            cluster_members = cluster_members.mean(axis=0)

            # update the centroids
            centroids[c] = cluster_members

        # compute sse
        sse = compute_sse(
            data_vectors.squeeze(), centroids.squeeze(), assigned_centroids, similarity_measure=similarity_measure, minkowski_r=minkowski_r
        )
        sse_list.append(sse)

        # if sse values stop changing, then the centroids doesn't change their position anymore
        # and we can consider convergence was achieved and consequently break the main loop
        if sse_list[len(sse_list) - 1] == sse_list[len(sse_list) - 2]:
            break

    # complete the data with the cluster labels assigned
    i = 0
    for key in data:
        data[key] = np.append(data[key], assigned_centroids[i])
        i += 1

    # return the data with the assigned clusters, the assigned centroids separately and the last sse value
    return data, assigned_centroids, sse_list[len(sse_list) - 1]


# clustered_data, _, _ = my_kmeans(get_service_vectors(), k=3)
# print(len([x for x in clustered_data.values() if x[6] == 0.0]))
# print(len([x for x in clustered_data.values() if x[6] == 1.0]))
# print(len([x for x in clustered_data.values() if x[6] == 2.0]))
