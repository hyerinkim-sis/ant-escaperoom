const gameConfig = {
    "title": "경로찾기",
    "bgm": "assets/bgm.mp3",
    "quizScene": {
        "topText": {
            "text": "흔적을 찾아냈나?",
            "style": {
                "x": 50,
                "y": 30,
                "fontSize": 60,
                "color": "#d4810c",
                "align": "center",
                "outlineWidth": 1,
                "outlineColor": "#000000"
            }
        },
        "problem": "어떠한 모양으로\n페로몬 흔적이 있는 것 같은데...\n[- - - -]",
        "answer": "0601",
        "backgroundImage": "assets/삽화6.png",
        "cardStyle": {
            "x": 50,
            "y": 80,
            "widthPercent": 90,
            "padding": 10,
            "radius": 20,
            "bgOpacity": 0.1,
            "blur": 5,
            "borderOpacity": 0.12
        },
        "text": "흔적을 찾아냈나?"
    },
    "listScene": {
        "backgroundImage": "",
        "layout": {
            "containerPaddingTop": 32,
            "containerPaddingX": 16,
            "containerPaddingBottom": 16,
            "footerExtraBottomPadding": 120,
            "itemGap": 40,
            "imageTextGap": 20,
            "textPaddingX": 20
        },
        "textStyle": {
            "fontSize": 18,
            "color": "#f5f5f5",
            "align": "center"
        },
        "items": [
            {
                "image": "assets/삽화9.png",
                "text": "0601... 그곳에서 납치되었나!\n쥐 맥스의 행동패턴은 동서남북을 가리지 않던데...\n하지만, 어느정도 경로 예측을 할 순 있어.\n만약 주변에 발자국이 있다면 잘 찾아서 조합해보면 알 수 있을거야!"
            },
            {
                "image": "assets/문제1.png",
                "text": "보통 맥스는 아침에는 높은 곳에있다가,\n점심에는 풀숲, 저녁에는 더러운 길바닥에 있더군.\n그렇게 새벽에는 먹이가 있는 곳에서 잠들고 있지. \n \n맥스의 발자국을 통해 힌트를 찾았다면 \n서재의 비밀서적이 있는 V섹션의 보안일지 정보를 열람하게나."
            }
        ],
        "backButtonText": "처음으로 돌아가기"
    }
};