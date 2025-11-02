const socket = io();

// DOM Elements
const myFace = document.getElementById("myFace");
const peerFace = document.getElementById("peerFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const roomTitle = document.getElementById("roomTitle");
const myNicknameSpan = document.getElementById("myNickname");
const leaveRoomBtn = document.getElementById("leaveRoom");

// Chat Elements
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messageList = document.getElementById("messageList");
const chatStatus = document.getElementById("chatStatus");

// State Variables
let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myNickname;
let myPeerConnection;
let myDataChannel;

// ========== Media Functions ==========

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

function createDummyStream() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Camera Not Available", canvas.width / 2, canvas.height / 2);

  const videoStream = canvas.captureStream();
  const videoTrack = videoStream.getVideoTracks()[0];

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const destination = audioContext.createMediaStreamDestination();
  oscillator.connect(destination);
  oscillator.start();
  const audioTrack = destination.stream.getAudioTracks()[0];
  audioTrack.enabled = false;

  return new MediaStream([videoTrack, audioTrack]);
}

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.error("Camera/Microphone access failed:", e);
    myStream = createDummyStream();
    myFace.srcObject = myStream;
    alert(
      "⚠️ 카메라/마이크 접근 실패\n\n" +
        "이유: " +
        (e.name === "NotAllowedError"
          ? "권한이 거부되었습니다"
          : e.name === "NotFoundError"
          ? "장치를 찾을 수 없습니다"
          : e.name === "NotReadableError"
          ? "장치가 이미 사용 중입니다"
          : "알 수 없는 오류") +
        "\n\n" +
        "더미 스트림으로 회의에 연결됩니다."
    );
    muteBtn.disabled = true;
    cameraBtn.disabled = true;
    camerasSelect.disabled = true;
  }
}

// ========== Control Handlers ==========

function handleMuteClick() {
  if (!myStream) return;
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  const muteSpan = muteBtn.querySelector("span");
  if (!muted) {
    muteSpan.innerText = "Unmute";
    muted = true;
  } else {
    muteSpan.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  if (!myStream) return;
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  const cameraSpan = cameraBtn.querySelector("span");
  if (cameraOff) {
    cameraSpan.innerText = "Camera On";
    cameraOff = false;
  } else {
    cameraSpan.innerText = "Camera Off";
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
}

function handleLeaveRoom() {
  // 연결 종료
  if (myPeerConnection) {
    myPeerConnection.close();
    myPeerConnection = null;
  }

  // 스트림 정지
  if (myStream) {
    myStream.getTracks().forEach(track => track.stop());
  }

  // UI 초기화
  call.classList.add("hidden");
  welcome.classList.remove("hidden");
  messageList.innerHTML = "";

  // 소켓 연결 해제
  socket.emit("leave_room", roomName);

  // 페이지 새로고침
  location.reload();
}

// ========== Chat Functions ==========

function addMessage(message, isMyMessage = false) {
  const li = document.createElement("li");
  li.className = isMyMessage
    ? "px-4 py-2 bg-indigo-100 rounded-lg text-gray-800 self-end max-w-xs"
    : "px-4 py-2 bg-gray-200 rounded-lg text-gray-800 self-start max-w-xs";
  li.innerText = message;
  messageList.appendChild(li);
  messageList.parentElement.scrollTop = messageList.parentElement.scrollHeight;
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const message = messageInput.value;

  if (myDataChannel && myDataChannel.readyState === "open") {
    const fullMessage = `${myNickname}: ${message}`;
    myDataChannel.send(fullMessage);
    addMessage(`You: ${message}`, true);
    messageInput.value = "";
  } else {
    addMessage("⚠️ Chat not connected yet", false);
  }
}

// ========== Welcome Form ==========

async function initCall() {
  welcome.classList.add("hidden");
  call.classList.remove("hidden");
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const roomNameInput = document.getElementById("roomName");
  const nicknameInput = document.getElementById("nickname");

  roomName = roomNameInput.value;
  myNickname = nicknameInput.value;

  // UI 업데이트
  roomTitle.innerText = `Room: ${roomName}`;
  myNicknameSpan.innerText = myNickname;

  await initCall();
  socket.emit("join_room", roomName, myNickname);

  roomNameInput.value = "";
  nicknameInput.value = "";
}

// ========== Socket Events ==========

socket.on("welcome", async (nickname) => {
  // DataChannel 생성 (Caller)
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("open", () => {
    console.log("DataChannel opened");
    chatStatus.innerText = "Connected";
    addMessage(`${nickname} joined the room`, false);
  });
  myDataChannel.addEventListener("message", (event) => {
    addMessage(event.data, false);
  });

  // Offer 생성
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  // DataChannel 수신 (Callee)
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("open", () => {
      console.log("DataChannel opened");
      chatStatus.innerText = "Connected";
    });
    myDataChannel.addEventListener("message", (event) => {
      addMessage(event.data, false);
    });
  });

  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

socket.on("user_left", (nickname) => {
  addMessage(`${nickname} left the room`, false);
  chatStatus.innerText = "Disconnected";

  // Peer video stream 정리
  if (peerFace.srcObject) {
    peerFace.srcObject.getTracks().forEach(track => track.stop());
    peerFace.srcObject = null;
  }

  // PeerConnection 정리
  if (myPeerConnection) {
    myPeerConnection.close();
    myPeerConnection = null;
  }

  // DataChannel 정리
  if (myDataChannel) {
    myDataChannel.close();
    myDataChannel = null;
  }
});

// ========== RTC Functions ==========

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });

  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);

  if (myStream) {
    myStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));
  }
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  peerFace.srcObject = data.stream;
  document.getElementById("peerNickname").innerText = "Peer";
}

// ========== Event Listeners ==========

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);
welcomeForm.addEventListener("submit", handleWelcomeSubmit);
messageForm.addEventListener("submit", handleMessageSubmit);
leaveRoomBtn.addEventListener("click", handleLeaveRoom);
