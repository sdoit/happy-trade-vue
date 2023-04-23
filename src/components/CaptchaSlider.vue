<template>
    <div class="slider">
        <div class="content">
            <div class="bg-img-div">
                <img ref="bgImg" :src="captchaStore.imageCaptchaInfo.backgroundImage" />
            </div>
            <div class="slider-img-div" id="slider-img-div" :style="{ 'transform': sliderImgDivTransformStyle }">
                <img ref="sliderImg" :src="captchaStore.imageCaptchaInfo.sliderImage" />
            </div>
        </div>
        <div class="slider-move">
            <div class="slider-move-track">
                拖动滑块完成拼图
            </div>
            <div class="slider-move-btn" id="slider-move-btn"
                :style="{ 'background-position': backgroundPosition, 'transform': sliderMoveBtnTransformStyle }"
                @mousedown="down"></div>
        </div>
        <div class="bottom">
            <div class="refresh-btn" id="slider-refresh-btn" @click="refreshCaptcha"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { FetchGetWithToken, FetchPostWithToken } from '@/util/FetchUtil';
import { useCaptchaStore } from '@/stores'
import { ElMessage } from 'element-plus';
const captchaStore = useCaptchaStore();
const bgImg = ref();
const sliderImg = ref();
const backgroundPosition = ref();

const sliderMoveBtnTransformStyle = ref()
const sliderImgDivTransformStyle = ref()





const valid = () => {
    let data = {
        bgImageWidth: currentCaptchaConfig.value.bgImageWidth,
        bgImageHeight: currentCaptchaConfig.value.bgImageHeight,
        sliderImageWidth: currentCaptchaConfig.value.sliderImageWidth,
        sliderImageHeight: currentCaptchaConfig.value.sliderImageHeight,
        startSlidingTime: currentCaptchaConfig.value.startTime,
        entSlidingTime: currentCaptchaConfig.value.stopTime,
        trackList: currentCaptchaConfig.value.trackArr,
        captchaToken: captchaStore.captchaTempToken
    };
    FetchPostWithToken("/api/captcha", JSON.stringify(data)).then(result => {
        if (result) {
            captchaStore.captchaVisble = false;
            //验证通过 恢复被阻挡的请求
            if (captchaStore.nextMethodParam != undefined) {
                captchaStore.nextMethod(captchaStore.nextMethodParam);
            } else {
                if(result.passToken!=undefined)
                {
                    captchaStore.nextMethod(result.passToken);
                    return;
                }
                captchaStore.nextMethod();
            }
        } else {
            ElMessage.error("验证失败，请重试");
            refreshCaptcha();
        }
    });
}
const loadCaptcha = () => {
    reset();
    nextTick(() => {
        initConfig(bgImg.value.width, bgImg.value.height, sliderImg.value.width, sliderImg.value.height, 206);
    });
}

const refreshCaptcha = () => {
    FetchGetWithToken("/api/captcha").then(data => {
        reset();
        captchaStore.imageCaptchaInfo.backgroundImage = data.backgroundImage;
        captchaStore.imageCaptchaInfo.sliderImage = data.sliderImage;
        initConfig(bgImg.value.width, bgImg.value.height, sliderImg.value.width, sliderImg.value.height, 206);
    })

}

const doDown = () => {
    backgroundPosition.value = '-5px 31.0092%';
}


const doMove = () => {
    const moveX = currentCaptchaConfig.value.moveX;
    console.log(moveX);
    sliderMoveBtnTransformStyle.value = "translate(" + moveX + "px, 0px)";
    sliderImgDivTransformStyle.value = "translate(" + moveX + "px, 0px)";
}
const reset = () => {
    backgroundPosition.value = "-5px 11.79625%";
    sliderMoveBtnTransformStyle.value = "translate(0px, 0px)";
    sliderImgDivTransformStyle.value = "translate(0px, 0px)";
}







const currentCaptchaConfig = ref();
/** 是否打印日志 */
const isPrintLog = ref(true);



function printLog(...params: any) {
    if (isPrintLog) {
        console.log(JSON.stringify(params));
    }
}

const initConfig = (bgImageWidth: any, bgImageHeight: any, sliderImageWidth: any, sliderImageHeight: any, end: any) => {
    currentCaptchaConfig.value = {
        startTime: new Date(),
        trackArr: [],
        movePercent: 0,
        bgImageWidth,
        bgImageHeight,
        sliderImageWidth,
        sliderImageHeight,
        end
    }
    printLog("init", currentCaptchaConfig);
    return currentCaptchaConfig;
}

