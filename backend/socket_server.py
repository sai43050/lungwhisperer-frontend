import socketio

# Initialize the Async Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ, auth):
    print(f"[Socket] Client Connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"[Socket] Client Disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    room = data.get("room")
    if room:
        sio.enter_room(sid, room)
        print(f"[Socket] {sid} joined room: {room}")
        # Notify others in the room that someone connected (maybe trigger offer renegotiation)
        await sio.emit('peer_joined', {'sid': sid}, room=room, skip_sid=sid)

@sio.event
async def offer(sid, data):
    room = data.get("room")
    # Relay the SDP offer to everyone else in the room
    await sio.emit('offer', data, room=room, skip_sid=sid)

@sio.event
async def answer(sid, data):
    room = data.get("room")
    # Relay the SDP answer to everyone else in the room
    await sio.emit('answer', data, room=room, skip_sid=sid)

@sio.event
async def ice_candidate(sid, data):
    room = data.get("room")
    # Relay the ICE candidates to everyone else in the room
    await sio.emit('ice_candidate', data, room=room, skip_sid=sid)
