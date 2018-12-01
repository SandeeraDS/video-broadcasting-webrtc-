'use strict';
const peerConnections = {};
// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
    video: true,
};


// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
    localVideo.srcObject = mediaStream;
    //emit broad casting
    socket.emit('broadcaster');
}

//creat broadcasters sdp and emit
socket.on('watcher', function (id) {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;
    peerConnection.addStream(localVideo.srcObject);
    peerConnection.createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
            socket.emit('offer', id, peerConnection.localDescription);
        });
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            socket.emit('candidate', id, event.candidate);
        }
    };
});
//get clients sdp
socket.on('answer', function (id, description) {
    peerConnections[id].setRemoteDescription(description);
});

socket.on('candidate', function (id, candidate) {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('bye', function (id) {
    peerConnections[id] && peerConnections[id].close();
    delete peerConnections[id];
});

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);