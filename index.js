"use strict";
/**
 *  https://docs.microsoft.com/en-gb/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest
 */

const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");
const stringify = require("json-stringify-pretty-compact");
const DEFAULT_AUDIOFILE = "whatstheweatherlike.wav"; // 16000 Hz, Mono
const TIMER_ID = 'Timer';

require('dotenv').config()

var audiofile = DEFAULT_AUDIOFILE;
var args = process.argv.slice(2);

if (args.length > 0) {
    audiofile = args[0]
}

// start the recognizer and wait for a result.
if (!fs.existsSync(audiofile)) {    
    console.log("Audio file not found " + audiofile);
    process.exit(1);
}

console.time(TIMER_ID);

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = process.env.MS_KEY;
var serviceRegion = process.env.MS_REGION; // e.g., "westus"

// create the push stream we need for the speech sdk.
var pushStream = sdk.AudioInputStream.createPushStream();

// open the file and push it to the push stream.
fs.createReadStream(audiofile).on('data', function (arrayBuffer) {
    pushStream.write(arrayBuffer.buffer);
}).on('end', function () {
    pushStream.close();
});

// we are done with the setup
console.log("Now recognizing from file: " + audiofile);
console.time('')

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// setting the recognition language to English.
speechConfig.speechRecognitionLanguage = "en-US";

// create the speech recognizer.
var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
var results = [];

recognizer.recognized = (s,e) => {
  console.log("Final recognition result received. ");
  results.push(e);
}

// recognizer.recognizing = (s, e) => {
//   console.log(`Intermediate ${e.privResult.privText}`);
// }

  function genFileName(name, ext = ".json"){
    if( path.isAbsolute(name)){
      return (path.basename(name)) + ext;
    } else {
      return name + ext;
    }
  }

  function saveToFile(filename, content){
    console.log("Saving to file " + filename);
    fs.writeFileSync(filename, content,'utf8');
    console.log("Save complete");
  }

  function  extractTextFromResults(){
    let content = "";
    return results.reduce((text,r) => {
      return text + r.privResult.privText + "\n";
    }, "");
  }

  function saveResultsText(){
    let content = "";
    const filename = genFileName(audiofile, ".txt");
    content = extractTextFromResults();
    saveToFile(filename, content);
  }

  function saveResultsJson(){
    const content = stringify(results, {})
    const filename = genFileName(audiofile);
    saveToFile(filename, content);
  }

recognizer.speechStartDetected = function(s, e){
  console.log("Speech Start Detected ");
}

recognizer.speechEndDetected = (s, e) => {
    console.log("Speech End Detected");    
    recognizer.stopContinuousRecognitionAsync(() => {
      console.log("Stop Continuous Recognition");
      console.timeEnd(TIMER_ID);
      saveResultsJson();
      saveResultsText();
      process.exit(0);
    });
}

recognizer.startContinuousRecognitionAsync();

