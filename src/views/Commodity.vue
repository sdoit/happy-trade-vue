<template>
    <div>
        <el-result v-if="resultVisible" title="商品已售出" sub-title="来晚了，去看看其他商品把">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                    <path fill="#888888"
                        d="M704 288h131.072a32 32 0 0 1 31.808 28.8L886.4 512h-64.384l-16-160H704v96a32 32 0 1 1-64 0v-96H384v96a32 32 0 0 1-64 0v-96H217.92l-51.2 512H512v64H131.328a32 32 0 0 1-31.808-35.2l57.6-576a32 32 0 0 1 31.808-28.8H320v-22.336C320 154.688 405.504 64 512 64s192 90.688 192 201.664v22.4zm-64 0v-22.336C640 189.248 582.272 128 512 128c-70.272 0-128 61.248-128 137.664v22.4h256zm201.408 476.16a32 32 0 1 1 45.248 45.184l-128 128a32 32 0 0 1-45.248 0l-128-128a32 32 0 1 1 45.248-45.248L704 837.504V608a32 32 0 1 1 64 0v229.504l73.408-73.408z" />
                </svg>
            </template>
            <template #extra>
                <el-button type="primary">回到首页</el-button>
            </template>
        </el-result>
        <div v-if="contentVisible">
            <el-row justify="center">
                <el-col :span="16">
                    <el-row>
                        <el-col :span="7">
                            <el-image loading="lazy" :src="constant.NGINX_SERVER_HOST + '/' + commodity?.cover"
                                :fit="'fill'" class="res-img">
                                <template #placeholder>
                                    <div class="img-slot-wrapper">
                                        <img src="/img/loading.svg" alt="正在加载" />
                                    </div>
                                </template>
                                <template #error>
                                    <div class="img-slot-wrapper">
                                        <img src="/img/error.svg" alt="图片加载失败" />
                                    </div>
                                </template>
                            </el-image>
                        </el-col>
                        <el-col :span="15" :offset="2">

                            <el-row>
                                <el-col>
                                    <span class="name">{{ commodity?.name }}</span>
                                </el-col>
                            </el-row>
                            <el-row justify="space-between" class="tips">
                                <el-col :span="12">
                                    <el-row justify="start">
                                        <el-col>
                                            <span class="commodity-type">{{ commodity?.type.typeName }}</span>
                                            <span class="quality">{{ Math.round(commodity?.quality! * 10) }}新</span>
                                            <span class="free-shipping">包邮</span>
                                        </el-col>


                                    </el-row>
                                    <el-row justify="start">
                                        <el-col>
                                            <el-tag v-for="tag in commodity?.tags" :key="tag.tid" :type="getTagType(tag)"
                                                class="commodity-tag">{{ tag.tag }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="5" class="right-wrapper"><span class="view-count">{{
                                    commodity?.viewCount == 0 ?
                                    '您是本商品的第1个看客' : commodity?.viewCount + '人浏览过' }}</span></el-col>
                            </el-row>

                            <el-row class="price-wrapper" justify="space-between">
                                <el-col :span="5">
                                    <span style="color: #e4393c;">￥</span><span class="price">{{
                                        commodity?.price
                                    }}</span>
                                </el-col>
                                <el-col :span="5" class="right-wrapper">
                                    <el-button type="warning" :icon="Star" @click="collect" circle />
                                </el-col>
                            </el-row>
                            <el-row class="seller-wrapper">
                                <el-col>
                                    <el-card class="box-card">
                                        <el-row justify="space-between" class="seller-item">
                                            <el-col :span="17">
                                                <el-row class="seller-item">
                                                    <el-col :span="4">
                                                        <el-avatar :size="70"
                                                            :src="constant.NGINX_SERVER_HOST + commodity?.user.avatar" />
                                                    </el-col>
                                                    <el-col :span="20">
                                                        <el-row>
                                                            <el-col class="seller-item-text-wrapper seller-item"><span
                                                                    class="seller-nickname">{{
                                                                        commodity?.user.nickname
                                                                    }}</span></el-col>
                                                            <el-col class="seller-item-text-wrapper seller-item"><span
                                                                    class="seller-username">@{{
                                                                        commodity?.user.username
                                                                    }}</span></el-col>
                                                        </el-row>
                                                        <el-row class="introduction-wrapper">
                                                            <el-col
                                                                class="seller-item-text-wrapper seller-item introduction"><span>{{
                                                                    commodity?.user.introduction
                                                                }}</span></el-col>
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="7">
                                                <el-row class="seller-item">
                                                    <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                                        <span class="seller-record">作为买家的好评率：89%(2124/4667)</span>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="seller-item">
                                                    <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                                        <span class="seller-record">作为卖家的好评率：89%(2134/2667)</span>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <el-row class="button-wrapper" justify="end">
                                <el-col :span="3">
                                    <el-popconfirm title="你确定不通过出价购买，而用卖家标价直接购买本商品吗?" confirm-button-text="继续购买"
                                        cancel-button-text="我要出价" confirm-button-type="danger" cancel-button-type="primary"
                                        @confirm="goOrder" @cancel="toBidView" width="20rem">
                                        <template #reference>
                                            <el-button type="danger">直接购买</el-button>
                                        </template>
                                    </el-popconfirm>

                                </el-col>
                                <el-col :span="3">
                                    <el-button type="success" @click="toChat">联系卖家</el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="primary" @click="toBidView">出价</el-button>
                                </el-col>

                            </el-row>
                        </el-col>



                    </el-row>
                    <el-divider class="divider">商品详情</el-divider>
                    <el-row>
                        <el-col>
                            <Editor v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
                                @onCreated="handleCreated" />
                        </el-col>
                    </el-row>
                    <el-divider content-position="left" class="divider">出价历史</el-divider>
                    <el-row>
                        <el-col>
                            <el-timeline>
                                <el-timeline-item v-for="bid in bids"
                                    :type="bid.replySeller ? (bid.agree ? statusTimeLine.agree.type : statusTimeLine.reject.type) : statusTimeLine.unanswered.type"
                                    :hollow="bid.replySeller ? (bid.agree ? statusTimeLine.agree.hollow : statusTimeLine.reject.hollow) : statusTimeLine.unanswered.hollow"
                                    :size="'large'" :timestamp="bid.timeCreated" placement="top">
                                    <el-card>
                                        <div class="bid-wrapper">
                                            <div :span="4" style="display: flex; align-items: center;">
                                                <el-avatar :size="50"
                                                    :src="constant.NGINX_SERVER_HOST + bid.buyer.avatar" />
                                                <div style="margin-left:.5rem;">
                                                    <div class="quotation-swapper">
                                                        <div><span class="quotation-username"> {{
                                                            bid.buyer.nickname
                                                        }}</span>
                                                            <el-tag style="margin-left: .2rem;"
                                                                v-if="userStore.logged && bid.buyer.uid == userStore.user.uid">我</el-tag>
                                                        </div>
                                                    </div>
                                                    <div class="quotation-swapper">
                                                        <div><span style="color: #e4393c;">￥</span><span
                                                                class="quotation-price">{{ bid.price }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="message-wrapper">
                                                <el-alert class="quotation-message" :title="bid.messageBuyer" type="success"
                                                    :closable="false" />
                                            </div>
                                        </div>
                                        <div v-if="bid.agree != undefined" class="reply-wrapper">
                                            <div class="diversio-wire-wrapper">
                                                <div class="diversio-wire"></div>
                                            </div>
                                            <div class="quotation-padding"><el-avatar :size="50"
                                                    :src="constant.NGINX_SERVER_HOST + commodity?.user.avatar" /></div>
                                            <div class="quotation-padding seller-nickname-wrapper">
                                                <div class="nickname-wrapper">
                                                    <div>
                                                        <span class="quotation-username">{{
                                                            commodity?.user.nickname
                                                        }}</span><el-tag class="seller-tag">卖家</el-tag>
                                                    </div>
                                                </div>
                                                <div class="nickname-wrapper">
                                                    <div><span
                                                            :class="bid.agree ? 'seller-responese-agree' : 'seller-responese-reject'">{{
                                                                bid.agree ? "卖家同意了此报价" : "卖家拒绝了此报价"
                                                            }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="message-wrapper quotation-padding">
                                                <el-alert class="quotation-message" :title="bid.replySeller"
                                                    :type="bid.agree ? 'success' : 'error'" :closable="false" />
                                            </div>
                                        </div>
                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="right-wrapper">
                            <el-button type="primary" size="large" @click="goBid">我要出价</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>



            <el-dialog v-model="bidFormVisible" title="出价" :width="'60%'" :close-on-click-modal="false"
                :close-on-press-escape="false">
                <div class="bid-dialog-wrapper">
                    <el-steps direction="vertical" :active="step" class="steps" finish-status="success">
                        <el-step class="step" title="基本信息" description="填写报价和留言" />
                        <el-step class="step" title="选择收货地址" description="选择正确的收货地址，一旦报价被卖家接受，则会按照此收货地址自动创建订单" />
                        <el-step class="step" title="付款" description="付款后24小时内不可撤销" />
                    </el-steps>
                    <div>
                        <div class="step-content-wrapper">
                            <Transition enter-from-class="fade-enter-from" enter-active-class="fade-enter-active"
                                leave-active-class="fade-leave-active" leave-to-class="fade-leave-to">
                                <component :is="stepComponents[step]" :ref="setStepComponent"></component>
                            </Transition>
                        </div>
                        <el-button-group class="margin-top2 right-wrapper">
                            <el-button type="primary" :icon="ArrowLeft" :disabled="step == 0"
                                @click="stepLast">上一步</el-button>


                            <el-button :type="nextType" @click="stepNext" :disabled="goPayAlready">
                                {{ nextStep }}
                                <el-icon class="el-icon--right">
                                    <ArrowRight />
                                </el-icon>
                            </el-button>
                        </el-button-group>
                    </div>

                </div>
            </el-dialog>
            <!-- 订单dialog -->
            <el-dialog v-model="orderFormVisible" title="直接购买" width="50rem" :close-on-click-modal="false"
                :close-on-press-escape="false">
                <div class="order-wrapper">
                    <div>
                        <el-space wrap>
                            <el-image :src="constant.NGINX_SERVER_HOST + '/' + commodity?.cover"
                                style="width: 2rem; height: 2rem"></el-image>
                            <span class="order-commodity-name">{{ commodity?.name }}</span>
                        </el-space>
                    </div>

                    <div>
                        <el-card>
                            <el-row justify="space-between" class="seller-item">
                                <el-col :span="10">
                                    <el-row class="seller-item">
                                        <el-col :span="6">
                                            <el-avatar :size="40"
                                                :src="constant.NGINX_SERVER_HOST + commodity?.user.avatar" />
                                        </el-col>
                                        <el-col :span="18">
                                            <el-row>
                                                <el-col class="seller-item-text-wrapper seller-item"><span
                                                        class="seller-nickname">{{
                                                            commodity?.user.nickname
                                                        }}</span></el-col>
                                                <el-col class="seller-item-text-wrapper seller-item"><span
                                                        class="seller-username">@{{
                                                            commodity?.user.username
                                                        }}</span></el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row class="seller-item">
                                        <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                            <span class="seller-record">作为买家的好评率：89%(2124/4667)</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="seller-item">
                                        <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                            <span class="seller-record">作为卖家的好评率：89%(2134/2667)</span>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-card>
                    </div>
                    <div>
                        <el-result v-if="addressDeafult == undefined" title="没有收货地址" sub-title="你还有没设置收货地址，请先设置收货地址后再下单">
                            <template #icon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <g fill="none" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2">
                                        <path
                                            d="M8 4h10a2 2 0 0 1 2 2v10m-.57 3.399c-.363.37-.87.601-1.43.601H8a2 2 0 0 1-2-2V6m4 10h6" />
                                        <path d="M11 11a2 2 0 0 0 2 2m2-2a2 2 0 0 0-2-2M4 8h3m-3 4h3m-3 4h3M3 3l18 18" />
                                    </g>
                                </svg>
                            </template>
                            <template #extra>
                                <el-button type="primary" @click="toAddressSetting">去设置</el-button>
                            </template>
                        </el-result>
                        <el-card class="addr-view" v-if="addressDeafult != undefined">
                            <el-space direction="vertical" :fill="true">
                                <div>
                                    <el-space wrap>
                                        <div>
                                            <el-tag>默认</el-tag>
                                        </div>
                                        <div>
                                            <span class="addr-name">{{ addressDeafult?.name }}</span>
                                        </div>
                                        <div :span="20">
                                            <span class="addr-phone">{{ addressDeafult?.phone }}</span>
                                        </div>
                                    </el-space>
                                </div>
                                <div>
                                    <div>
                                        <span>{{
                                            addressDeafult?.province + ' ' + addressDeafult?.city + ' ' +
                                            addressDeafult?.area + ' ' +
                                            addressDeafult?.street
                                            + ' ' + addressDeafult?.address
                                        }} </span>
                                    </div>
                                </div>

                            </el-space>
                            <div class="right-wrapper">
                                <el-button type="info" :size="'small'" link>更改收货地址</el-button>
                            </div>
                        </el-card>
                    </div>
                    <div class="right-wrapper">
                        <span class="order-price-seller">￥{{ commodity?.price }}</span>
                    </div>
                    <div class="right-wrapper">
                        <el-button :type="nextType" @click="directGoPay" :disabled="goPayAlreadyOrder">
                            立即支付
                        </el-button>
                    </div>
                </div>

            </el-dialog>


            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />


        </div>

    </div>
</template>
<script setup lang="ts">
import { Star, ArrowLeft } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import constant from '@/common/constant';
import { useRoute } from 'vue-router';
import type Commodity from '@/interface/Commodity';
import type { Bid, CommodityBid } from '@/interface/CommodityBid';
import type CommonResult from "@/interface/CommonResult";
import type UserAddress from "@/interface/UserAddress";
import type Tag from '@/interface/Tag';
import { ref, onMounted, nextTick, shallowRef, onBeforeUnmount } from 'vue';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import BidStep1 from "@/components/BidStep1.vue";
import BidStep2 from "@/components/BidStep2.vue";
import BidStep3 from "@/components/BidStep3.vue";
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useUserStore, useBidStepStore, useLoadingStore, useUserMessageStore } from '@/stores'
import { FetchGetWithToken, FetchPostWithToken, FetchGetWithTokenRaw } from '@/util/FetchUtil';
import '@wangeditor/editor/dist/css/style.css'
import '@/assets/css/wang.css'
import router from '@/router';
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const userMessageStore = useUserMessageStore();
const contentVisible = ref(false);
//result组件
const resultVisible = ref(false);
const Route = useRoute();
const commodity = ref<Commodity>();
const fetchCommodity = () => {
    FetchGetWithToken("/api/commodity/" + Route.params.cid)
        .then(data => {
            console.log(data.sold);
            if (data.sold) {
                //商品已售出
                resultVisible.value = true;
                console.log("商品已售出");
                return;
            }
            contentVisible.value = true
            commodity.value = data;
            //设置商品描述 富文本
            valueHtml.value = commodity.value?.description;

            emits('loadDone');
            loadingStore.clodeLoading();
        });
}
fetchCommodity();
const bids = ref<Bid[]>([]);
const fetchCommodityBid = () => {
    FetchGetWithToken("/api/bid/commodity/" + Route.params.cid)
        .then(data => {
            if (data != null && data.length > 0) {
                bids.value = data.bids;
            }

        });
}


const collect = () => {
    FetchPostWithToken("/api/favorites", JSON.stringify({
        cid: commodity.value?.cid
    })).then(result => {
        ElMessage({
            message: "收藏成功",
            type: 'success'
        });
        //点亮图标
        //
    });
}



const tagType = ['' as EpPropMergeType<StringConstructor, '', unknown>,
'success' as EpPropMergeType<StringConstructor, 'success', unknown>,
'info' as EpPropMergeType<StringConstructor, 'info', unknown>,
'danger' as EpPropMergeType<StringConstructor, 'danger', unknown>,
'warning' as EpPropMergeType<StringConstructor, 'warning', unknown>];
const getTagType = (tag: Tag) => {
    let typeIndex = Number.parseInt(tag.tid) % tagType.length;
    return tagType[typeIndex];
}


const statusTimeLine = {
    unanswered: {
        hollow: true,
        type: 'info' as EpPropMergeType<StringConstructor, 'info', unknown>
    },
    agree: {
        hollow: false,
        type: 'success' as EpPropMergeType<StringConstructor, 'success', unknown>
    },
    reject: {
        hollow: false,
        type: 'danger' as EpPropMergeType<StringConstructor, 'danger', unknown>
    }

}
//wangeditor设置  
const editorRef = shallowRef()
const valueHtml = ref();
const editorConfig = { readOnly: true, scroll: false }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const mode = "default"

/**联系卖家 */
const toChat = () => {
    userMessageStore.chatUserUid = commodity.value?.cid as string
    userMessageStore.fetMessage()
    userMessageStore.showMessageDrawer();
}
// const messageList = shallowRef<UserMessage[]>([]);
// const chatMessage = ref();
// const chatDrawerVisible = ref(false);
// const messageWrapper = ref();
// const messageScrollbar = ref();


//发送消息

/**
 * 直接购买===================
 */
const orderFormVisible = ref(false);
const goPayAlreadyOrder = ref(false);
const addressDeafult = ref<UserAddress>()
const goOrder = () => {
    userStore.checkLogin().then(result => {
        if (result) {
            openOrderDialog();
        } else {
            ElMessage.error('登录过期，请重新登录');
            userStore.loginFormVisible = true;
        }
    });
}
const openOrderDialog = () => {
    FetchGetWithToken("/api/order/" + commodity.value?.cid).then(data => {
        if (!data) {
            FetchGetWithToken("/api/userAddress/u/default/")
                .then(data => {
                    addressDeafult.value = data;
                    orderFormVisible.value = true;
                });
        } else {
            ElMessage({
                message: "你已经存在一个对本商品的报价，请先取消出价再购买",
                type: "error"
            });
        }
    })
}

const directGoPay = () => {
    if (addressDeafult.value == undefined) {
        ElMessage({
            message: "没有收货地址，请先设置一个",
            type: 'error',
        });
        return;
    }

    loading = ElLoading.service({
        lock: true,
        text: '正在等待支付结果...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    FetchPostWithToken("/api/order", JSON.stringify({
        "cid": commodity.value?.cid,
        "aid": addressDeafult.value?.aid,
    })).then((data) => {
        FetchGetWithTokenRaw(data)
            .then((response) => response.text())
            .then((form) => {
                let divForm = document.getElementsByTagName('divform')
                if (divForm.length) {
                    document.body.removeChild(divForm[0])
                }
                const div = document.createElement('divform')
                div.innerHTML = form
                document.body.appendChild(div)
                let alipay_form = document.getElementsByName('punchout_form')[0] as HTMLFormElement;
                alipay_form.setAttribute('target', '_blank');
                alipay_form.submit();
            }).catch((err) => {
                console.log(err);
            });

        //开始等待支付结果
        waitingPayResult("order");

    });

}















/**
 * 出价============================
 */
const bidStepStore = useBidStepStore();
const toBidView = () => {
    emits("toBidView");
}

const bidFormVisible = ref(false);
const step = ref(0);
// 是否已跳转到支付
const goPayAlready = ref(false)
// 下一步按钮显示的文本的样式
const nextType = ref<EpPropMergeType<StringConstructor, "" | "default" | "info" | "success" | "danger" | "primary" | "text" | "warning", unknown>>('primary');
const pimaryType = ref<EpPropMergeType<StringConstructor, "" | "default" | "info" | "success" | "danger" | "primary" | "text" | "warning", unknown>>('primary');
const successType = ref<EpPropMergeType<StringConstructor, "" | "default" | "info" | "success" | "danger" | "primary" | "text" | "warning", unknown>>('success');
const nextStep = ref("下一步");
const stepComponents = shallowRef([BidStep1, BidStep2, BidStep3]);;


const emits = defineEmits(['toBidView', 'loadDone']);

//步骤组件对象
const stepComponent = ref();
//动态组件获取方法
const setStepComponent = (el: any) => {
    stepComponent.value = el;
}




const openBid = () => {
    bidFormVisible.value = true;
    bidStepStore.commodity = commodity.value as Commodity;
    bidStepStore.seller = commodity.value!.user;
}
const stepLast = () => {
    if (step.value > 0) {
        step.value -= 1;
    }
    nextStep.value = "下一步";
    nextType.value = "primary"
}
const stepNext = () => {
    switch (step.value) {
        case 0:
            if (bidStepStore.commodityBid.price == undefined) {
                ElMessage({
                    message: "请填写你要出的价格",
                    type: 'error'
                });
                return;
            }
            if (bidStepStore.commodityBid.messageBuyer == undefined) {
                ElMessage({
                    message: "请填写你对卖家的留言，以便卖家同意你的报价",
                    type: 'error'
                });
                return;
            }
            step.value += 1;
            break;
        case 1:
            if (bidStepStore.address == undefined) {
                ElMessage({
                    message: "没有收货地址，请选择或创建一个",
                    type: 'error'
                });
                return;
            }
            step.value += 1;
            nextType.value = successType.value;
            nextStep.value = "去支付";
            break;
        case 2:
            goPayAlready.value = true;
            goPay();
            break;
        default:
            break;
    }
}
let loading: any = null;
const goBid = () => {
    loading = ElLoading.service({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    FetchGetWithToken("/api/bid/" + commodity.value?.cid).then(data => {
        if (!data) {
            //如果没有对这个商品的出价，就去弹出Bid Dialog 同时检查是否登录
            userStore.checkLogin().then(data => {
                openBid();
                loading.close();
            });

        } else {
            loading.close();
            ElMessage({
                message: '你已经对本商品出了一个价了',
                type: 'error',
            });
            loading.close();

        }

    });




}
const goPay = async () => {
    loading = ElLoading.service({
        lock: true,
        text: '正在等待支付结果...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    FetchPostWithToken("/api/bid", JSON.stringify({
        "cid": commodity.value?.cid,
        "messageBuyer": bidStepStore.commodityBid.messageBuyer,
        "price": bidStepStore.commodityBid.price,
        "aid": bidStepStore.address.aid
    })).then((data) => {
        FetchGetWithTokenRaw(data)
            .then((response) => response.text())
            .then((form) => {
                let divForm = document.getElementsByTagName('divform')
                if (divForm.length) {
                    document.body.removeChild(divForm[0])
                }
                const div = document.createElement('divform')
                div.innerHTML = form
                document.body.appendChild(div)
                let alipay_form = document.getElementsByName('punchout_form')[0] as HTMLFormElement;
                alipay_form.setAttribute('target', '_blank');
                alipay_form.submit();
            }).catch((err) => {
                console.log(err);
            });

        //开始等待支付结果
        waitingPayResult("bid");

    });
}
const waitingPayResult = (type: string) => {
    const message = {
        "bid": "支付成功，请耐心等待卖家的回复",
        "order": "支付成功，请等待卖家发货"
    }

    const tokenName: string = localStorage.getItem(constant.TOKEN_NAME_KEY) as string;
    const tokenValue: string = localStorage.getItem(constant.TOKEN_VALUE_KEY) as string;
    const sse = new EventSourcePolyfill(constant.SPRINGBOOT_SERVER_HOST + '/api/sse/connect', {
        headers: {
            [tokenName]: tokenValue
        }
    });
    sse.onopen = function (event: any) {
        console.log("连接成功", event);
    };
    sse.onmessage = function (event: MessageEvent) {
        if (event.lastEventId == constant.ALIPAY_SUCCESS) {
            bidFormVisible.value = false;
            loading.close();
            ElMessage({
                message: type == "bid" ? message.bid : message.order,
                type: 'success',
            });
            sse.close();
            if (type == "bid") {
                fetchCommodityBid();
            } else {
                //跳转到订单详情
                console.log("跳转到订单详情")
            }
        }

    };
    sse.onerror = function (error: any) {
        bidFormVisible.value = false;
        ElMessageBox.confirm(
            '你是否完成了支付？',
            '未收到您的支付结果',
            {
                confirmButtonText: '已完成支付',
                cancelButtonText: '未完成支付',
                type: 'warning',
                center: true,
                showClose: false,
                closeOnPressEscape: false,
                closeOnClickModal: false,
            }
        ).then(() => {
            //查询支付结果
            loading = ElLoading.service({
                lock: true,
                text: '正在查询支付结果...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            FetchGetWithToken("/api/" + type + "/" + commodity.value?.cid).then(data => {
                if (data) {
                    ElMessage({
                        message: type == "bid" ? message.bid : message.order,
                        type: 'success',
                    });
                    if (type == "bid") {
                        fetchCommodityBid();
                    } else {
                        //跳转到订单详情
                        console.log("跳转到订单详情")
                    }
                    loading.close();
                } else {
                    ElMessage({
                        message: '未查询到你的支付记录',
                        type: 'error',
                    });
                }
                loading.close();
            });

        }).catch(() => {

        })
        loading.close();
        sse.close();
    }
}

const toAddressSetting = () => {
    router.push({ name: 'home-address' });
}


onMounted(() => {

    fetchCommodityBid();
})
</script>

<style scoped>
.imgs {
    height: 25rem;
}

.res-img {
    height: 100%;
}

.name {
    font-size: xx-large;
}

.commodity-tag {
    margin-right: .3rem;
    margin-top: 1rem;
}

.tips {
    margin-top: 1rem;
}

.tips .quality {
    color: darkgreen;
    font-weight: 700;
    font-size: large;
    margin-left: 1rem;
}

.tips .free-shipping {
    color: darkblue;
    font-weight: 700;
    font-size: large;
    margin-left: 1rem;
}

.tips .view-count {
    color: gray;
    font-size: small;
}

.tips .commodity-type {
    font-size: smaller;
    color: gray;
}

.price-wrapper {
    margin-top: 2rem;
}

.price {
    font-size: xx-large;
    color: #e4393c;
    font-weight: 900;
}

.right-wrapper {
    display: flex;
    justify-content: end;
    align-items: center;
}

.seller-wrapper {
    margin-top: 3rem;
}

.seller-item {
    display: flex;
    align-items: center;
}

.seller-item-text-wrapper {
    height: 1rem;
}

.seller-wrapper .seller-nickname {
    font-size: medium;
    font-weight: 600;
}

.seller-wrapper .seller-username {
    font-size: x-small;
}

.introduction-wrapper {
    margin-top: .5rem;
}

.introduction {
    font-size: xx-small;
}

.seller-record {
    font-size: xx-small;
    color: firebrick;
}

.button-wrapper {
    margin-top: 2rem;
}

.divider {
    margin-top: 10rem;
    margin-bottom: 3rem;
}

.image-wrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}

.image-wrapper .el-image {
    width: 80%;
}

.description-text {
    font-size: x-large;
    line-height: 2.5rem;
}


.quotation-swapper {
    height: 1.5rem;
    align-items: center;
}

.nickname-wrapper {
    margin-left: .5rem;
}



.quotation-username:hover {
    color: coral;
}

.quotation-price {
    font-size: larger;
    color: #e4393c;
    font-weight: 700;
}

.quotation-padding {
    padding-top: 2rem;
}

.seller-nickname-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.quotation-message {
    height: 100%;
}

.seller-tag {
    margin-left: .3rem;
}


.diversio-wire {
    height: 67%;
    width: 75%;
    border-radius: var(--el-border-radius-small);
    border-left: 1px solid darkgrey;
    border-bottom: 1px solid darkgrey;
}

.seller-responese-agree {
    font-size: small;
    color: green;
    font-weight: 700;
}

.seller-responese-reject {
    font-size: small;
    color: #e1251b;
    font-weight: 700;
}


.quotation-username {
    max-width: 8rem;
    min-width: 4rem;
    font-size: small;
    cursor: default;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

.diversio-wire-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-left: 1rem;
    width: 3rem;
}

.bid-wrapper,
.reply-wrapper {
    display: flex;
}

.message-wrapper {
    margin-left: 1rem;
}


.bid-dialog-wrapper {
    display: flex;
    align-items: center;

}

.steps {
    height: 20rem;
    width: 15rem;
    margin-right: 3rem;
}

.step {
    width: 15rem;
    margin-right: 3rem;
}

.margin-top2 {
    margin-top: 2rem;
}









.order-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.order-wrapper>div {
    margin-top: 2rem;
    width: 90%;
}

.order-commodity-name {
    font-size: x-large;
    font-weight: 700;
}

.order-price-seller {
    font-size: x-large;
    color: #e4393c;
    font-weight: 700;
}

.fade-enter-active {
    transition: opacity 1s ease
}

.fade-leave-active {
    transition: opacity 0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.step-content-wrapper {
    height: 22rem;
    width: 50rem;
}


</style>
<style>
.editor-content-view {
    border: 3px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    margin-top: 20px;
    overflow-x: auto;
}

.editor-content-view p,
.editor-content-view li {
    white-space: pre-wrap;
    /* 保留空格 */
}

.editor-content-view blockquote {
    border-left: 8px solid #d0e5f2;
    padding: 10px 10px;
    margin: 10px 0;
    background-color: #f1f1f1;
}

.editor-content-view code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
    border-radius: 3px;
}

.editor-content-view pre>code {
    display: block;
    padding: 10px;
}

.editor-content-view table {
    border-collapse: collapse;
}

.editor-content-view td,
.editor-content-view th {
    border: 1px solid #ccc;
    min-width: 50px;
    height: 20px;
}

.editor-content-view th {
    background-color: #f1f1f1;
}

.editor-content-view ul,
.editor-content-view ol {
    padding-left: 20px;
}


</style>