"use strict";

// pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");
require('dotenv').config()

var DEFAULT_FILE = "whatstheweatherlike.wav"; // 16000 Hz, Mono
var filename = DEFAULT_FILE;
var args = process.argv.slice(2);

if (args.length > 0) {
    filename = args[0]
}

// start the recognizer and wait for a result.
if (!fs.existsSync(filename)) {
    console.log("Audio file not found " + filename);
    process.exit(1);
}

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = process.env.MS_KEY;
var serviceRegion = process.env.MS_REGION; // e.g., "westus"

// create the push stream we need for the speech sdk.
var pushStream = sdk.AudioInputStream.createPushStream();

// open the file and push it to the push stream.
fs.createReadStream(filename).on('data', function (arrayBuffer) {
    pushStream.write(arrayBuffer.buffer);
}).on('end', function () {
    pushStream.close();
});

// we are done with the setup
console.log("Now recognizing from file: " + filename);

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// setting the recognition language to English.
speechConfig.speechRecognitionLanguage = "en-US";

// create the speech recognizer.
var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

recognizer.recognizeOnceAsync(
    function (result) {
        console.log(result);

        recognizer.close();
        recognizer = undefined;
    },
    function (err) {
        console.trace("err - " + err);

        recognizer.close();
        recognizer = undefined;
    });