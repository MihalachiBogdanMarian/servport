import random

import seaborn as sb

from clustering_utils import *


@timer_decorator
def my_k_means(data, k, cluster_cols=None):
    # extract the columns which enters clustering
    df = data.copy() if cluster_cols is None else data[cluster_cols].copy()
    df = df.drop("Id", axis=1)
    # extract values
    X = df.values
    # number of points
    rows = len(X)
    # number of columns
    dim = len(df.values[0])

    attempt = 0
    max_delta = 1
    old_delta = None

    # distances between a point and all the centers
    dists = np.ones(k)

    # initialize seeds and seed logs
    raw_seeds = np.array(
        [[random.random() for i in range(dim)] for centers in range(k)]
    )
    seeds = pd.DataFrame(data=raw_seeds, columns=df.columns)
    seed_log = seeds.assign(attempt=attempt, max_delta=1)
    print("initial_centers: ")
    print(seed_log)
    df["Cluster"] = -1

    # primary loop
    while max_delta != old_delta:
        old_delta = max_delta
        # for each point
        for i in range(rows):
            # assign a cluster - the one with its centroid the closest to the testing point
            dists = [
                get_distance(np.array(X[i]), np.array(seed), "minkowski", minkowski_r=2)
                for seed in seeds.values
            ]
            cluster_index = dists.index(min(dists))
            df.loc[i, "Cluster"] = cluster_index

        # compute new centroids of each cluster
        new_seeds = df.groupby("Cluster").mean()

        deltas = seeds.subtract(new_seeds).abs().fillna(1)

        max_delta = get_distance(
            np.array(deltas.max()), np.zeros(dim), "minkowski", minkowski_r=2
        )
        print("max_delta: ", max_delta)

        # fix unused seeds
        new_seeds = new_seeds.reindex(deltas.index)
        new_seeds[new_seeds.isnull()] = random.random()
        seed_log = seed_log.append(
            new_seeds.assign(attempt=attempt + 1, max_delta=max_delta)
        )
        seeds = new_seeds.copy()

    df["Id"] = data["Id"]
    return df


clustered_data = my_k_means(get_services_dataframe(), k=3)
print(clustered_data)
print(clustered_data.groupby(["Cluster"]).agg(["count"]))
