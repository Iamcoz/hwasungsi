/*
 * 텍스트에 욕설이 있는지 확인합니다.
 */
BadWordFilter.Check = METHOD({

	run: (params) => {
		//REQUIRED: params
		//REQUIRED: params.message
		//REQUIRED: params.language

		let message = params.message;
		let language = params.language;

		let db = BadWordFilter.DB[language];

		if (message !== undefined && message !== TO_DELETE && db !== undefined) {
			let isBadWordExists = false;

			let check = (badWord) => {
				for (let i = 0; i < message.length; i += 1) {
					let isMatched = true;
					let spaceCount = 0;
					let fcCount = 0;

					for (let j = 0; j < badWord.length; j += 1) {
						if (i + j + fcCount >= message.length) {
							isMatched = false;
							break;
						} else {
							let c = message[i + j + fcCount];

							// 영어가 아닌 경우 띄어쓰기 무시
							if (language !== 'en' && c === ' ') {
								spaceCount += 1;
								fcCount += 1;
								j -= 1;
							}
							// 한국어는 숫자 및 특수문자도 막기
							else if (language === 'ko' && '1234567890`~!@#$%^&*()-_=+[{]}\\|	;:\'",<.>/?'.indexOf(c) !== -1) {
								fcCount += 1;
								j -= 1;
							}
							else if (c.toLowerCase() !== badWord[j]) {
								isMatched = false;
								break;
							}
						}
					}

					if (isMatched === true) {
						let start = i;
						let last = i + badWord.length - 1 + fcCount;

						// 영어의 경우 좌우가 문자열의 끝이거나 띄어쓰기가 있어야 함
						// 대소문자로 단어 체크
						if (language === 'en') {
							if ((start === 0 || message[start - 1] === ' ' || (message[start - 1] === message[start - 1].toLowerCase() && message[start] === message[start].toUpperCase())) &&
								(last + 1 === message.length || message[last + 1] === ' ' || (message[last] === message[last].toLowerCase() && message[last + 1] === message[last + 1].toUpperCase()))) {
								isBadWordExists = true;
								return;
							}
						}

						// 한국어의 경우 띄어쓰기가 있을 때 좌우에 띄어쓰기가 없으면 무시
						else if (language === 'ko') {
							if (spaceCount === 0 || (
									(start === 0 || message[start - 1] === ' ') &&
									(last + 1 === message.length || message[last + 1] === ' '))) {
								isBadWordExists = true;
								return;
							}
						} else {
							isBadWordExists = true;
							return;
						}
					}
				}
			};

			EACH(db, (badWord) => {
				check(badWord);

				// 영어에서는 i를 !로 쓰는 경우가 있음
				if (isBadWordExists !== true && language === 'en' && badWord.indexOf('!') !== -1) {
					check(badWord.replace(/!/g, 'i'));
				}

				if (isBadWordExists === true) {
					return false;
				}
			});
			return isBadWordExists;
		}
		return false;
	}
});