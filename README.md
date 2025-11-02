# Noom - Real-time Chat Application

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Pug](https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=pug&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Node.js, WebSocket, WebRTC를 활용한 실시간 화상 채팅 애플리케이션

## Tech Stack

- **Backend**: Node.js, Express, WebSocket (ws)
- **Frontend**: Vanilla JavaScript, Pug
- **Styling**: Tailwind CSS
- **Build Tools**: Babel, Nodemon

## Getting Started

```bash
npm install
npm start
```

서버 실행: `http://localhost:3000`

---

## DAY 1 - 2: WebSocket Chat ✅

**구현 완료:**
- WebSocket(ws 라이브러리)을 활용한 실시간 채팅 시스템
- 사용자 닉네임 설정 및 변경 기능
- 연결된 모든 클라이언트에게 메시지 브로드캐스팅
- 연결 상태 실시간 추적

**구현 상세:**
- `server.js` - WebSocket 서버 구현, 메시지 타입별 라우팅 처리
- `public/js/app.js` - 클라이언트 WebSocket 연결 및 이벤트 핸들링
- `views/home.pug` - Tailwind CSS 기반 UI 템플릿

**메시지 프로토콜:**
```javascript
{ type: "message" | "nickname", payload: string }
```

**UI/UX 디자인:**
- 그라데이션 배경 (Indigo → Purple → Pink)
- 반응형 카드 레이아웃, 그림자 효과, 둥근 모서리
- 입력 필드 포커스 효과 및 아이콘
- 그라데이션 버튼 호버 애니메이션
- 메시지 자동 스크롤
- 실시간 연결 상태 표시 (녹색 펄스 애니메이션)

---

## DAY 3 - 4: Socket.IO ✅

**구현 완료:**
- Socket.IO 마이그레이션 완료 (ws → Socket.IO)
- 방(Room) 기능 구현
  - 방 생성 및 입장 기능
  - 실시간 공개 방 목록 표시
  - 방별 사용자 수 실시간 업데이트
- 통합 입장 폼 (방 이름 + 닉네임 동시 입력)
- Socket.IO Admin UI 통합 (`@socket.io/admin-ui`)
- Tailwind CSS 프로젝트 설정
  - CDN → 컴파일된 CSS로 전환
  - 커스텀 스타일 분리 (`/public/css/`)
  - 의미있는 클래스명으로 리팩토링

**구현 상세:**
- `server.js` - Socket.IO 서버, 방 관리, 사용자 추적
- `public/js/app.js` - 클라이언트 Socket.IO 연결, 방 입장/퇴장 처리
- `views/home.pug` - 통합 입장 폼, 방 목록 UI
- `public/css/input.css` - Tailwind 기반 커스텀 스타일
- `tailwind.config.js` - Tailwind 설정

**Socket.IO 이벤트:**
```javascript
// Client → Server
socket.emit("enter_room", { room, nickname }, callback)
socket.emit("new_message", message, roomName, callback)

// Server → Client
socket.on("welcome", (nickname, userCount))
socket.on("bye", (nickname, userCount))
socket.on("new_message", message)
socket.on("room_change", rooms)
```

**UI/UX 개선:**
- 헤더와 푸터 분리된 레이아웃
- 방 입장 폼 개선 (Room + Nickname 통합)
- 실시간 방 목록 표시 (클릭 가능한 카드 스타일)
- 방 제목 및 사용자 수 실시간 업데이트
- 입장/퇴장 알림 메시지

**빌드 명령어:**
```bash
npm run build:css    # CSS 빌드
npm run watch:css    # CSS 파일 변경 감지 및 자동 빌드
```

---

## DAY 5 - 7: Video Call ✅

**구현 완료:**
- ✅ WebRTC 기반 P2P 영상/음성 통화
- ✅ User A가 방 생성, User B가 입장하여 통화 시작
- ✅ DataChannel을 활용한 P2P 실시간 채팅
- ✅ 통화 컨트롤 (음소거, 카메라 On/Off, 카메라 선택)
- ✅ 상대 연결 해제 시 스트림 정리 및 제거
- ✅ Tailwind CSS 기반 2-패널 레이아웃 (비디오 + 채팅)

**구현 상세:**

**WebRTC 아키텍처:**
- **Signaling**: Socket.IO가 Offer/Answer/ICE 교환 처리 (~5-10 KB)
- **Media Transmission**: RTCPeerConnection으로 P2P 직접 전송 (~1-5 Mbps)
- **Chat**: RTCDataChannel로 P2P 채팅 (연결 후 서버 우회)

**핵심 기능:**

1. **RTCPeerConnection** (`app.js:300-323`)
   - Google 공개 STUN 서버 사용 (5개 엔드포인트)
   - 이벤트: `icecandidate`, `addstream`
   - Track 관리: `addTrack()`, `replaceTrack()` 카메라 전환

2. **MediaStream API** (`app.js:78-116`)
   - `getUserMedia()`로 카메라/마이크 접근
   - Canvas + AudioContext 더미 스트림 폴백
   - `enumerateDevices()`로 장치 목록 및 선택

3. **RTCDataChannel** (`app.js:243-273`)
   - Caller: `createDataChannel("chat")` 생성
   - Callee: `datachannel` 이벤트로 수신
   - 서버 없이 P2P 메시지 전송

**Signaling 흐름:**
```javascript
1. makeConnection() → RTCPeerConnection 생성
2. getMedia() → 카메라/마이크 스트림 획득
3. addTrack() → 로컬 트랙 연결에 추가
4. Caller: createOffer() → setLocalDescription() → emit("offer")
5. Callee: setRemoteDescription(offer) → createAnswer() → emit("answer")
6. Both: addIceCandidate() for ICE candidates (Trickle ICE)
7. DataChannel 열림 → P2P 채팅 준비 완료
```

**미디어 컨트롤:**
- **음소거/해제** (`app.js:120-134`): 오디오 track.enabled 토글
- **카메라 On/Off** (`app.js:136-150`): 비디오 track.enabled 토글
- **카메라 전환** (`app.js:152-161`): `replaceTrack()`으로 재연결 없이 전환
- **방 나가기** (`app.js:163-185`): 연결 종료, 트랙 정지, 페이지 새로고침

**스트림 정리:**
- **사용자 나가기**: 트랙 정지, srcObject null, 연결 종료 (`app.js:293-314`)
- **상대 연결 끊김**: `user_left` 이벤트로 동일한 정리 트리거
- **정리 효과**: 카메라 LED 완전 꺼짐, 메모리 누수 방지, 좀비 연결 방지

**에러 핸들링:**
- **장치 접근 거부**: Alert → 더미 스트림 (검은 캔버스 + 무음)
- **장치 없음**: 동일한 폴백 메커니즘
- **장치 사용 중**: 동일한 폴백 (한 노트북에서 멀티 브라우저 테스트 가능)

**UI/UX:**
- 2-패널 레이아웃: 비디오 섹션 (왼쪽, flex-1) + 채팅 섹션 (오른쪽, w-96)
- 비디오 그리드: myFace와 peerFace를 2열로 배치
- 비디오 컨트롤: 음소거, 카메라, 카메라 선택, 방 나가기
- 채팅 인터페이스: 메시지 목록 + 전송 버튼이 있는 입력 폼
- 상태 표시: 방 제목, 참가자 수, 채팅 연결 상태

**Socket.IO 이벤트:**
```javascript
// Server.js (relay only)
socket.on("join_room", (roomName, nickname))
socket.on("offer", (offer, roomName))
socket.on("answer", (answer, roomName))
socket.on("ice", (candidate, roomName))
socket.on("leave_room", (roomName))
socket.on("disconnecting")

// App.js (client)
socket.emit("join_room", roomName, nickname)
socket.emit("offer", offer, roomName)
socket.emit("answer", answer, roomName)
socket.emit("ice", candidate, roomName)
socket.emit("leave_room", roomName)
socket.on("welcome", nickname)
socket.on("user_left", nickname)
```
