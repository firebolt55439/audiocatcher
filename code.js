function record() {
    console.log("hellow")
    <script src="javascripts/WebAudioRecorder.js"></script>
    audioRecorder = new WebAudioRecorder(sourceNode, {
  workerDir: "javascripts/"    
  recorder = new WebAudioRecorder(sourceNode, configs)
  recorder.timeLimit(600);
  recorder.startRecording();
  recorder.finishRecording();
  recorder.encodeAfterRecorder();
  
});
}

function upload() {}

function soundcloud() {}


