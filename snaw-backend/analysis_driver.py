from keras.models import load_model
import matplotlib.pyplot as plt
import sklearn.metrics as metrics
import librosa
import numpy as np
import traceback
import os
import json
from classification_cnn import runScript as run_classification
from get_spectrogram import runScript as run_spectrogram
from acousticIndices import getAcousticIndices as run_indices

DEBUG_FLAG = False

# Path to each CNN model (Example format: 'model\\anthro\\model.h5)
ANTHRO_CNN_MODEL = 'model\\anthro\\ant_cnn_model.h5'
BIO_CNN_MODEL = 'model\\bio\\bio_cnn_model.h5'
GEO_CNN_MODEL = 'model\\geo\\geo_cnn_model.h5'

def run_driver(personalID) :
    if DEBUG_FLAG : print("[WORKING] Attempting to run analysis driver - analysis_driver.py")

    # Create a dictionary for storing
    # And a counter for the files
    listOfImages = {}
    fileCount = 0

    if DEBUG_FLAG : print("[WORKING] Loading CNN Models..")
    all_models = [ load_model(ANTHRO_CNN_MODEL),
                   load_model(BIO_CNN_MODEL),
                   load_model(GEO_CNN_MODEL) ]
    if DEBUG_FLAG : print("[SUCCESS] Loaded CNN Models..")

    try:
        # Retrieve file
        for filename in os.listdir('instance/upload/user'+personalID):

            audiofile = 'instance/upload/user'+personalID+"/"+ filename

            data = run_classification( audiofile, all_models )

            image_list, audio_wav = run_spectrogram( filename, fileCount, audiofile, data )

            indices_list = run_indices( audiofile )

            listOfImages[fileCount] = [filename,
                                       image_list,
                                       audio_wav,
                                       data,
                                       indices_list ]
            fileCount += 1

        # remove all spectrogram pictures from storage
        for file in os.listdir("spectrogram/"):
            os.remove("spectrogram/"+file)

    except:
         track = traceback.format_exc()
         print(track)

    if DEBUG_FLAG : print("[SUCCESS] analysis_driver ran - analysis_driver.py")

    return listOfImages