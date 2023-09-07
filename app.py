from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, join_room
import os
import uuid

# print("Current working directory:", os.getcwd())

app = Flask(__name__, static_folder="static", template_folder="templates")

# 비밀 키 설정
app.config['SECRET_KEY'] = 'a_very_complex_secret_key'
# socketio = SocketIO(app)
socketio = SocketIO(app, cors_allowed_origins="*")

online_users = 0

@app.route('/')
def index():
    # 각 사용자에게 고유한 세션 ID 할당
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')

# 사용자가 웹페이지에 처음 접속할 때 호출되는 함수
@socketio.on('connect')
def on_connect():
    pass  # 아무런 작업 X -> 채팅 버튼애 따라 cnt 할거라

@socketio.on('join')
def on_join(data):
    global online_users
    # 세션 ID를 기반으로 온라인 사용자 추적
    if not session.get('connected'):
        online_users += 1
        session['connected'] = True
        emit('update_online_count', online_users, broadcast=True)
    emit('message', {'nickname': '', 'message': f'{data["nickname"]}님이 들어왔습니다.', 'type': 'System'}, broadcast=True)


@socketio.on('leave')
def on_leave(data):
    emit('message', {'nickname': '', 'message': f'{data["nickname"]}님이 나갔습니다.', 'type': 'System'}, broadcast=True)


@socketio.on('message')
def handle_message(data):
    emit('message', data, broadcast=True)


@socketio.on('disconnect')
def on_disconnect():
    global online_users
    # 세션 ID를 기반으로 온라인 사용자 추적
    if session.get('connected'):
        online_users -= 1
        if online_users < 0:    # 음수 방지 
            online_users = 0
        session['connected'] = False
        emit('update_online_count', online_users, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
