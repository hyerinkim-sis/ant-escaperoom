const gameConfig = {
    "button": {
        "floatDistance": "20px",
        "floatDuration": "2s"
    },
    "typeSpeed": 80,
    "subtitleSpeed": 40,
    "scenes": [
        {
            "id": 1,
            "type": "lobby",
            "image": "assets/로비.png",
            "buttonText": "시작하기",
            "autoNext": 0,
            "bgm": "",
            "subtitles": []
        },
        {
            "id": 2,
            "type": "illustration",
            "image": "assets/삽화1 일꾼개미 닉.png",
            "autoNext": 3000,
            "bgm": "assets/BGM0.mp3",
            "subtitles": [
                {
                    "text": "여러분은 일꾼 개미 닉입니다.",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 2000
                },
                {
                    "text": "소중한 앤트 동산을 지키는 모험을 떠나보아요!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1000
                }
            ]
        },
        {
            "id": 3,
            "type": "illustration",
            "image": "assets/삽화2.png",
            "autoNext": 3000,
            "bgm": "assets/BGM1.mp3",
            "subtitles": [
                {
                    "text": "평화로운 앤트 동산",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "이곳에서 개미들은 열심히 일하고 있었습니다.",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "저기 앞에 동료들과 행복하게 일하는 닉도 보이네요~",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1800
                },
                {
                    "text": "키야~ 앤트스튜디오에서 일하기 너무 좋다!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "한잔해~",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 200
                }
            ]
        },
        {
            "id": 4,
            "type": "illustration",
            "image": "assets/삽화3.png",
            "bgm": "assets/BGM2.mp3",
            "autoNext": 3000,
            "subtitles": [
                {
                    "text": "그러던 어느 날.\n",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "쥐 맥스가 개미 동산에 나타났습니다.",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 2000
                },
                {
                    "text": "개미들은 너무 놀라 혼비백산 달아났고\n앤트동산이 아수라장이 되었어요!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 2000
                },
                {
                    "text": "다들 무사해야 할텐데...!!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 700
                }
            ]
        },
        {
            "id": 5,
            "type": "illustration",
            "image": "assets/삽화4.png",
            "bgm": "assets/BGM2.mp3",
            "autoNext": 3000,
            "subtitles": [
                {
                    "text": "결국 쥐 맥스는 우리 일꾼개미들을 지켜준\n자랑스런 병정개미 알렉스를 납치해갔어요.",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 2000
                },
                {
                    "text": "\"알렉스!!!\"",
                    "fontSize": 34,
                    "bottom": 10,
                    "pauseMs": 800
                },
                {
                    "text": "\"맛있겠다. 찍찍! 초장 찍어 먹어야지. 찍찍!\"",
                    "fontSize": 30,
                    "bottom": 10,
                    "pauseMs": 1200
                },
                {
                    "text": "아무래도 맥스는 배가 고파서\n[15분]내로 알렉스를 먹을 것 같아요!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "우릴 지켜준 소중한 동료. 이제는 우리가 지켜야할 때가 됐어요!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 700
                }
            ]
        },
        {
            "id": 6,
            "type": "illustration",
            "image": "assets/삽화5.png",
            "bgm": "assets/BGM3.mp3",
            "autoNext": 3000,
            "subtitles": [
                {
                    "text": "일꾼개미인 당신은 쥐가 아무리 무서워도 다짐합니다.\n",
                    "fontSize": 28,
                    "bottom": 15,
                    "pauseMs": 1200
                },
                {
                    "text": "어떻게든 병정개미를 구하기로!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 2000
                },
                {
                    "text": "어떻게 해야할까...",
                    "fontSize": 30,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "우선 당장 앤트 사무실로 가서 책사개미를 찾아가야겠어요!",
                    "fontSize": 30,
                    "bottom": 10,
                    "pauseMs": 1500
                },
                {
                    "text": "사무실 입구로 들어가자!",
                    "fontSize": 28,
                    "bottom": 10,
                    "pauseMs": 700
                }
            ]
        },
        {
            "id": 7,
            "type": "ending",
            "image": "",
            "text": "사무실 입구로 들어가자",
            "buttonText": "처음으로",
            "autoNext": 0,
            "bgm": "assets/BGM3.mp3",
            "subtitles": []
        }
    ]
};