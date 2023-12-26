from flask import Flask, jsonify, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit
import os
import uuid

app = Flask(__name__, static_folder="static", template_folder="templates")

# 비밀 키 설정
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_key_as_fallback')
socketio = SocketIO(app, cors_allowed_origins="*", ping_interval=5, ping_timeout=10)

webgl_online_users = 0  # WebGL 페이지의 동시 접속자 수
connected_users = {}  # 소켓 ID와 닉네임을 연결하기 위한 딕셔너리


# @app.route('/index')
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/webgl_access')
def webgl_access():
    global webgl_online_users
    if webgl_online_users >= 30:
        return redirect(url_for('over_capacity'))
    webgl_online_users += 1
    return jsonify(success=True, online_users=webgl_online_users)

@app.route('/unregister_webgl_user')
def unregister_webgl_user():
    global webgl_online_users
    webgl_online_users = max(0, webgl_online_users - 1)
    return jsonify(success=True)

@app.route('/over_capacity')
def over_capacity():
    return render_template('over_capacity.html')

# 사용자가 메인 페이지에 처음 접속할 때 호출되는 함수
@socketio.on('connect')
def on_connect():
    emit('update_online_count', webgl_online_users, broadcast=True)

# 사용자가 채팅창 접속 시 호출
@socketio.on('join')
def on_join(data):
    user_socket_id = request.sid
    user_nickname = data["nickname"]
    connected_users[user_socket_id] = user_nickname     # 사용자의 닉네임 저장
    emit('update_online_count', webgl_online_users, broadcast=True)
    emit('message', {'nickname': '', 'message': f'{user_nickname}님이 들어왔습니다.', 'type': 'System'}, broadcast=True)

# 메시지 처리
@socketio.on('message')
def handle_message(data):
    user_socket_id = request.sid
    nickname = connected_users.get(user_socket_id, "익명")      # 닉네임 조회
    emit('message', {'nickname': nickname, 'message': data['message']}, broadcast=True)

# 사용자가 웹페이지에서 나갔을 때 호출되는 함수 (클라이언트 측에서 명시적으로 발생)
# => 남아있는 사람에게 메시지를 뿌려주는 용도로 필요함
@socketio.on('client_disconnect')
def client_disconnect(data):
    on_disconnect()

# 사용자 연결 해제 처리 함수
@socketio.on('disconnect')
def on_disconnect():
    global webgl_online_users
    user_socket_id = request.sid
    if user_socket_id in connected_users:
        nickname = connected_users.pop(user_socket_id)      # 연결 해제된 클라이언트 닉네임 가져오기
        emit('message', {'nickname': '', 'message': f'{nickname}님이 나갔습니다.', 'type': 'System'}, broadcast=True)
    
    webgl_online_users = len(connected_users)  # 현재 접속자 수를 연결된 webgl 사용자 수로 업데이트
    if webgl_online_users < 0:  # 음수 방지
        webgl_online_users = 0
    emit('update_online_count', webgl_online_users, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)