## Backend API Documentation

Base URL

- Local: http://localhost:3000 (or your configured `PORT`)
- All routes below are prefixed by the server root. API routes are under `/api`.

Authentication

- Session-based auth via `express-session` with MongoDB store.
- Use curl cookie jar flags to persist the session:
  - Save cookies: `-c cookie.txt`
  - Send cookies: `-b cookie.txt`

Environment variables

- PORT (default 3000)
- MONGODB_URI
- SESSION_SECRET
- SESSION_MAX_AGE (default 14d)
- CLIENT_ORIGIN (comma-separated frontend origins)

Common headers

- `Content-Type: application/json`

Health

1. GET /api/health

```bash
curl -X GET http://localhost:3000/api/health
```

Sample response

```json
{
  "success": true,
  "message": "Server APIs are running",
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456
  }
}
```

Root 2) GET /

```bash
curl -X GET http://localhost:3000/
```

Sample response

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Auth 3) POST /api/auth/register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}' \
  -c cookie.txt
```

Sample response

```json
{ "success": true, "message": "User registered successfully" }
```

4. POST /api/auth/login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}' \
  -c cookie.txt
```

Sample response

```json
{ "success": true, "message": "User logged in successfully" }
```

5. GET /api/auth/logout (requires session)

```bash
curl -X GET http://localhost:3000/api/auth/logout -b cookie.txt
```

Sample response

```json
{ "success": true, "message": "User logged out successfully" }
```

User 6) GET /api/user/me (requires session)

```bash
curl -X GET http://localhost:3000/api/user/me -b cookie.txt
```

Sample response

```json
{
  "success": true,
  "message": "User data fetched successfully",
  "data": {
    "_id": "66f7f...",
    "username": "alice",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "__v": 0
  }
}
```

Chat history 7) GET /api/user/chats (requires session)
Returns all chat messages involving the current user.

```bash
curl -X GET http://localhost:3000/api/user/chats -b cookie.txt
```

Sample response

```json
{
  "success": true,
  "message": "Chats retrieved successfully!",
  "data": [
    {
      "from": "<userId>",
      "to": "<peerId>",
      "message": "Hi",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "_id": "..."
    }
  ]
}
```

Conversation peers 8) GET /api/user/conversations (requires session)
Returns a list of distinct peers with whom the user has chatted, sorted by last message timestamp.

```bash
curl -X GET http://localhost:3000/api/user/conversations -b cookie.txt
```

Sample response

```json
{
  "success": true,
  "message": "Conversation peers retrieved successfully!",
  "data": [
    { "peerId": "<peerId>", "lastMessageAt": "2024-01-01T00:05:00.000Z" }
  ]
}
```

Conversation with a specific peer 9) GET /api/user/conversations/:peerId (requires session)
Returns ordered messages between the current user and the specified peer.

```bash
curl -X GET http://localhost:3000/api/user/conversations/<peerId> -b cookie.txt
```

Sample response

```json
{
  "success": true,
  "message": "Conversation retrieved successfully!",
  "data": [
    {
      "from": "<userId>",
      "to": "<peerId>",
      "message": "Hello",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    {
      "from": "<peerId>",
      "to": "<userId>",
      "message": "Hey!",
      "timestamp": "2024-01-01T00:01:00.000Z"
    }
  ]
}
```

Error format

- Non-production responses may include `error` as a string or an array of validation issues.
  Example validation error

```json
{
  "success": false,
  "message": "Validation Error",
  "error": [{ "path": "body.username", "message": "Username is required" }]
}
```

Socket.IO

- Namespace: default
- Event names
  - `private_message`: client emits to send a message; server emits to recipient and optionally back to sender with `self: true`.

Connection (JavaScript example)

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("connected", socket.id);
});

socket.on("private_message", (payload) => {
  // payload: { from, message, timestamp, self? }
  console.log("message:", payload);
});

// Send
function send(to, message) {
  socket.emit("private_message", { to, message });
}
```

Notes

- Socket connections are authorized via the HTTP session. Ensure the browser holds the session cookie by logging in first.
- Configure `CLIENT_ORIGIN` to your frontend origin(s) so CORS allows credentialed requests and sockets.
