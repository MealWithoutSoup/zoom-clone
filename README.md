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

## DAY 3 - 4: Socket.IO 🔜

**예정 작업:**
- 네이티브 WebSocket → Socket.IO 마이그레이션
- 채팅 룸/채널 기능
- 타이핑 중 표시 기능
- 접속자 목록 표시

---

## DAY 5 - 7: Video Call 🔜

**예정 작업:**
- WebRTC 기반 영상/음성 통화
- 화면 공유 기능
- 다중 참여자 화상 통화
- 통화 컨트롤 (음소거, 비디오 On/Off)
