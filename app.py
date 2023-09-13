from flask import Flask, render_template, request, session, redirect
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


# index.html에서 JS를 사용해 세션에서 encrypted_user_id를 가져올 수 있는 엔드포인트
@app.route('/get_encrypted_user_id')
def get_encrypted_user_id():
    return {'encrypted_user_id': session.get('encrypted_user_id')}


@app.route('/index')
def index():

    user_id = request.args.get('user_id')
    
    # 암호화된 user_id를 세션에 저장
    if user_id:
        session['encrypted_user_id'] = user_id

    # 각 사용자에게 고유한 세션 ID 할당
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')


@app.route('/to_webgl')
def to_webgl():
    # 암호화된 user_id 가져오기
    encrypted_user_id = session.get('encrypted_user_id')
    
    # WebGL 페이지 URL
    webgl_url = "http://your_webgl_page_url_here.com" # 이 부분 실제 webGL URL로 수정 필요
    
    # 암호화된 user_id를 query parameter로 추가
    if encrypted_user_id:
        webgl_url += f"?user_id={encrypted_user_id}"
    
    # WebGL 페이지로 리다이렉트
    return redirect(webgl_url)


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
