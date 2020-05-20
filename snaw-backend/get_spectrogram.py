import numpy as np
from matplotlib import pyplot as plt
import scipy.io.wavfile as wav
from numpy.lib import stride_tricks
import sys
import os
import base64
from classification_cnn import runScript as get_result
import traceback

DEBUG_FLAG = False
ERROR = 'ERROR_PRESENT'

""" short time fourier transform of audio signal """
def stft(sig, frameSize, overlapFac=0.5, window=np.hanning):
    win = window(frameSize)
    hopSize = int(frameSize - np.floor(overlapFac * frameSize))

    # zeros at beginning (thus center of 1st window should be for sample nr. 0)   
    samples = np.append(np.zeros(int(np.floor(frameSize/2.0))), sig)    
    # cols for windowing
    cols = np.ceil( (len(samples) - frameSize) / float(hopSize)) + 1
    # zeros at end (thus samples can be fully covered by frames)
    samples = np.append(samples, np.zeros(frameSize))

    frames = stride_tricks.as_strided(samples, shape=(int(cols), frameSize), strides=(samples.strides[0]*hopSize, samples.strides[0])).copy()
    frames *= win

    return np.fft.rfft(frames)    

""" scale frequency axis logarithmically """    
def logscale_spec(spec, sr=44100, factor=20.):
    timebins, freqbins = np.shape(spec)

    scale = np.linspace(0, 1, freqbins) ** factor
    scale *= (freqbins-1)/max(scale)
    scale = np.unique(np.round(scale))

    # create spectrogram with new freq bins
    newspec = np.complex128(np.zeros([timebins, len(scale)]))
    for i in range(0, len(scale)):        
        if i == len(scale)-1:
            newspec[:,i] = np.sum(spec[:,int(scale[i]):], axis=1)
        else:        
            newspec[:,i] = np.sum(spec[:,int(scale[i]):int(scale[i+1])], axis=1)

    # list center freq of bins
    allfreqs = np.abs(np.fft.fftfreq(freqbins*2, 1./sr)[:freqbins+1])
    freqs = []
    for i in range(0, len(scale)):
        if i == len(scale)-1:
            freqs += [np.mean(allfreqs[int(scale[i]):])]
        else:
            freqs += [np.mean(allfreqs[int(scale[i]):int(scale[i+1])])]

    return newspec, freqs

""" plot spectrogram"""
def plotstft(data, audiopath, binsize=2**10, plotpath=None, colormap="jet"):
    if data:
        # initialize variables
        size = len(data)
        x_labels = []
        x_cats = []
        currCat = ""

        # enumerate on the classified data
        for index, row in enumerate(data) :
         # set value to the current category at index
         currCat = row['category']
         # set prediction value from data, cast to string and add percent symbol
         pred = str(row['pred']) + "%"

         # if, this isnt the first run and the last seen category is the same as the current category
         #   only append the prediction value
         # else, we are on a new category, or first run
         #   append new category and prediction value
         if(len(x_cats) > 0 and x_cats[-1][:-4] == currCat) : x_labels.append(" " + pred), x_cats.append(currCat+" "+pred)
         else : x_labels.append(currCat + " " + pred), x_cats.append(currCat + " " + pred)

        # load audio file and get sample rates
        samplerate, samples = wav.read(audiopath)
        s = stft(samples, binsize)
        # get frequency of audio data
        sshow, freq = logscale_spec(s, factor=1.0, sr=samplerate)
        ims = 20.*np.log10(np.abs(sshow)/10e-6) # amplitude to decibel
        timebins, freqbins = np.shape(ims)

        # calc number of seconds
        seconds = int(len(samples) / samplerate)

        plt.figure(figsize=(15, 7.5))
        plt.imshow(np.transpose(ims), origin="lower", aspect="auto", interpolation="none")

        plt.xlabel("time (s)")
        plt.ylabel("frequency (hz)")
        plt.xlim([0, timebins-1])
        plt.ylim([0, freqbins])

        x_size = int(timebins / seconds)

        xlocs = np.float32(np.linspace(0, timebins-1, seconds))
        plt.xticks(xlocs, ["%.f" % l for l in ((xlocs*len(samples)/timebins)+(0.5*binsize))/samplerate])
        ylocs = np.int16(np.round(np.linspace(0, freqbins-1, 10)))
        plt.yticks(ylocs, ["%.02f" % freq[i] for i in ylocs])

        index = 1
        annotate_size = 1/seconds

        # draw classification boxes
        for x, cat in zip(xlocs, x_cats):
         if(cat[:-4] != 'NO') :
             # get prediction value from label, divide by 100 to get percent, divide by 3 to get reasonable opacity level
             alpha_val = int(cat[-3:-1]) / 100 / 3
             plt.fill([x,x+x_size,x+x_size,x], [0,0,freqbins,freqbins], 'b', alpha=alpha_val)
             plt.text(x+5, 5, cat[-3:], rotation=90, color="white")
             plt.text(x+5, 40, cat[:-4], rotation=90, color="white")
         else :
            # get prediction value from label, divide by 100 to get percent,
            #   multiply by negative and add .33 to get reasonable opacity level
            alpha_val = int(cat[-3:-1]) / 100 * -1 + .5
            if( DEBUG_FLAG ):
                print(alpha_val)
                print(int(cat[-3:-1]))
            plt.fill([x,x+x_size,x+x_size,x], [0,0,freqbins,freqbins], 'r', alpha=alpha_val)
            plt.text(x+5, 5, cat[-3:], rotation=90, color="white")
            plt.text(x+5, 40, cat[:-4], rotation=90, color="white")
         index += 1
    else :
        #load audio file and get sample rates
        samplerate, samples = wav.read(audiopath)
        s = stft(samples, binsize)
        # get frequency of audio data
        sshow, freq = logscale_spec(s, factor=1.0, sr=samplerate)
        ims = 20.*np.log10(np.abs(sshow)/10e-6) # amplitude to decibel
        timebins, freqbins = np.shape(ims)
        # calc number of seconds
        seconds = int(len(samples) / samplerate)

        plt.figure(figsize=(15, 7.5))
        plt.imshow(np.transpose(ims), origin="lower", aspect="auto", interpolation="none")

        plt.xlabel("time (s)")
        plt.ylabel("frequency (hz)")
        plt.xlim([0, timebins-1])
        plt.ylim([0, freqbins])

        x_size = int(timebins / seconds)

        xlocs = np.float32(np.linspace(0, timebins-1, seconds))
        plt.xticks(xlocs, ["%.f" % l for l in ((xlocs*len(samples)/timebins)+(0.5*binsize))/samplerate])
        ylocs = np.int16(np.round(np.linspace(0, freqbins-1, 10)))
        plt.yticks(ylocs, ["%.02f" % freq[i] for i in ylocs])

    if plotpath:
     plt.savefig(plotpath, bbox_inches="tight")
    else:
     plt.show()

    plt.clf()
    return ims

