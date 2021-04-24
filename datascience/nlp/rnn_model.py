from keras.initializers import glorot_uniform
from keras.layers import LSTM, Activation, Bidirectional, Dense, Dropout, Input
from keras.layers.embeddings import Embedding
from keras.models import Model
from keras.preprocessing import sequence
from tensorflow import keras

from nlp_utils import *

X_train, Y_train, X_test, Y_test = read_preprocessed_dataset(
    "backend/data/reviews.json"
)

# get the max length of a sentence from the dataset
# sentences introduced by users, longer than the max length, will be cropped by the RNN
sentence_max_len = len(max(np.concatenate((X_train, X_test)), key=len).split())

words_to_indices, indices_to_words, words_to_vectors_mapping = read_glove_vectors(
    "glove.6B.50d.txt"
)


def sentences_to_indices(X, words_to_indices, sentence_max_len):
    # get number of traning examples
    m = X.shape[0]

    # initialize X_indices - numpy matrix of zeros and the correct shape [m, sentence_max_len]
    X_indices = np.zeros([m, sentence_max_len])

    # for each training example
    for i in range(m):
        # get list of words
        sentence_words = X[i].lower().split()

        j = 0

        # for each word in the sentence
        for w in sentence_words:
            if w not in words_to_indices:
                # add new entries in words_to_indices, indices_to_words, words_to_vectors_mapping
                vector = add_word_index_vector(
                    words_to_indices, indices_to_words, words_to_vectors_mapping, w, 50
                )

                # add entry in glove file
                add_entry_in_glove("glove.6B.50d.txt", w, vector)

                X_indices[i, j] = 0
            else:
                # get the index of the word
                X_indices[i, j] = words_to_indices[w]

            j = j + 1

    return X_indices


def pretrained_embedding_layer(words_to_vectors_mapping, words_to_indices):
    # Keras Embedding() layer and with pre-trained GloVe 50-dimensional vectors

    vocabulary_length = len(words_to_indices) + 1  # Keras embedding required dimension
    embedding_dimensionality = words_to_vectors_mapping["light"].shape[
        0
    ]  # dimensionality of your GloVe word vectors (= 50)

    # initialize embedding matrix
    embedding_matrix = np.zeros([vocabulary_length, embedding_dimensionality])

    # fill in the rows of the embedding matrix with the vector representations of each word
    for word, index in words_to_indices.items():
        embedding_matrix[index, :] = words_to_vectors_mapping[word]

    # Keras Embedding() layer
    embedding_layer = Embedding(
        input_dim=vocabulary_length,
        output_dim=embedding_dimensionality,
        trainable=False,
    )

    # build the embedded layer
    embedding_layer.build((None,))

    # sets the weights of the embedding layer to the embedding matrix (pretrained)
    embedding_layer.set_weights([embedding_matrix])

    return embedding_layer


def sentiment_analysis_model(input_shape, words_to_vectors_mapping, words_to_indices):
    # create the sentiment analysis model graph

    # input of the graph
    sentence_indices = Input(input_shape, dtype="int32")

    # Embedding layer pretrained with GloVe vectors
    embedding_layer = pretrained_embedding_layer(
        words_to_vectors_mapping, words_to_indices
    )

    # propagate sentence_indices through the embedding layer
    embeddings = embedding_layer(sentence_indices)

    # LSTM layer with 128-dimensional hidden state (the returned output is a batch of sequences)
    X = Bidirectional(LSTM(units=128, return_sequences=True))(embeddings)

    # Dropout layer
    X = Dropout(rate=0.5)(X)

    # LSTM layer with 128-dimensional hidden state (the returned output is a single hidden state)
    X = Bidirectional(LSTM(128, return_sequences=False))(X)

    # Dropout layer
    X = Dropout(rate=0.5)(X)

    # Dense layer
    X = Dense(units=5)(X)

    # softmax Activation
    X = Activation("softmax")(X)

    # Model - convert sentence_indices into X
    model = Model(inputs=sentence_indices, outputs=X)

    return model
