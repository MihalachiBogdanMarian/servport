import json

from evaluate_algs import *

# ELBOW METHOD


# data, clusters, _ = vectorized_kmeans(
#     get_service_vectors(),
#     find_best_k_elbow_method(get_service_vectors(), "vectorized_kmeans", 2, 11),
#     "minkowski",
# )
# print("num. of clusters: " + str(len(set(clusters))))
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
# plot_data_t_sne(get_services_dataframe(with_clusters=True))
# plot_separate_clustered_attributes(get_service_vectors(with_clusters=True))


# data, clusters, _ = kmeans_lib(
#     get_service_vectors(),
#     find_best_k_elbow_method(get_service_vectors(), "kmeans_lib", 2, 11),
# )
# print("num. of clusters: " + str(len(set(clusters))))
# data_serialized = np.save('temp_data.npy', data)
# clusters_serialized = np.save('temp_clusters.npy', clusters)
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
# plot_data_t_sne(get_services_dataframe(with_clusters=True))
# plot_separate_clustered_attributes(get_service_vectors(with_clusters=True))

data = np.load('temp_data.npy', allow_pickle=True)
clusters = np.load('temp_clusters.npy', allow_pickle=True)
assign_labels_to_clusters_and_store_info_in_database(data[()], clusters)


# data, clusters = birch_lib(
#     get_service_vectors(),
#     find_best_k_elbow_method(get_service_vectors(), "kmeans_lib", 2, 11),
# )
# print("num. of clusters: " + str(len(set(clusters))))
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
# plot_data_t_sne(get_services_dataframe(with_clusters=True))
# plot_separate_clustered_attributes(get_service_vectors(with_clusters=True))


# SILHOUETTE COEFFICIENT


# data, clusters, _ = vectorized_kmeans(
#     get_service_vectors(),
#     find_best_k_silhouette_coefficient(
#         get_service_vectors(), "vectorized_kmeans", 4, 11
#     ),
# )
# print("num. of clusters: " + str(len(set(clusters))))
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
# plot_data_t_sne(get_services_dataframe(with_clusters=True))
# plot_separate_clustered_attributes(get_service_vectors(with_clusters=True))


# data, clusters, _ = kmeans_lib(
#     get_service_vectors(),
#     find_best_k_silhouette_coefficient(get_service_vectors(), "kmeans_lib", 4, 11),
# )
# print("num. of clusters: " + str(len(set(clusters))))
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
# plot_data_t_sne(get_services_dataframe(with_clusters=True))
# plot_separate_clustered_attributes(get_service_vectors(with_clusters=True))


# data, clusters = birch_lib(
#     get_service_vectors(),
#     find_best_k_silhouette_coefficient(get_service_vectors(), "birch_lib", 4, 11),
# )
# print("num. of clusters: " + str(len(set(clusters))))
# assign_labels_to_clusters_and_store_info_in_database(data, clusters)
# plot_data_t_sne(get_services_dataframe(with_clusters=True))
# plot_separate_clustered_attributes(get_service_vectors(with_clusters=True))
