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

## DAY 5 - 7: Video Call 🔜

**예정 작업:**
- WebRTC 기반 영상/음성 통화
- 화면 공유 기능
- 다중 참여자 화상 통화
- 통화 컨트롤 (음소거, 비디오 On/Off)
