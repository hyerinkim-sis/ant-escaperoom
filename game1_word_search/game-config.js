window.wordGameConfig = {
  "text": {
    "typeSpeedMs": 45,
    "revealMode": "typewriter"
  },
  "audio": {
    "bgmVolume": 0.7
  },
  "ingame": {
    "backgroundImage": "assets/game2.png",
    "bubbleImage": "",
    "cursorEmoji": "🔍",
    "phaseTextStyle": {
      "x": 50,
      "y": 20,
      "fontSize": 28,
      "align": "center",
      "color": "#ffffff"
    },
    "progressStyle": {
      "x": 50,
      "y": 86,
      "fontSize": 22,
      "align": "center",
      "color": "#ffffff"
    }
  },
  "phases": [
    {
      "id": "phase1",
      "text": "지금 누가 잡혀간 상황이지?",
      "answer": "ALEX",
      "progressSeed": "----"
    },
    {
      "id": "phase2",
      "text": "누가 알렉스를 잡아갔지?",
      "answer": "MAX",
      "progressSeed": "---",
      "bubbleMask": {
        "enabled": true,
        "delayMs": 400,
        "fadeInMs": 300,
        "holdMs": 900,
        "fadeOutMs": 300,
        "repeatEnabled": true,
        "repeatIntervalMs": 2600,
        "repeatCount": 0
      }
    },
    {
      "id": "phase3",
      "text": "나는 왜 책사개미를 찾아왔지?",
      "answer": "HELP",
      "progressSeed": "H---",
      "bubbleMask": {
        "enabled": true,
        "delayMs": 250,
        "fadeInMs": 500,
        "holdMs": 1200,
        "fadeOutMs": 500,
        "repeatEnabled": true,
        "repeatIntervalMs": 2800,
        "repeatCount": 0
      }
    }
  ],
  "failureScreen": {
    "text1": {
      "text": "힌트1 차감",
      "style": {
        "x": 50,
        "y": 42,
        "fontSize": 54,
        "align": "center",
        "color": "#ffffff"
      }
    },
    "text2": {
      "text": "이렇게 알렉스는 구할 수 없게 되는것인가...\n\n아니,\n다시 해보는 거야!",
      "style": {
        "x": 50,
        "y": 56,
        "fontSize": 22,
        "align": "center",
        "color": "#ffffff"
      }
    }
  },
  "scenes": {
    "scene1": {
      "bgm": "assets/bgm1.mp3",
      "layers": [
        "assets/image1 (1).png",
        "assets/image1 (2).png",
        "assets/image1 (3).png",
        "assets/image1 (4).png"
      ],
      "knockRequired": 3,
      "text1": {
        "text": "문을 두드려보자",
        "style": {
          "x": 50,
          "y": 80,
          "fontSize": 40,
          "align": "center",
          "color": "#e68600"
        },
        "boxEnabled": false,
        "boxStyle": {
          "wPct": 92,
          "hPct": 10,
          "padY": 16,
          "padX": 18,
          "radius": 16,
          "minHeightPct": 0
        }
      },
      "text2": {
        "text": "???: 누가 함부로 이곳으로 보낸거지?",
        "style": {
          "x": 50,
          "y": 80,
          "fontSize": 40,
          "align": "center",
          "color": "#ffffff"
        },
        "boxEnabled": true,
        "boxStyle": {
          "wPct": 92,
          "padY": 16,
          "padX": 18,
          "radius": 16,
          "minHeightPct": 0,
          "hPct": 10
        }
      },
      "hearts": {
        "count": 3,
        "style": {
          "x": 50,
          "y": 34,
          "size": 18,
          "gap": 8,
          "align": "center"
        }
      },
      "quizBox": {
        "style": {
          "x": 50,
          "y": 52,
          "w": 520,
          "padding": 18,
          "radius": 18
        },
        "prompt": "암호를 입력하세요",
        "placeholder": "정답을 입력하세요",
        "submitText": "확인",
        "wrongConsumesHeart": 1,
        "boardJamos": [
          "ㄱ",
          "ㅕ",
          "ㅇ",
          "ㅂ",
          "ㅣ",
          "ㅐ",
          "ㅁ",
          "ㅈ",
          "ㄷ",
          "ㅅ",
          "ㄴ",
          "ㅍ",
          "ㅊ",
          "ㅏ",
          "ㅜ",
          "ㅡ",
          "ㅔ",
          "ㅛ",
          "ㅗ",
          "←"
        ],
        "quizJamos": [
          "ㄱ",
          "ㅕ",
          "ㅇ",
          "ㅂ",
          "ㅣ",
          "ㄱ",
          "ㅐ",
          "ㅁ",
          "ㅣ"
        ]
      },
      "layerMove": {
        "layer2MoveXvw": -30,
        "layer3MoveXvw": 30,
        "moveDurationMs": 2000
      },
      "zoomFade": {
        "zoomTo": 3,
        "zoomMs": 2000,
        "fadeMs": 1500
      },
      "nextSceneId": "scene2",
      "imgFadeInMs": 1000,
      "imgShake": false
    },
    "scene2": {
      "bgm": "assets/BGM2.mp3",
      "image": "assets/image2.png",
      "fadeInMs": 500,
      "fadeOutMs": 450,
      "texts": [
        "크흐흠.. 중요한 시간에에 불쾌하군.",
        "날 방해한 마땅한 사유가 있어야 할 것이야.",
        "헉... 하필 중요한 순간을 방해했다."
      ],
      "textStyle": {
        "x": 50,
        "y": 72,
        "fontSize": 26,
        "align": "center",
        "color": "#ffffff"
      },
      "advance": {
        "mode": "timer",
        "delayMs": 1800
      },
      "nextSceneId": "scene3",
      "subtitles": [
        {
          "text": "크흐흠..",
          "x": 50,
          "y": 86,
          "fontSize": 30,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 10
          }
        },
        {
          "text": "중요한 시간에 불쾌하군.",
          "x": 50,
          "y": 86,
          "fontSize": 35,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 10
          }
        },
        {
          "text": "헉... 설마 중요한 일이라는게...",
          "x": 50,
          "y": 85.9,
          "fontSize": 35,
          "color": "#c7c7c7",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 10
          }
        },
        {
          "text": "너는 우리 종족을 위한 일을 방해했어.",
          "x": 50,
          "y": 85.8,
          "fontSize": 35,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 9.9
          }
        },
        {
          "text": "얼마나 큰 사태인건지는 알겠지?",
          "x": 50,
          "y": 86,
          "fontSize": 35,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 10
          }
        },
        {
          "text": "아니 가뜩이나 모태솔로라 슬픈데 너무해!!",
          "x": 50,
          "y": 86,
          "fontSize": 35,
          "color": "#c7c7c7",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxEnabled": true,
          "boxStyle": {
            "hPct": 9.9
          }
        },
        {
          "text": "날 방해한 마땅한 사유가 있어야 할 것이야.",
          "x": 50,
          "y": 86,
          "fontSize": 35,
          "color": "#ff0000",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 60,
          "boxEnabled": true,
          "boxStyle": {
            "hPct": 9.8
          }
        }
      ],
      "imgFadeInMs": 500,
      "imgShake": false
    },
    "scene3": {
      "bgm": "assets/BGM3.mp3",
      "image": "assets/game1.png",
      "text": {
        "text": "젠장... 나 일꾼개미라 말 못하는데...\n자칫하다가 책사개미가 날 처형시킬지도 몰라!\n어서... 뭐라도 말해보자",
        "style": {
          "x": 50,
          "y": 68,
          "fontSize": 24,
          "align": "center",
          "color": "#ffffff"
        }
      },
      "startButton": {
        "text": "시작",
        "style": {
          "x": 50,
          "y": 50,
          "fontSize": 22,
          "paddingX": 52,
          "paddingY": 18
        }
      },
      "nextSceneId": "scene4",
      "subtitles": [
        {
          "text": "젠장... 나 일꾼개미라 말 못하는데... ",
          "x": 50,
          "y": 86,
          "fontSize": 40,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxEnabled": true,
          "boxStyle": {
            "hPct": 10
          }
        },
        {
          "text": "잘못 말하다가 책사개미가 날 처형시킬지도 몰라!",
          "x": 50,
          "y": 86,
          "fontSize": 40,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxEnabled": true,
          "boxStyle": {
            "hPct": 9.9
          }
        },
        {
          "text": "어서... 뭐라도 말해보자!",
          "x": 50,
          "y": 86,
          "fontSize": 40,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxEnabled": true,
          "boxStyle": {
            "hPct": 10
          }
        }
      ],
      "imgFadeInMs": 500,
      "imgShake": true
    },
    "scene4": {
      "bgm": "assets/BGM4.mp3",
      "successNextSceneId": "scene5",
      "failNextSceneId": "fail",
      "phaseClearOverlays": [
        {
          "title": "\"ALEX가 잡혀갔어요!!!\"",
          "subtitle": "'그 다음은 누가 잡아갔었지?' [- - -]"
        },
        {
          "title": "\"MAX가 잡아갔어요!!!\"",
          "subtitle": "'그래서 나는 뭐 떄문에 온거지?' [H - - -]"
        },
        {
          "title": "\"도와주세요!!!\"",
          "subtitle": "기록: {time}최고: {best}"
        }
      ]
    },
    "scene5": {
      "bgm": "assets/BGM5.mp3",
      "image": "assets/image3.png",
      "texts": [
        "..."
      ],
      "textStyle": {
        "x": 50,
        "y": 72,
        "fontSize": 26,
        "align": "center",
        "color": "#ffffff"
      },
      "startOverButton": {
        "text": "처음부터",
        "style": {
          "x": 50,
          "y": 50,
          "fontSize": 22,
          "paddingX": 52,
          "paddingY": 18
        }
      },
      "nextSceneId": "scene1",
      "subtitles": [
        {
          "text": "뭐? 쥐 맥스가 병정개미 알렉스를 납치해갔다고?!",
          "x": 49.3,
          "y": 86,
          "fontSize": 26,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 10
          },
          "boxEnabled": true
        },
        {
          "text": "쥐 맥스가 남긴 흔적이라도 있나?",
          "x": 50,
          "y": 85.8,
          "fontSize": 26,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 9.8
          }
        },
        {
          "text": "헉... 흔적... 어떻게 알 수 있지?",
          "x": 50,
          "y": 86,
          "fontSize": 26,
          "color": "#c2c2c2",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 9.9
          }
        },
        {
          "text": "우선 밖에서 좌표라도 알아야겠군!!",
          "x": 50,
          "y": 86,
          "fontSize": 26,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 9.8
          }
        },
        {
          "text": "어서 다녀오게나!",
          "x": 50,
          "y": 86,
          "fontSize": 26,
          "color": "#ffffff",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 12
          }
        },
        {
          "text": "나가서 페로몬 경로를 얻어와서 보고하자!",
          "x": 50,
          "y": 85.9,
          "fontSize": 26,
          "color": "#ff7b00",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxStyle": {
            "hPct": 10
          }
        },
        {
          "text": "대충 \"프린터기\"가 있는 쪽에서 납치 당했던 것 같은데...",
          "x": 50,
          "y": 85.8,
          "fontSize": 26,
          "color": "#ff9500",
          "align": "center",
          "delayMs": 1800,
          "typeSpeedMs": 45,
          "boxEnabled": true,
          "boxStyle": {
            "hPct": 10
          }
        }
      ],
      "imgFadeInMs": 500,
      "imgShake": true
    }
  },
  "gameplay": {
    "targetWord": "ALEX",
    "timeLimitSeconds": 30,
    "hearts": 5,
    "bubbleCount": 20,
    "bubbleSpeed": 500,
    "bubbleSize": 100,
    "wrongConsumesHeart": 1,
    "resetProgressOnWrong": true
  },
  "lobby": {
    "backgroundImage": "assets/game1.png",
    "speechBubbleImage": "assets/말풍선.png",
    "startButtonText": "시작"
  }
};
