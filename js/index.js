(() => {
    let yOffset = 0; // window.pageYoffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤위치보다 이전에 위치한 스크롤 섹션들의 높이의 합
    let currentScene = 0;
    let enterNewScene = false; // 새로운 신이 시작된 순간 true
    let delayedYoffset = 0;
    let rafId ;
    let rafState;

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

                canvas : document.querySelector('#video-canvas-0'),
                context : document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages : [],
            },
            values : {
                videoImageCount : 300,
                imageSequence : [0, 299],
                canvas_opacity : [1, 0, { start: 0.9, end : 1}],

                messageA_opacity_in : [0, 1, { start : 0.1, end : 0.2 }], // 시작 값, 끝 값
                messageB_opacity_in : [0, 1, { start : 0.3, end : 0.4 }], // 시작 값, 끝 값
                messageC_opacity_in : [0, 1, { start : 0.5, end : 0.6 }], // 시작 값, 끝 값
                messageD_opacity_in : [0, 1, { start : 0.7, end : 0.8 }], // 시작 값, 끝 값

                messageA_translateY_in : [20, 0, { start : 0.1, end : 0.2 }],
                messageB_translateY_in : [20, 0, { start : 0.3, end : 0.4 }],
                messageC_translateY_in : [20, 0, { start : 0.5, end : 0.6 }],
                messageD_translateY_in : [20, 0, { start : 0.7, end : 0.8 }],

                messageA_opacity_out : [1, 0, { start : 0.25, end : 0.3 }],
                messageB_opacity_out : [1, 0, { start : 0.45, end : 0.5 }],
                messageC_opacity_out : [1, 0, { start : 0.65, end : 0.7 }],
                messageD_opacity_out : [1, 0, { start : 0.85, end : 0.9 }],

                messageA_translateY_out : [0, -20, { start : 0.25, end : 0.3 }],
                messageB_translateY_out : [0, -20, { start : 0.45, end : 0.5 }],
                messageC_translateY_out : [0, -20, { start : 0.65, end : 0.7 }],
                messageD_translateY_out : [0, -20, { start : 0.85, end : 0.9 }],
            }
        },
        {
            //1
            type : 'normal',
            // heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
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
                container : document.querySelector('#scroll-section-2'),
                messageA : document.querySelector('#scroll-section-2 .a'),
                messageB : document.querySelector('#scroll-section-2 .b'),
                messageC : document.querySelector('#scroll-section-2 .c'),

                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),

                canvas : document.querySelector('#video-canvas-1'),
                context : document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages : [],
            },
            values : {
                videoImageCount : 960,
                imageSequence : [0, 959],

                canvas_opacity_in : [0, 1, { start: 0, end : 0.1}],
                canvas_opacity_out : [1, 0, { start: 0.95, end : 1}],

                messageA_opacity_in : [0, 1, { start : 0.25, end : 0.3 }],
                messageB_opacity_in : [0, 1, { start : 0.6, end : 0.65 }],
                messageC_opacity_in : [0, 1, { start : 0.87, end : 0.92 }],

                messageA_translateY_in : [20, 0, { start : 0.15, end : 0.2 }], // 5%
                messageB_translateY_in : [30, 0, { start : 0.6, end : 0.65 }], // 5%
                messageC_translateY_in : [30, 0, { start : 0.87, end : 0.92 }], // 5%

                messageA_opacity_out : [1, 0, { start : 0.4, end : 0.45}],
                messageB_opacity_out : [1, 0, { start : 0.68, end : 0.73}],
                messageC_opacity_out : [1, 0, { start : 0.95, end : 0.1}],

                messageA_translateY_out : [0, -20, { start : 0.4, end : 0.45}],
                messageB_translateY_out : [0, -20, { start : 0.68, end : 0.73}],
                messageC_translateY_out : [0, -20, { start : 0.95, end : 1}],

                pinB_scaleY: [0.5, 1, { start : 0.6, end : 0.65 }],
                pinC_scaleY: [0.5, 1, { start : 0.87, end : 0.92 }],
            }
        },
        {
            //3
            type : 'sticky',
            heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas : document.querySelector('.image-blend-canvas'),
                context : document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath : [
                    './images/blend-image-1.jpg',
                    './images/blend-image-2.jpg',
                ],
                images : [],
            },
            values : {
                rect1X : [0, 0, { start : 0, end : 0 }],
                rect2X : [0, 0, { start : 0, end : 0 }],

                imageBlendHeight : [0, 0, {start : 0, end : 0}],
                canvas_scale : [0, 0, {start : 0, end : 0}],
                rectStartY : 0,
                
                canvasCaption_opacity : [0, 1, { start : 0, end : 0 }],
                canvasCaption_translateY : [20, 0, { start : 0, end : 0 }],
            }
        },
    ];

    function setCanvasImages() {
        let imgElem ;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image(); // documnet.createElement('img');
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem2 ;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image(); // documnet.createElement('img');
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }

        let imgElem3;
        for(let i =0; i < sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3)
        }
    }

    function checkMenu() {
            yOffset > 44 ?
             document.body.classList.add('local-nav-sticky') :
             document.body.classList.remove('local-nav-sticky')
    }

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


        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        // 창사이즈에 맞춰서 높이가 맞춰짐
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

        switch (currentScene) {
            case 0:
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                objs.messageA.style.opacity = 
                scrollRatio <= 0.22 ? 
                calcValues(values.messageA_opacity_in, currentYOffset) :
                calcValues(values.messageA_opacity_out, currentYOffset);

                objs.messageA.style.transform = 
                scrollRatio <= 0.22 ? 
                `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`
                
                objs.messageB.style.opacity = 
                scrollRatio <= 0.42 ? 
                calcValues(values.messageB_opacity_in, currentYOffset) :
                calcValues(values.messageB_opacity_out, currentYOffset);
                
                objs.messageB.style.transform = 
                scrollRatio <= 0.42 ? 
                `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`

                objs.messageC.style.opacity = 
                scrollRatio <= 0.62 ? 
                calcValues(values.messageC_opacity_in, currentYOffset) :
                calcValues(values.messageC_opacity_out, currentYOffset);
                
                objs.messageC.style.transform = 
                scrollRatio <= 0.62 ? 
                `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`

                objs.messageD.style.opacity = 
                scrollRatio <= 0.82 ? 
                calcValues(values.messageD_opacity_in, currentYOffset) :
                calcValues(values.messageD_opacity_out, currentYOffset);
                
                objs.messageD.style.transform = 
                scrollRatio <= 0.82 ? 
                `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`
                break;
            case 2:
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
            
                objs.canvas.style.opacity = scrollRatio <= 0.5 ? 
                calcValues(values.canvas_opacity_in, currentYOffset) :
                calcValues(values.canvas_opacity_out, currentYOffset)


                objs.messageA.style.opacity = 
                scrollRatio <= 0.32 ? 
                calcValues(values.messageA_opacity_in, currentYOffset) :
                calcValues(values.messageA_opacity_out, currentYOffset);

                objs.messageA.style.transform = 
                scrollRatio <= 0.32 ? 
                `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`
                
                objs.messageB.style.opacity = 
                scrollRatio <= 0.67 ? 
                calcValues(values.messageB_opacity_in, currentYOffset) :
                calcValues(values.messageB_opacity_out, currentYOffset);
                
                objs.messageB.style.transform = 
                scrollRatio <= 0.67 ? 
                `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`

                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})` ;                

                objs.messageC.style.opacity = 
                scrollRatio <= 0.93 ? 
                calcValues(values.messageC_opacity_in, currentYOffset) :
                calcValues(values.messageC_opacity_out, currentYOffset);
                
                objs.messageC.style.transform = 
                scrollRatio <= 0.93 ? 
                `translate3d(${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)` :
                `translate3d(${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`

                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;

                // 3번 씬에서 사용 되는 캔버스를 미리 그려주기
                if(scrollRatio > 0.9) {
                    const { objs, values } = sceneInfo[3];
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio;

                    if(widthRatio <= heightRatio) {
                        // 캔버스 보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스 보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio;
                    }
    
                    objs.context.fillStyle = 'white';
                    objs.context?.drawImage(objs?.images?.[0], 0, 0);
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`
                    // scale 은 확대 축소
    
                    //캔버스 사이즈에 맞춰 가정한 innerWidth 와 innerHeight
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
    
                    // objs.canvas.getBoundingClientRect();
                    //  DOM 에 대한 정보를 얻을 수 있음
    
                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    // x 시작 좌표
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    // x 끝 좌표
                    values.rect2X[0] = recalculatedInnerWidth + values.rect1X[0] - whiteRectWidth;
                    // x 시작 좌표                
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
                    // x 끝 좌표
    
                    // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth, 10), recalculatedInnerHeight);
                    // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth, 10), recalculatedInnerHeight);
                    objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), recalculatedInnerHeight);
                    // x,y,with,hieght
                    objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), recalculatedInnerHeight);
                }

                break;
            case 3:
                let step = 0;
                //가로세로 모두 꽉 차게 하기 위해 여기서 세팅
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;
                if(widthRatio <= heightRatio) {
                    // 캔버스 보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스 보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.context.fillStyle = 'white';
                objs.context?.drawImage(objs?.images?.[0], 0, 0);
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`
                // scale 은 확대 축소

                //캔버스 사이즈에 맞춰 가정한 innerWidth 와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                // objs.canvas.getBoundingClientRect();
                //  DOM 에 대한 정보를 얻을 수 있음

                if(!values.rectStartY) {
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                // x 시작 좌표
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                // x 끝 좌표
                values.rect2X[0] = recalculatedInnerWidth + values.rect1X[0] - whiteRectWidth;
                // x 시작 좌표                
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
                // x 끝 좌표

                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth, 10), recalculatedInnerHeight);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth, 10), recalculatedInnerHeight);
                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), recalculatedInnerHeight);
                // x,y,with,hieght
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), recalculatedInnerHeight);
                
                if(scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    objs.canvas.classList.remove('sticky')
                } else {
                    step = 2;
                    //이미지 블랜드
                    values.imageBlendHeight[0] = 0;
                    values.imageBlendHeight[1] = objs.canvas.height;
                    values.imageBlendHeight[2].start = values.rect1X[2].end;
                    values.imageBlendHeight[2].end = values.imageBlendHeight[2].start + 0.2;
                    const blendHeight = calcValues(values.imageBlendHeight, currentYOffset);
                    // blendHeight 는 점점 작아짐( canvasheigth 스크롤을 내릴수록 같아지기 때문에)
                    // (애니메이션시작을 기준으로) 스크롤 위치 * 20%(섹션 스크롤 heigth 의 20% === 이미지 높이) === blendHeight 
                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                    );

                    objs.canvas.classList.add('sticky')
                    objs.canvas.style.top =`${(objs.canvas.height - (objs.canvas.height * canvasScaleRatio)) / 2 * -1}px`;

                    if(scrollRatio > values.imageBlendHeight[2].end) {
                        values.canvas_scale[0] = canvasScaleRatio
                        values.canvas_scale[1] = document.body.offsetWidth / (objs.canvas.width * 1.5);
                        values.canvas_scale[2].start = values.imageBlendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = `0px`;

                    } 
                    
                    if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
                        objs.canvas.classList.remove('sticky')
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;
                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);

                        values.canvasCaption_translateY[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_translateY[2].start + 0.1;

                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`; 

                        
                    }
                }
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

        if(delayedYoffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`)
            
        }

        if(delayedYoffset < prevScrollHeight) {
            if(currentScene === 0) return;
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`)
        }

        if(enterNewScene) return;
        playAnimation();
    }



    function loop() {
        delayedYoffset = delayedYoffset + (yOffset - delayedYoffset) * 0.1;

        if(!enterNewScene) {
            if(currentScene === 0 || currentScene === 2) {
                const currentYOffset = delayedYoffset - prevScrollHeight;
                const { values, objs } = sceneInfo[currentScene];
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if(objs?.videoImages[sequence]) {
                    objs?.context?.drawImage(objs?.videoImages[sequence], 0, 0);                
                }
            }
            // if(currentScene === 3) {
            //     const currentYOffset = delayedYoffset - prevScrollHeight;
            //     const { values, objs } = sceneInfo[currentScene];
            //     let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
            //     if(objs?.videoImages[sequence]) {
            //         objs?.context?.drawImage(objs?.videoImages[sequence], 0, 0);                
            //     }            
            // }
        }

        rafId = requestAnimationFrame(loop)

        if(Math.abs(pageXOffset - delayedYoffset) < 1) {
            cancelAnimationFrame(rafId)
            rafState = false;
        }
    }

    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

        let tempYoffset = yOffset;
        let tempScrollCount = 0;
        if(yOffset > 0) {
            let interval =  setInterval(() => {
                window.scrollTo(0, tempYoffset);
                tempYoffset += 5;
                tempScrollCount > 20 && tempScrollCount && clearInterval(interval)
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();
            if(!rafState) {
                rafId = requestAnimationFrame(loop); 
                rafState = true;
            }
        })

        window.addEventListener('resize', () => {
            if( window. innerWidth > 900 ) {
                setLayout();
                sceneInfo[3].values.rectStartY = 0;
            }
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                setLayout();
            }, (200));
        });

        document.querySelector('.loading').addEventListener('transitionend', (e) => {
            document.body.removeChild(e.currentTarget)
        })
    });
    // window.addEventListener('DomContentLoaded', setLayout);
    setCanvasImages()

})();