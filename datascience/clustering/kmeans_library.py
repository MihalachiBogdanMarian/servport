import numpy as np
from sklearn.cluster import MiniBatchKMeans

from clustering_utils import *


@timer_decorator
def kmeans_lib(data, k, batch_size=10, max_iter=10):
    kmeans = MiniBatchKMeans(n_clusters=k, batch_size=batch_size, max_iter=max_iter)

    labels = kmeans.fit_predict(np.stack(data.values(), axis=0))

    i = 0
    for key in data:
        data[key] = np.append(data[key], labels[i])
        i += 1
    return data, labels, kmeans.inertia_


# clustered_data, _, _ = kmeans_lib(get_service_vectors(), k=3)
# print(len([x for x in clustered_data.values() if x[6] == 0.0]))
# print(len([x for x in clustered_data.values() if x[6] == 1.0]))
# print(len([x for x in clustered_data.values() if x[6] == 2.0]))
