

// Local stream that will be reproduced on the video.

//triger when broadcaster emit
socket.on('broadcaster', function () {
    socket.emit('watcher');
});


socket.on('connect', function () {
    socket.emit('watcher');
});

let peerConnection;
//send clients sdp
socket.on('offer', function (id, description) {
    peerConnection = new RTCPeerConnection(config);
    peerConnection.setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
            socket.emit('answer', id, peerConnection.localDescription);
        });
    peerConnection.onaddstream = function (event) {
        localVideo.srcObject = event.stream;
    };
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            socket.emit('candidate', id, event.candidate);
        }
    };
});

socket.on('candidate', function (id, candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
});

socket.on('bye', function () {
    peerConnection.close();
});
