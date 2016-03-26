var isRecording = false;
var recorder;
var context;

function dgid(id) {
    return document.getElementById(id);
}

function ga(a, b) {
    return a.getAttribute(b);
}

function dga(a, b) {
    return ga(dgid(a), b);
}

function sa(a, b, c) {
    a.setAttribute(b, c);
}

function dsa(a, b, c) {
    sa(dgid(a), b, c);
}

var file;
var dstream;

function record() {
    dsa("record", "class", "hide");
    dsa("stop", "class", "show");
    dsa("loading", "class", "show")
    dsa("downlink", "class", "show");
    var ig = dgid("downlink");
    while (ig.firstChild) ig.removeChild(ig.firstChild);
    context = new AudioContext();
    isRecording = true;
    var promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
    promise.then(function (stream) {
                 dstream = stream;
                 recorder = new Recorder(context.createMediaStreamSource(stream));
                 setTimeout(cycle, 5000);
                 recorder.record();
                 })
    
    promise.catch(function (error) { console.log("record() failed") }); //Mozeela
}

function stop() {
    if (isRecording) {
        isRecording = false;
        dsa("stop", "class", "hide");
        dsa("downlink", "class", "show");
        dsa("loading", "class", "hide")
        dsa("record", "class", "show");
        recorder.stop();
        recorder.exportWAV(deal);
        recorder.clear();
    }
}

function cycle() {
    if (!isRecording) {return}
    recorder.stop();
    recorder.exportWAV(deal);
    recorder.clear();
    context = new AudioContext();
    isRecording = true;
     recorder = new Recorder(context.createMediaStreamSource(dstream));
     setTimeout(cycle, 5000);
    recorder.record();
}

function deal(blob) {
    var url = URL.createObjectURL(blob);
    var link = dgid("downlink")
    var a = document.createElement("a");
    sa(a, "href", url);
    a.textContent = "A new snippet was generated"
    link.appendChild(a);
    link.appendChild(document.createElement("br"));
}

function upload(event) {
    var input = event.target;

    file = input.files[0];
    console.log(file.lastModifiedDate);
}
function click(e){
    e.preventDefault();
    console.log(file);
    var form = $('form.iden')[0];
    var formData = new FormData(form);
    $.ajax({
        url: 'http://10.21.86.220:8082/file.mp3',
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        type: 'POST',
        success: function(data){
            alert(data);
        }
    });
    return false;
}


function soundcloud() {}




