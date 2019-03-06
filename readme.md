
# Try microsoft cognitive-services-speech-sdk

##  Configuration

### .env file

Use the [.env.sample](.env.sample) file to create your own local .env file.


## Run
To run with the default audio file [whatstheweatherlike.wav](whatstheweatherlike.wav)
```
node index.js
```

To run with a different audio file supply the path as first argument.  Note that at the time of writing Feb 2019 Microsoft-cognitive services speech-sdk only accepted audio formatted as .wav 16000 HZ mono.
```
node index.js "/audio-files/some-audio.wav"
```

## Links
- The following code is adapted from the [Quickstart: Recognize speech with the Speech SDK for Node.js](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/quickstart-js-node) sample from mircosoft.


- Microsoft-cognitive services-speech-sdk 
[API Documentation](
https://docs.microsoft.com/en-us/javascript/api/overview/azure/speech-service?view=azure-node-latest)

