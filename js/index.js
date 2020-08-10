(() => {
    let yOffset = 0; // window.pageYoffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤위치보다 이전에 위치한 스크롤 섹션들의 높이의 합
    let currentScene = 0;
    let enterNewScene = false; // 새로운 신이 시작된 순간 true


    const sceneInfo = [
        {
            //0
            type : 'sticky',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-0'),
                messageA : document.querySelector('#scroll-section-0 .main-message.a'),
                messageB : document.querySelector('#scroll-section-0 .main-message.b'),
                messageC : document.querySelector('#scroll-section-0 .main-message.c'),
                messageD : document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values : {
                messageA_opacity_in : [0, 1, { start : 0.1, end : 0.2 }], // 시작 값, 끝 값
                messageA_translateY_in : [20, 0, { start : 0.1, end : 0.2 }],
                messageA_opacity_out : [1, 0, { start : 0.25, end : 0.3 }],
                messageA_translateY_out : [0, -20, { start : 0.25, end : 0.3 }],
                messageB_opacity_in : [0, 1, { start : 0.3, end : 0.4 }], // 시작 값, 끝 값
            }
        },
        {
            //1
            type : 'normal',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-1')
            }
        },
        {
            //2
            type : 'sticky',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-2')
            }
        },
        {
            //3
            type : 'sticky',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-3')
            }
        },
    ];


    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i =0; i< sceneInfo.length; i++) {
            if(sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            //style 이니까 px로
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;
        let totlaScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length; i++) {
            totlaScrollHeight += sceneInfo[i].scrollHeight;
            if(totlaScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        } 
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) {
        let returnValues = 0;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        // 현재 스크롤 위치 (신) / 현재 신의 전체 스크롤 높이

        if(values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                returnValues = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if( currentYOffset < partScrollStart ) {
                returnValues = values[0];
            } else if (currentYOffset > partScrollEnd ) {
                returnValues = values[1];
            }

        } else {
            returnValues =  scrollRatio * (values[1] - values[0]) + values[0];
        }


        return returnValues;
    }

    function playAnimation() {
        const { values, objs } = sceneInfo[currentScene];
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        const scrollRatio = currentYOffset /  scrollHeight; 

        console.log(objs.messageA.style.transform)
        switch (currentScene) {
            case 0:
                const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset)
                const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);
                objs.messageA.style.opacity = scrollRatio <= 0.22 ? messageA_opacity_in : messageA_opacity_out;
                objs.messageA.style.transform = scrollRatio <= 0.22 ? `translateY(${messageA_translateY_in}%)` : `translateY(${messageA_translateY_out}%)`
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;

            default :
                break;
        }
    }

    
    function scrollLoop() {
        enterNewScene = false;
        //현재 스크롤 하고 있는 위치
        prevScrollHeight = 0;
        for(let i=0; i < currentScene; i++) {
            prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
        };

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`)
            
        }

        if(yOffset < prevScrollHeight) {
            if(currentScene === 0) return;
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`)
        }

        if(enterNewScene) return;
        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    })
    window.addEventListener('load', setLayout);
    // window.addEventListener('DomContentLoaded', setLayout);
    window.addEventListener('resize', setLayout);
})();