function record() {
    console.log("hellow")
	var context = window.audioContext() || window.webkitAudioContext();
    var recorder = new Recorder(source , this.config);
    recorder.record();
    recorder.stop();
    recorder.exportWAV(this.config.callback(), WAV)
    recorder.encodeAfterRecorder();
    Recorder.forceDownload(blob, output)
}

function upload() {}

function soundcloud() {}




