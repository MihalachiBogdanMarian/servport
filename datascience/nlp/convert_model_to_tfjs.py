import tensorflowjs as tfjs
from tensorflow import keras

# load the trained model
model = keras.models.load_model("datascience/nlp/sentiment_analysis_model")

tfjs.converters.save_keras_model(model, "datascience/nlp/sentiment_analysis_model_js")
