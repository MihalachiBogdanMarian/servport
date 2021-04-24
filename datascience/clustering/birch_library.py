import numpy as np
from sklearn.cluster import Birch

from clustering_utils import *


@timer_decorator
def birch_lib(data, k):
    brc = Birch(n_clusters=k)

    labels = brc.fit_predict(np.stack(data.values(), axis=0))

    i = 0
    for key in data:
        data[key] = np.append(data[key], labels[i])
        i += 1
    return data


# clustered_data = birch_lib(get_service_vectors(), k=3)
# print(len([x for x in clustered_data.values() if x[6] == 0.0]))
# print(len([x for x in clustered_data.values() if x[6] == 1.0]))
# print(len([x for x in clustered_data.values() if x[6] == 2.0]))
