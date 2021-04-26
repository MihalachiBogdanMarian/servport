import sys

import numpy as np

from clustering_utils import *
from my_kmeans import *


@timer_decorator
def knn(clustered_data, new_service_id, k):
    service_vectors_clustered = np.stack(clustered_data.values(), axis=0)
    service_vectors = np.delete(service_vectors_clustered, -1, axis=1)
    clusters = [service_vector[6] for service_vector in service_vectors_clustered]

    distances = get_distance(
        get_service_vector(new_service_id), service_vectors, "minkowski", minkowski_r=2
    )
    nearest_neighbor_ids = distances.argsort()[:k]
    nearest_neighbor_clusters = [clusters[id] for id in nearest_neighbor_ids]

    cluster_to_be_assigned = max(
        set(nearest_neighbor_clusters), key=nearest_neighbor_clusters.count
    )

    client = MongoClient(config["MONGO_URI"])

    db = client.servport

    services = db.services

    # assign the cluster/centroid index and the corresponding labels to the new service
    services.find_one_and_update(
        {"_id": ObjectId(new_service_id)},
        {
            "$unset": {
                "cluster": cluster_to_be_assigned,
                "labels": clusters_to_labels[int(cluster_to_be_assigned)],
            }
        },
    )

    client.close()


# "60841adf5a226330888f7070"
knn(
    get_service_vectors(with_clusters=True),
    sys.argv[1],
    10,
)