def encoding( data, audiofile, path ) :
    # Run spectrogram plotting
    if DEBUG_FLAG : print("[WORKING] Attemping to run spectrogram plotting - get_spectrogram.py")

    ims = plotstft(data, audiofile, plotpath=path)

    # Convert spectrograms into a base64 string to be sent to front end
    with open(path + ".png", "rb") as spect_image:
        encode = base64.b64encode(spect_image.read())
        # Add file number as key and file name and data as values
        spect_image.close()

    '''This is the same as the spectrograms, except it gets the audio
        Base64'''
    with open(audiofile, "rb") as wav_audio:
        wavEncode = base64.b64encode(wav_audio.read())
        wav_audio.close()
    return encode, wavEncode

def runScript(filename, fileCount, audiofile, data):
    if DEBUG_FLAG : print("[WORKING] Attempting to run spectrogram calculator - get_spectrogram.py")

    # If spectrogram folder has not been created.
    if (os.path.isdir('Spectrogram/') == False):
        os.mkdir('Spectrogram/')
    image_list = ""
    audio_wav = ""
    try:
        # Correct Path
        path= "spectrogram/SpectroedImage"+ str(fileCount)

        # encode the data to save as a picture for front-end of site
        encode_ant, wavEncode = encoding( data[0]['data'], audiofile, path ) # wavEncode only needed from one, all same
        encode_bio, _ = encoding( data[1]['data'], audiofile, path )
        encode_geo, _ = encoding( data[2]['data'], audiofile, path )
        encode_none, _ = encoding( None, audiofile, path )

        try:
            # save lise of pictures
            image_list = ['data:image/png;base64,' + encode_ant.decode("utf-8"),
                          'data:image/png;base64,' + encode_bio.decode("utf-8"),
                          'data:image/png;base64,' + encode_geo.decode("utf-8"),
                          'data:image/png;base64,' + encode_none.decode("utf-8")]
        except:
            image_list = ERROR

        try:
            # save .wav representation
            audio_wav =  'data:audio/wav;base64,' + wavEncode.decode("utf-8")
        except:
            audio_wav = ERROR
    except:
        #if DEBUG_FLAG : print('[FAILURE -- Spectrogram] File upload unsuccessful, or no file uploaded.')
        track = traceback.format_exc()
        print(track)
        image_list = ERROR
        audio_wav = ERROR

    return image_list, audio_wav
