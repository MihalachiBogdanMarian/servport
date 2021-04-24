from rnn_model import *

# TRAIN MODEL

X_train_indices = sentences_to_indices(X_train, words_to_indices, sentence_max_len)
Y_train_oh = convert_to_one_hot(Y_train, num_classes=5)
X_test_indices = sentences_to_indices(X_test, words_to_indices, sentence_max_len)
Y_test_oh = convert_to_one_hot(Y_test, num_classes=5)

# create the model
model = sentiment_analysis_model(
    (sentence_max_len,), words_to_vectors_mapping, words_to_indices
)
model.summary()

# compile the model
model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

# train the model
model.fit(X_train_indices, Y_train_oh, epochs=50, batch_size=32, shuffle=True)

# save the model
model.save("datascience/nlp/sentiment_analysis_model")


# EVALUATE MODEL

# load the trained model
model = keras.models.load_model("datascience/nlp/sentiment_analysis_model")

# test accuracy
loss, accuracy = model.evaluate(X_test_indices, Y_test_oh)

print("\nTest accuracy = ", accuracy)

# plot confusion matrix
plot_confusion_matrix(
    Y_test, np.argmax(model.predict(X_test_indices), axis=1)[[..., None]]
)
