const gameConfig = {
    "title": "앤트축제 - 힌트 페이지",
    "background": "assets/hint_bg.png",
    "bottomImage": "assets/hint_bottom.png",
    "emoji": "🐜",
    "ant": {
        "src": "assets/순찰개미.png",
        "sizePx": 100
    },
    "dialogue": {
        "text": "<span> -순찰개미일지- </span> </br> [ 패로몬 냄새 경로가 포착됨 ]",
        "text2": "",
        "style": {
            "top": "15%",
            "fontSize": "1.2rem",
            "blur": 15,
            "opacity": 0.4
        }
    },
    "bgm": {
        "src": "assets/BGM.mp3",
        "volume": 0.6,
        "enabled": true
    },
    "quiz": {
        "problem": "대체 어디로 잡혀간걸까?",
        "placeholder": "",
        "answer": "스릴러",
        "caseInsensitive": true,
        "wrongMessage": "틀렸습니다. 다시 시도해보세요.",
        "hintText": ""
    },
    "resultScene": {
        "text1": "스릴러로 잡혀갔다고?! 가보자!!\n가서 순찰개미일지의 패턴과 일치하는지 검토를 하자.",
        "backButtonText": "돌아가기"
    },
    "movement": {
        "fadeOutSeconds": 1.2,
        "sequences": [
            {
                "points": [
                    {
                        "xPercent": -8,
                        "yPercent": 8
                    },
                    {
                        "xPercent": -8,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": 8
                    }
                ],
                "speed": 0.6,
                "padding": 0.1,
                "blockPadding": 1
            },
            {
                "points": [
                    {
                        "xPercent": -8,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": 0
                    },
                    {
                        "xPercent": -8,
                        "yPercent": 0
                    },
                    {
                        "xPercent": -8,
                        "yPercent": 8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": 8
                    }
                ],
                "speed": 0.6,
                "padding": 0.1,
                "blockPadding": 1
            },
            {
                "points": [
                    {
                        "xPercent": 0,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 0,
                        "yPercent": 8
                    }
                ],
                "speed": 0.6,
                "padding": 0.1,
                "blockPadding": 1
            },
            {
                "points": [
                    {
                        "xPercent": -8,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": -8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": 0
                    },
                    {
                        "xPercent": -8,
                        "yPercent": 0
                    },
                    {
                        "xPercent": -8,
                        "yPercent": 8
                    },
                    {
                        "xPercent": 8,
                        "yPercent": 8
                    }
                ],
                "speed": 0.6,
                "padding": 0.1,
                "blockPadding": 1
            }
        ]
    }
};