const down = (event: any) => {
    let targetTouches = event.originalEvent ? event.originalEvent.targetTouches : event.targetTouches;
    let startX = event.pageX;
    let startY = event.pageY;
    if (startX === undefined) {
        startX = Math.round(targetTouches[0].pageX);
        startY = Math.round(targetTouches[0].pageY);
    }
    currentCaptchaConfig.value.startX = startX;
    currentCaptchaConfig.value.startY = startY;

    const pageX = currentCaptchaConfig.value.startX;
    const pageY = currentCaptchaConfig.value.startY;
    const startTime = currentCaptchaConfig.value.startTime;
    const trackArr = currentCaptchaConfig.value.trackArr;
    trackArr.push({
        x: pageX - startX,
        y: pageY - startY,
        type: "down",
        t: (new Date().getTime() - startTime.getTime())
    });
    printLog("start", startX, startY)
    // pc
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    doDown();
}

function move(event: any) {
    if (event instanceof TouchEvent) {
        event = event.touches[0];
    }
    let pageX = Math.round(event.pageX);
    let pageY = Math.round(event.pageY);
    const startX = currentCaptchaConfig.value.startX;
    const startY = currentCaptchaConfig.value.startY;
    const startTime = currentCaptchaConfig.value.startTime;
    const end = currentCaptchaConfig.value.end;
    const bgImageWidth = currentCaptchaConfig.value.bgImageWidth;
    const trackArr = currentCaptchaConfig.value.trackArr;
    let moveX = pageX - startX;
    const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "move",
        t: (new Date().getTime() - startTime.getTime())
    };
    trackArr.push(track);
    if (moveX < 0) {
        moveX = 0;
    } else if (moveX > end) {
        moveX = end;
    }
    currentCaptchaConfig.value.moveX = moveX;
    currentCaptchaConfig.value.movePercent = moveX / bgImageWidth;
    //滑块移动
    doMove();
    printLog("move", track)
}

function up(event: any) {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
    if (event instanceof TouchEvent) {
        event = event.changedTouches[0];
    }
    currentCaptchaConfig.value.stopTime = new Date();
    let pageX = Math.round(event.pageX);
    let pageY = Math.round(event.pageY);
    const startX = currentCaptchaConfig.value.startX;
    const startY = currentCaptchaConfig.value.startY;
    const startTime = currentCaptchaConfig.value.startTime;
    const trackArr = currentCaptchaConfig.value.trackArr;

    const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "up",
        t: (new Date().getTime() - startTime.getTime())
    }

    trackArr.push(track);
    printLog("up", track)
    valid();
}

onMounted(() => {
    loadCaptcha();
})
</script>


<style scoped>
.slider {
    background-color: #fff;
    width: 278px;
    height: 285px;
    z-index: 999;
    box-sizing: border-box;
    padding: 9px;
    border-radius: 6px;
    box-shadow: 0 0 11px 0 #999999;
}

.slider .content {
    width: 100%;
    height: 159px;
    position: relative;
}

.bg-img-div {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translate(0px, 0px);
}

.slider-img-div {
    height: 100%;
    position: absolute;
    transform: translate(0px, 0px);
}

.bg-img-div img {
    width: 100%;
}

.slider-img-div img {
    height: 100%;
}

.slider .slider-move {
    height: 60px;
    width: 100%;
    margin: 11px 0;
    position: relative;
}

.slider .bottom {
    height: 19px;
    width: 100%;
}

.refresh-btn,
.close-btn,
.slider-move-track,
.slider-move-btn {
    background: url("/img/sprite.1.2.4.png") no-repeat;
}

.refresh-btn,
.close-btn {
    display: inline-block;
}

.slider-move .slider-move-track {
    line-height: 38px;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
    color: #88949d;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}

.slider {
    user-select: none;
}

.slider-move .slider-move-btn {
    transform: translate(0px, 0px);
    background-position: -5px 11.79625%;
    position: absolute;
    top: -12px;
    left: 0;
    width: 66px;
    height: 66px;
}

.slider-move-btn:hover,
.close-btn:hover,
.refresh-btn:hover {
    cursor: pointer
}

.bottom .close-btn {
    width: 20px;
    height: 20px;
    background-position: 0 44.86874%;
}

.bottom .refresh-btn {
    width: 20px;
    height: 20px;
    background-position: 0 81.38425%;
}
</style>