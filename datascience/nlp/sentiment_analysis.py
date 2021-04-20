import json
import sys

from tensorflow import keras

from rnn_model import *

# test_sentences = np.array(
#     ["Shitty service!", "Perfect service!", "This service provider is ambiguous."]
# )

test_sentences = np.array([sys.argv[1]])

test_sentences_indices = sentences_to_indices(
    test_sentences, words_to_indices, sentence_max_len
)

# load the trained model
model = keras.models.load_model("datascience/nlp/sentiment_analysis_model")

# print(
#     test_sentences[0]
#     + " -----> "
#     + label_to_sentiment(np.argmax(model.predict(test_sentences_indices)[0]))
#     + "\n"
#     + test_sentences[1]
#     + " -----> "
#     + label_to_sentiment(np.argmax(model.predict(test_sentences_indices)[1]))
#     + "\n"
#     + test_sentences[2]
#     + " -----> "
#     + label_to_sentiment(np.argmax(model.predict(test_sentences_indices)[2]))
# )

response = {
    "sentiment": label_to_sentiment(np.argmax(model.predict(test_sentences_indices)[0]))
}

print(json.dumps(response))
