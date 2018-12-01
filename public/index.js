// stun server
const config = {
    'iceServers': [{
        'urls': ['stun:stun.l.google.com:19302']
    }]
};
const localVideo = document.querySelector('video');
const socket = io.connect(window.location.origin);


window.onunload = window.onbeforeunload = function () {
    socket.close();
};