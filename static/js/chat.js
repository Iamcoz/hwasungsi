document.addEventListener("DOMContentLoaded", function () {
    const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('message');
    const chatMessages = document.getElementById('messages');
    const onlineCount = document.getElementById('users-online');

    socket.on('message', function (data) {
        const messageElem = document.createElement('div');

        if (data.type && data.type === 'System') {
            messageElem.classList.add('system-message'); // 시스템 메시지인 경우 'system-message' 클래스 추가
        }
        
        // System: 이라는 문구 제거 로직
        if (data.nickname) {
            messageElem.textContent = data.nickname + ": " + data.message;
        } else {
            messageElem.textContent = data.message;
        }

        chatMessages.appendChild(messageElem);
    
        // 스크롤을 메시지 영역의 최하단으로 이동
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    socket.on('update_online_count', function (count) {
        onlineCount.textContent = "현재 접속자 수: " + count + "명";
    });

    document.getElementById('sendBtn').addEventListener('click', function () {
        const message = chatInput.value.trim();
        if (message) {
            socket.emit('message', { nickname: userNickname, message: message });
            chatInput.value = '';
        }
    });


    let userNickname = null;
    document.getElementById('startChat').addEventListener('click', function () {
        const nickname = document.getElementById('nickname-entry').value.trim();

        if (nickname) {

            userNickname = nickname;  // 서버에 전달할 닉네임 저장

            // Hide entry box and show chat box
            document.getElementById('entry-box').style.display = 'none';
            document.getElementById('chat-box').style.display = 'block';

            // Show chat input
            document.querySelector('.chat-input').style.display = 'flex';

            socket.emit('join', { nickname: nickname });
        }
    });

    document.getElementById('sendBtn').addEventListener('click', function () {
        const message = chatInput.value.trim();
        if (message) {
            socket.emit('message', { nickname: userNickname, message: message });
            chatInput.value = '';
        }
        chatInput.focus();
    });
    
    // Enter 키를 눌렀을 때 메시지 전송
    chatInput.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            document.getElementById('sendBtn').click();
        }
    });

    // window.addEventListener('beforeunload', function() {
    //     if (userNickname) {
    //         socket.emit('leave', { nickname: userNickname });
    //     }
    // });

    // 사용자가 브라우저 창이나 탭을 닫을 때의 이벤트 핸들러
    window.addEventListener('beforeunload', function () {
        if (userNickname) {
            socket.emit('client_disconnect', { nickname: userNickname });
        }
    });
});


