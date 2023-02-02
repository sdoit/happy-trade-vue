<template>
    <el-row justify="center">
        <el-col :span="16">
            <el-row>
                <el-col :span="7">
                    <el-carousel class="imgs" :arrow="'hover'">
                        <el-carousel-item v-for="res in commodity?.resources" :key="res.fileName" class="imgs">
                            <el-image loading="lazy" :src="
                                constant.NGINX_SERVER_HOST + '/'
                                + res.type + '/'
                                + res.uid + '/'
                                + res.date + '/'
                                + res.fileName
                            " :fit="'fill'" class="res-img">
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

                        </el-carousel-item>
                    </el-carousel>
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
                                <el-col :span="3"><span class="quality">{{
                                    Math.round(
                                        commodity?.quality! * 10)
                                }}新</span></el-col>
                                <el-col :span="3"><span class="free-shipping">包邮</span></el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="5" class="right-wrapper"><span class="view-count">{{ commodity?.viewCount == 0 ?
                        '您是本商品的第1个看客' : commodity?.viewCount + '人浏览过'}}</span></el-col>
                    </el-row>

                    <el-row class="price-wrapper" justify="space-between">
                        <el-col :span="5">
                            <span style="color: #e4393c;">￥</span><span class="price">{{ commodity?.price }}</span>
                        </el-col>
                        <el-col :span="5" class="right-wrapper">
                            <el-button type="warning" :icon="Star" circle />
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
                                                    :src="constant.NGINX_SERVER_HOST + seller?.avatar" />
                                            </el-col>
                                            <el-col :span="20">
                                                <el-row>
                                                    <el-col class="seller-item-text-wrapper seller-item"><span
                                                            class="seller-nickname">{{
                                                                seller?.nickname
                                                            }}</span></el-col>
                                                    <el-col class="seller-item-text-wrapper seller-item"><span
                                                            class="seller-username">@{{
                                                                seller?.username
                                                            }}</span></el-col>
                                                </el-row>
                                                <el-row class="introduction-wrapper">
                                                    <el-col
                                                        class="seller-item-text-wrapper seller-item introduction"><span>{{
                                                            seller?.introduction
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
                            <el-button type="danger">直接购买</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="success">联系卖家</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary">出价</el-button>
                        </el-col>

                    </el-row>
                </el-col>



            </el-row>
            <el-divider class="divider">商品详情</el-divider>
            <el-row v-for="res in commodity?.resources">
                <el-col class="image-wrapper">
                    <el-image :src="constant.NGINX_SERVER_HOST + '/'
                    + res.type + '/'
                    + res.uid + '/'
                    + res.date + '/'
                    + res.fileName" :fit="'contain'" />
                </el-col>
            </el-row>
            <el-divider content-position="left" class="divider">商品描述</el-divider>
            <el-row>
                <el-col>
                    <p class="description-text"> {{ commodity?.description }}</p>
                </el-col>
            </el-row>
            <el-divider content-position="left" class="divider">出价历史</el-divider>
            <el-row>
                <el-col>
                    <el-timeline>
                        <el-timeline-item v-for="bid in commodityBids"
                            :type="bid.replySeller ? (bid.agree ? status.agree.type : status.reject.type) : status.unanswered.type"
                            :hollow="bid.replySeller ? (bid.agree ? status.agree.hollow : status.reject.hollow) : status.unanswered.hollow"
                            :size="'large'" :timestamp="bid.time" placement="top">
                            <el-card>
                                <div class="bid-wrapper">
                                    <div :span="4" style="display: flex; align-items: center;">
                                        <el-avatar :size="50" :src="constant.NGINX_SERVER_HOST + bid.avatar" />
                                        <div style="margin-left:.5rem;">
                                            <div class="quotation-swapper">
                                                <div><span class="quotation-username">{{ bid.nickname }}</span>
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
                                <div class="reply-wrapper">
                                    <div class="diversio-wire-wrapper">
                                        <div class="diversio-wire"></div>
                                    </div>
                                    <div class="quotation-padding"><el-avatar :size="50"
                                            :src="constant.NGINX_SERVER_HOST + seller?.avatar" /></div>
                                    <div class="quotation-padding seller-nickname-wrapper">
                                        <div class="nickname-wrapper">
                                            <div>
                                                <span class="quotation-username">{{
                                                    seller?.nickname
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
                    <el-button type="primary" size="large" @click="bidFormVisible = true">我要出价</el-button>
                </el-col>
            </el-row>
        </el-col>
    </el-row>





    <el-dialog v-model="bidFormVisible" title="出价" :width="'60%'">
        <div class="bid-dialog-wrapper">
            <el-steps direction="vertical" :active="step" class="steps">
                <el-step class="step" title="基本信息" description="填写报价和留言" />
                <el-step class="step" title="选择收货地址" description="选择正确的收货地址，一旦报价被卖家接受，则会按照此收货地址自动创建订单" />
                <el-step class="step" title="付款" description="付款后24小时内不可撤销" />
            </el-steps>
            <div>
                <Transition name="step">
                    <BidStep1 v-if="step==1" :commodity="commodity" :seller="seller" />
                </Transition>
                <el-button-group class="margin-top2 right-wrapper">
                    <el-button type="primary" :icon="ArrowLeft">上一步</el-button>
                    <el-button type="primary" @click="nextStep">
                        下一步<el-icon class="el-icon--right">
                            <ArrowRight />
                        </el-icon>
                    </el-button>
                </el-button-group>
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






</template>
<script setup lang="ts">

import { Star, ArrowLeft } from '@element-plus/icons-vue'

import constant from '@/common/constant';
import { useRoute } from 'vue-router';
import type Commodity from '@/entity/Commodity';
import type CommodityBid from '@/entity/CommodityBid';
import type CommonResult from "@/entity/CommonResult";
import type User from '@/entity/User';
import { ref, onMounted } from 'vue';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import BidStep1 from "@/components/BidStep1.vue";

const Route = useRoute();
const commodity = ref<Commodity>();
const fetchCommodity = () => {
    fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/commodity/" + Route.params.cid)
        .then(response => response.json())
        .then((json: CommonResult) => {
            if (json.data != undefined) {
                commodity.value = json.data;
                //获取卖家信息
                fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/user/" + commodity.value?.uid)
                    .then(response => response.json())
                    .then((json: CommonResult) => {
                        if (json.data != undefined) {
                            seller.value = json.data;
                        }
                    });

            }
        })
}

const seller = ref<User>();
const commodityBids = ref<CommodityBid[]>([]);
const fetchCommodityBid = () => {
    fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/bid/commodity/" + Route.params.cid)
        .then(response => response.json())
        .then((json: CommonResult) => {
            if (json.data != undefined) {
                commodityBids.value = json.data;
            }
        });
}

const status = {
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



const bidFormVisible = ref(false);
const step = ref(1);
const bid = ref(0);

const nextStep = () => {
    step.value += 1;
}



onMounted(() => {
    fetchCommodity();
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

.tips {
    margin-top: 1rem;
}

.tips .quality {
    color: darkgreen;
    font-weight: 700;
    font-size: large;
}

.tips .free-shipping {
    color: darkblue;
    font-weight: 700;
    font-size: large;
}

.tips .view-count {
    color: gray;
    font-size: small;
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
    color: red;
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









.step-enter-active {
    transition: all 0.3s ease-out;
}

.step-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.step-enter-from,
.step-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>