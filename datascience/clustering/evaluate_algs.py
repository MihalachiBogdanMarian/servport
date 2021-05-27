import numpy as np

from birch_library import *
from clustering_utils import *
from kmeans_library import *
from vectorized_kmeans import *


def find_best_k_elbow_method(
    service_vectors,
    algorithm,
    min_k,
    max_k,
    similarity_measure="minkowski",
    minkowski_r=2,
):
    sse = []
    for k in range(min_k, max_k):
        sse_value = None
        if algorithm == "kmeans_lib":
            _, _, sse_value = kmeans_lib(service_vectors, k)
        else:
            _, _, sse_value = vectorized_kmeans(
                service_vectors,
                k,
                similarity_measure=similarity_measure,
                minkowski_r=minkowski_r,
            )
        sse.append(sse_value)

    plt.style.use("fivethirtyeight")
    plt.plot(range(min_k, max_k), sse)
    plt.xticks(range(min_k, max_k))
    plt.xlabel("Number of Clusters")
    plt.ylabel("SSE")
    plt.show()

    kl = KneeLocator(range(min_k, max_k), sse, curve="convex", direction="decreasing")

    return kl.elbow


def find_best_k_silhouette_coefficient(
    service_vectors,
    algorithm,
    min_k,
    max_k,
    similarity_measure="minkowski",
    minkowski_r=2,
):
    service_vectors_arrays = np.stack(service_vectors.values(), axis=0)
    silhouette_coefficients = []

    for k in range(min_k, max_k):
        if algorithm == "kmeans_lib":
            _, assigned_centroids, _ = kmeans_lib(service_vectors, k)
        elif algorithm == "birch_lib":
            _, assigned_centroids = birch_lib(service_vectors, k)
        else:
            _, assigned_centroids, _ = vectorized_kmeans(
                service_vectors,
                k,
                similarity_measure=similarity_measure,
                minkowski_r=minkowski_r,
            )

        score = silhouette_score(service_vectors_arrays, assigned_centroids)
        silhouette_coefficients.append(score)

    plt.style.use("fivethirtyeight")
    plt.plot(range(min_k, max_k), silhouette_coefficients)
    plt.xticks(range(min_k, max_k))
    plt.xlabel("Number of Clusters")
    plt.ylabel("Silhouette Coefficient")
    plt.show()

    return silhouette_coefficients.index(max(silhouette_coefficients)) + min_k


def assign_labels_to_clusters_and_store_info_in_database(clustered_data, clusters):
    client = MongoClient(config["MONGO_URI"])

    db = client.servport

    services = db.services

    i = 0
    # for each service, assign its cluster/centroid index and the corresponding labels
    for service_id, clustered_feature_vector in clustered_data.items():
        services.find_one_and_update(
            {"_id": ObjectId(service_id)},
            {
                "$set": {
                    "cluster": clustered_feature_vector[5],
                    "labels": clusters_to_labels(len(set(clusters)))[
                        int(clustered_feature_vector[5])
                    ],
                }
            },
        )
        i += 1

    client.close()


# print(find_best_k_elbow_method("kmeans_lib", 2, 11))
# print(find_best_k_silhouette_coefficient("birch_lib", 2, 11))

# data, clusters, _ = vectorized_kmeans(
#     get_service_vectors(),
#     find_best_k_elbow_method(get_service_vectors(), "vectorized_kmeans", 2, 11),
# )
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
