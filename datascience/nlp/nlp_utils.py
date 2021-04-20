import json
import os
import random
import re
import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from dotenv import dotenv_values
from nltk import ngrams
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer

config = dotenv_values(".env")


def read_glove_vectors(glove_file):
    with open(os.path.join(sys.path[0], glove_file), "r", encoding="utf8") as f:
        words = set()
        words_to_vectors_mapping = {}

        for line in f:
            line = line.strip().split()
            current_word = line[0]
            words.add(current_word)
            words_to_vectors_mapping[current_word] = np.array(
                line[1:], dtype=np.float64
            )

        i = 1
        words_to_indices = {}
        indices_to_words = {}
        for w in sorted(words):
            words_to_indices[w] = i
            indices_to_words[i] = w
            i = i + 1
    return words_to_indices, indices_to_words, words_to_vectors_mapping


def add_word_index_vector(
    words_to_indices,
    indices_to_words,
    words_to_vectors_mapping,
    word,
    glove_vector_size,
):
    ps = PorterStemmer()
    vector = np.zeros((glove_vector_size,))
    next_index = max(words_to_indices.values()) + 1

    if ps.stem(word) in words_to_indices:
        vector = words_to_vectors_mapping[ps.stem(word)]
    else:
        if len(word) > 4:
            for n in range(4, len(word)):
                for ngram in [word[i : i + n] for i in range(len(word) - n + 1)]:
                    if ngram in words_to_indices:
                        vector = words_to_vectors_mapping[ngram]

    words_to_indices[word] = next_index
    indices_to_words[next_index] = word
    words_to_vectors_mapping[word] = vector

    return vector


def add_entry_in_glove(glove_file, word, vector):
    line = word + " " + " ".join(["%.8f" % i for i in vector]) + "\n"
    with open(os.path.join(sys.path[0], glove_file), "a", encoding="utf8") as f:
        f.write(line)


def preprocess_comment(comment):
    wnl = WordNetLemmatizer()

    # remove symbols and numbers
    comment = re.sub(r"[^a-zA-Z]", " ", comment)

    # remove single characters
    comment = re.sub(r"\s+[a-zA-Z]\s+", " ", comment)

    # remove multiple spaces
    comment = re.sub(r"\s+", " ", comment)

    tokens = comment.split()
    tokens = [wnl.lemmatize(word) for word in tokens]

    return (" ".join(tokens)).lower()


def preprocess_dataset(comments):
    return [preprocess_comment(comment) for comment in comments]


def read_preprocessed_dataset(dataset_path):
    reviews = []
    comments = []
    ratings = []

    path_to_file = Path.cwd() / dataset_path
    with open(path_to_file) as json_file:
        reviews = [
            {
                "comment": review["comment"] if "comment" in review else "blank",
                "rating": review["rating"],
            }
            for review in json.load(json_file)
        ]

    random.shuffle(reviews)

    comments = [review["comment"] for review in reviews]
    ratings = [review["rating"] - 1 for review in reviews]

    comments = preprocess_dataset(comments)

    X_train = np.asarray(comments[: int(config["NLP_RNN_NUM_TRAIN_EXAMPLES"])])
    Y_train = np.asarray(ratings[: int(config["NLP_RNN_NUM_TRAIN_EXAMPLES"])])
    X_test = np.asarray(
        comments[
            int(config["NLP_RNN_NUM_TRAIN_EXAMPLES"]) : int(
                config["NLP_RNN_NUM_TRAIN_EXAMPLES"]
            )
            + int(config["NLP_RNN_NUM_TEST_EXAMPLES"])
        ]
    )
    Y_test = np.asarray(
        ratings[
            int(config["NLP_RNN_NUM_TRAIN_EXAMPLES"]) : int(
                config["NLP_RNN_NUM_TRAIN_EXAMPLES"]
            )
            + int(config["NLP_RNN_NUM_TEST_EXAMPLES"])
        ]
    )

    return X_train, Y_train, X_test, Y_test


def convert_to_one_hot(Y, num_classes):
    Y = np.eye(num_classes)[Y.reshape(-1)]
    return Y


def label_to_sentiment(label):
    return sentiments_dictionary[label]


sentiments_dictionary = {
    0: "Poor",
    1: "Fair",
    2: "Good",
    3: "Very Good",
    4: "Excellent",
}


def plot_confusion_matrix(
    Y_actual, Y_predicted, title="Confusion Matrix", cmap=plt.cm.gray_r
):
    df_confusion = pd.crosstab(
        Y_actual,
        Y_predicted.reshape(
            Y_predicted.shape[0],
        ),
        rownames=["Actual"],
        colnames=["Predicted"],
        margins=True,
    )

    print(
        label_to_sentiment(0)
        + " * "
        + label_to_sentiment(1)
        + " * "
        + label_to_sentiment(2)
        + " * "
        + label_to_sentiment(3)
        + " * "
        + label_to_sentiment(4)
    )
    print(df_confusion)

    df_conf_norm = df_confusion / df_confusion.sum(axis=1)

    plt.matshow(df_confusion, cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(df_confusion.columns))
    plt.xticks(tick_marks, df_confusion.columns, rotation=45)
    plt.yticks(tick_marks, df_confusion.index)
    # plt.tight_layout()
    plt.ylabel(df_confusion.index.name)
    plt.xlabel(df_confusion.columns.name)
    plt.show()
