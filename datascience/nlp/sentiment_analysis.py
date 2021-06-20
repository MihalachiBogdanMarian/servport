import json
import os
import sys

from keras.utils.vis_utils import plot_model
from tensorflow import keras

from rnn_model import *

# os.environ["PATH"] += os.pathsep + "C:/Program Files/Graphviz/bin/"


test_sentences = np.array([sys.argv[1]])

test_sentences_indices = sentences_to_indices(
    test_sentences, words_to_indices, sentence_max_len
)

# load the trained model
model = keras.models.load_model("datascience/nlp/sentiment_analysis_model")

# plot_model(model, to_file="lstmbrnn.png", show_shapes=True, show_layer_names=True)

response = {
    "sentiment": label_to_sentiment(np.argmax(model.predict(np.reshape(test_sentences_indices, (sentence_max_len,)))[0]))
}

print(json.dumps(response))
