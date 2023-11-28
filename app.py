from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit
import os
import uuid

app = Flask(__name__, static_folder="static", template_folder="templates")

# 비밀 키 설정
app.config['SECRET_KEY'] = 'a_very_complex_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*", ping_interval=5, ping_timeout=10)


online_users = 0
connected_users = {}  # 사용자 관리를 위한 딕셔너리

# index.html에서 JS를 사용해 세션에서 encrypted_user_id를 가져올 수 있는 엔드포인트
# @app.route('/get_encrypted_user_id')
# def get_encrypted_user_id():
#     return {'encrypted_user_id': session.get('encrypted_user_id')}

@app.route('/')
@app.route('/index')
def index():
    global online_users     # index에 접속한 session 수
    if online_users > 30:  # 접속자 수가 30을 초과하는 경우
        return redirect(url_for('over_capacity'))   # over_capacity.html 로 리다이렉트
    
    user_id = request.args.get('user_id')
    
    # 암호화된 user_id를 세션에 저장
    if user_id:
        session['encrypted_user_id'] = user_id

    # 각 사용자에게 고유한 세션 ID 할당
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')

@app.route('/over_capacity')
def over_capacity():
    return render_template('over_capacity.html')

# @app.route('/to_webgl')
# def to_webgl():
#     # 암호화된 user_id 가져오기
#     encrypted_user_id = session.get('encrypted_user_id')
    
#     # WebGL 페이지 URL
#     webgl_url = "https://hsgreenedu.or.kr:442/webgl"     # 이 부분 실제 webGL URL로 수정 필요
#     # webgl_url = "https://172.16.10.120:8081"
#     # webgl_url = "http://localhost:5555"
    
#     # 암호화된 user_id를 query parameter로 추가
#     if encrypted_user_id:
#         webgl_url += f"?user_id={encrypted_user_id}"

#     return redirect(webgl_url)  # WebGL 페이지로 리다이렉트


# 사용자가 메인 페이지에 처음 접속할 때 호출되는 함수
@socketio.on('connect')
def on_connect():
    global online_users
    online_users += 1

# 채팅창 접속 시 호출되는 함수
@socketio.on('join')
def on_join(data):
    global online_users
    user_socket_id = request.sid
    if user_socket_id not in connected_users:
        connected_users[user_socket_id] = data["nickname"]
        online_users += 1
        emit('update_online_count', online_users, broadcast=True)
        emit('message', {'nickname': '', 'message': f'{data["nickname"]}님이 들어왔습니다.', 'type': 'System'}, broadcast=True)
웨
@socketio.on('message')
def handle_message(data):
    emit('message', data, broadcast=True)

# 사용자가 웹페이지에서 나갔을 때 호출되는 함수
@socketio.on('client_disconnect')
def client_disconnect(data):
    on_disconnect()

# 사용자가 
@socketio.on('disconnect')
def on_disconnect():
    global online_users
    user_socket_id = request.sid
    
    if user_socket_id in connected_users:
        nickname = connected_users.pop(user_socket_id)
        online_users -= 1
        if online_users < 0:    # 음수 방지 
            online_users = 0
        emit('message', {'nickname': '', 'message': f'{nickname}님이 나갔습니다.', 'type': 'System'}, broadcast=True)
        emit('update_online_count', online_users, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)