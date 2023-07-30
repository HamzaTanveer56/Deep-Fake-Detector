from tensorflow import keras
from keras.models import load_model
import numpy as np
import cv2
import sys
from flask import Flask, jsonify

app = Flask(__name__)

img_size = 224
batch_size = 64
epochs = 30

max_seq_length = 20
num_features = 2048

def crop_center_square(frame):
    y,x = frame.shape[0:2]
    min_dim = min(y, x)
    start_x = (x // 2) - (min_dim // 2)
    start_y = (y // 2) - (min_dim // 2)
    return frame[start_y :start_y + min_dim, start_x : start_x + min_dim]

def load_video(path, max_frames=0, resize=(img_size, img_size)):
    cap = cv2.VideoCapture(path)
    frames = []
    try:
        while 1:
            ret, frame = cap.read()
            if not ret:
                break
            frame = crop_center_square(frame)
            frame = cv2.resize(frame, resize)
            frame = frame[:, :, [2, 1, 0]]
            frames.append(frame)
            
            if len(frames) == max_frames:
                break
    finally:
        cap.release()
    return np.array(frames)

def pretrain_feature_extractor():
    feature_extractor = keras.applications.InceptionV3(
        weights = "imagenet",
        include_top=False,
        pooling="avg",
        input_shape = (img_size,img_size,3)
    )
    preprocess_input = keras.applications.inception_v3.preprocess_input
    
    inputs = keras.Input((img_size,img_size,3))
    preprocessed = preprocess_input(inputs)
    
    outputs = feature_extractor(preprocessed)
    return keras.Model(inputs, outputs, name="feature_extractor")

feature_extractor = pretrain_feature_extractor()

def prepare_single_video(frames):
    frames = frames[None, ...]
    frame_mask = np.zeros(shape=(1, max_seq_length,), dtype="bool")
    frame_features = np.zeros(shape=(1, max_seq_length, num_features), dtype="float32")

    for i, batch in enumerate(frames):
        video_length = batch.shape[0]
        length = min(max_seq_length, video_length)
        for j in range(length):
            frame_features[i, j, :] = feature_extractor.predict(batch[None, j, :])
        frame_mask[i, :length] = 1  # 1 = not masked, 0 = masked

    return frame_features, frame_mask

def sequence_prediction(path):
    frames = load_video(path)
    frame_features, frame_mask = prepare_single_video(frames)
    model = load_model('model.h5')
    return model.predict([frame_features, frame_mask])[0]

@app.route('/process_video/<video_path>', methods=['GET'])
def process_video(video_path):
    result = sequence_prediction(f'../downloads/{video_path}')
    return jsonify({"result": result[0].item()})


if __name__ == '__main__':
    app.run(debug=True, port=8080)