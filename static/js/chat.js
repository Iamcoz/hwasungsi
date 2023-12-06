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
        // onlineCount.textContent = "현재 접속자 수: " + 0 + "명";
    });

    // 소켓 연결에 대한 에러 처리
    socket.on('connect_error', (error) => {
        console.error('Connection Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('system-message'); // 시스템 메시지 스타일 적용
        errorMessage.textContent = "서버와의 연결이 끊어졌습니다.";
        chatMessages.appendChild(errorMessage);
    });

    // 소켓 연결 해제 시 처리
    socket.on('disconnect', (reason) => {
        console.warn('Disconnected:', reason);
        const disconnectMessage = document.createElement('div');
        disconnectMessage.classList.add('system-message');
        disconnectMessage.textContent = "서버와의 연결이 끊어졌습니다.";
        chatMessages.appendChild(disconnectMessage);

        // 채팅 입력창 비활성화
        chatInput.disabled = true;
        document.getElementById('sendBtn').disabled = true;
    });

    // 소켓 연결 성공 시 처리
    socket.on('connect', () => {
        console.log('Connected to server');
        const disconnectMessage = document.createElement('div');
        disconnectMessage.classList.add('system-message');
        disconnectMessage.textContent = "서버와 연결되었습니다.";
        chatMessages.appendChild(disconnectMessage);

        // 채팅 입력창 활성화
        chatInput.disabled = false;
        document.getElementById('sendBtn').disabled = false;
    });

    let userNickname = null;
    document.getElementById('startChat').addEventListener('click', function () {
        const nickname = document.getElementById('nickname-entry').value.trim();

        // Check if the nickname contains any bad words
        if (BadWordFilter.Check(nickname, 'ko')) {
            // Handle the case where the nickname contains bad words (e.g., show an error message)
            // You can add your error handling logic here
        } else {
            userNickname = filterNickname(nickname);

            if (userNickname) {
                // Hide entry box and show chat box
                document.getElementById('entry-box').style.display = 'none';
                document.getElementById('chat-box').style.display = 'block';

                // Show chat input
                document.querySelector('.chat-input').style.display = 'flex';

                socket.emit('join', { nickname: userNickname });
            }
        }
    });

    // 메시지 전송
    document.getElementById('sendBtn').addEventListener('click', function () {
        const message = chatInput.value.trim();

        // Check if the message contains any bad words
        if (BadWordFilter.Check(message, 'ko')) {
            // Handle the case where the message contains bad words (e.g., show an error message)
            // You can add your error handling logic here
        } else {
            // Replace bad words with '♡'
            const filteredMessage = BadWordFilter.Replace(message, 'ko');

            socket.emit('message', { nickname: userNickname, message: filteredMessage });
            chatInput.value = '';
            chatInput.focus();  // 메시지 전송 후 다시 입력 필드에 포커스 맞춤
        }
    });


    // Enter 키를 눌렀을 때 메시지 전송
    chatInput.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            document.getElementById('sendBtn').click();
        }
    });

    // 사용자가 브라우저 창이나 탭을 닫을 때의 이벤트 핸들러
    window.addEventListener('beforeunload', function () {
        if (userNickname) {
            socket.emit('client_disconnect', { nickname: userNickname });
        }
    });
});
