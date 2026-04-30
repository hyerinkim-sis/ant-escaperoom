window.gameConfig = {
  "text": {
    "typeSpeedMs": 40,
    "revealMode": "typewriter",
    "autoAdvanceGapMs": 1500,
    "autoAdvanceLastGapMs": 2000
  },
  "audio": {
    "bgmVolume": 1,
    "hitSfx": "assets/sfx.wav",
    "sfxVolume": 0.85
  },
  "scenes": {
    "scene1": {
      "id": "scene1",
      "type": "dialogue",
      "image": "assets/image1.png",
      "dialogues": [
        {
          "speaker": "닉",
          "text": "[치즈]와 [궁극의 무기]란 걸 가져왔습니다!",
          "typeSpeedMs": 50,
          "fontSizeRem": 1.5,
          "speakerFontSizeRem": 1.5
        },
        {
          "speaker": "책사개미",
          "text": "좋아. 이걸로 나무막대 끝에 연결한다!",
          "typeSpeedMs": 50,
          "fontSizeRem": 1.5,
          "speakerFontSizeRem": 1.5
        }
      ],
      "buttonText": "",
      "nextSceneId": "scene2",
      "autoAdvance": true,
      "bgm": "assets/bgm1.mp3"
    },
    "scene2": {
      "id": "scene2",
      "type": "dialogue",
      "image": "assets/image2.png",
      "dialogues": [
        {
          "speaker": "책사개미",
          "text": "그리고 우리는 궁극기 \"냥냥펀치\"로\n맥스를 직접 소탕한다!",
          "typeSpeedMs": 50,
          "fontSizeRem": 1.5,
          "speakerFontSizeRem": 1.5
        },
        {
          "speaker": "맥스",
          "text": "찍찍!! 건방지다 찍찍!!\n모조리 뭉개주마 찍찍!!!",
          "isInstruction": false,
          "fontSizeRem": 2,
          "speakerFontSizeRem": 1.5
        },
        {
          "speaker": "시스템",
          "text": "(막대를 길게 늘려 앞의 패드를 직접 눌러 쥐를 잡으세요.)\n* 책상 위에 올라가지 마세요",
          "isInstruction": true,
          "fontSizeRem": 2,
          "speakerFontSizeRem": 1.5
        }
      ],
      "buttonText": "소탕 시작",
      "nextSceneId": "scene3",
      "autoAdvance": true,
      "bgm": "assets/bgm1.mp3"
    },
    "scene3": {
      "id": "scene3",
      "type": "whack-a-rat",
      "nextSceneId": "scene4",
      "gameTime": 30,
      "title": "🐭 쥐 맥스 소탕 🐭",
      "desc": "(막대를 길게 늘려 앞의 패드를 직접 눌러 쥐를 잡으세요.)\n* 책상 위에 올라가지 마세요",
      "bgm": "assets/bgm2.mp3",
      "image": "assets/image2.png",
      "ratImage": "assets/mouse.png",
      "hitSfx": "assets/sfx.wav",
      "ratMaxHp": 50
    },
    "scene4": {
      "id": "scene4",
      "type": "dialogue",
      "image": "assets/image3.png",
      "dialogues": [
        {
          "speaker": "개미들",
          "text": "이겼다!!!!",
          "typeSpeedMs": 50,
          "fontSizeRem": 2,
          "speakerFontSizeRem": 1.5
        },
        {
          "speaker": "책사개미",
          "text": "정말 훌륭하군. 너는 우리 동산을 지켜냈어",
          "typeSpeedMs": 50,
          "speakerFontSizeRem": 1.5,
          "fontSizeRem": 1.5
        },
        {
          "speaker": "개미들",
          "text": "닉 최고!!!! 알렉스 최고!!!!",
          "speakerFontSizeRem": 1.5,
          "fontSizeRem": 1.5
        },
        {
          "speaker": "개미들",
          "text": "앤트 스튜디오 최고!!!",
          "speakerFontSizeRem": 1.5,
          "fontSizeRem": 2
        },
        {
          "speaker": "알렉스",
          "text": "고마워 닉. 덕분에 또 모두를 지킬 수 있게 됐어",
          "speakerFontSizeRem": 1.5,
          "fontSizeRem": 1.5
        },
        {
          "speaker": "닉",
          "text": "뭘...ㅎㅎ 나도 동료들과 함께라면 항상 즐겁게 일할 수 있어!",
          "fontSizeRem": 1.5,
          "speakerFontSizeRem": 1.5
        },
        {
          "speaker": "나레이션",
          "text": "그렇게 개미동산을 위협하던 쥐 맥스는\n냥냥펀치를 맞고 후퇴하게 되었고",
          "isInstruction": true,
          "speakerFontSizeRem": 1.5,
          "fontSizeRem": 1.5,
          "autoAdvanceGapMs": 1000
        },
        {
          "speaker": "나레이션",
          "text": "개미동산의 식구들은 평화를 되찾아\n행복하게 일하게 되었습니다.",
          "isInstruction": true,
          "isFinal": false,
          "fontSizeRem": 1.5,
          "speakerFontSizeRem": 1.5
        },
        {
          "speaker": "",
          "text": "CLEAR",
          "isFinal": true,
          "revealMode": "instant",
          "isInstruction": true,
          "fontSizeRem": 2
        }
      ],
      "buttonText": "처음으로",
      "nextSceneId": "scene0",
      "autoAdvance": true,
      "bgm": "assets/bgm3.mp3"
    },
    "scene0": {
      "id": "scene0",
      "type": "signal-challenge",
      "promptText": "가져왔나?\n그러면 신호를 보내주게나.\n(막대를 길게 늘려 앞의 패드를 직접 누르세요.)\n* 책상 위에 올라가지 마세요",
      "correctAnswer": "FIGHT",
      "nextSceneId": "scene1",
      "image": "assets/image1.png",
      "bgm": "assets/bgm1.mp3"
    }
  }
};