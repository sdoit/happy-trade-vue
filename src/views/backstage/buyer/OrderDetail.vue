<template>
    <div>

        <div v-if="order != undefined" class="order-wrapper">
            <el-card>
                <div class="commodity-wrapper">
                    <div>
                        <el-image :src="constant.NGINX_SERVER_HOST + '/' + order.commodity.cover" :fit="'fill'"
                            class="cover"></el-image>
                    </div>
                    <div class="commodity-info-wrapper">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="name">{{ order.name }}</span>
                            <span class="status" :class="getOrderStatusClass(order)"> {{ getOrderStatusName(order) }}</span>
                        </div>
                        <span class="cid">商品编号：{{ order.cid }}</span>
                        <span class="time">发布时间：{{ order.commodity.time }}</span>
                        <div class="info-bottom">
                            <span class="view-count">浏览量：{{ order.commodity.viewCount }}</span>
                            <span class="seller-price">卖家标价：{{ order.commodity.price }}</span>

                        </div>
                    </div>
                </div>

            </el-card>
            <el-card>
                <div class="seller-wrapper">
                    <div class="seller-head">
                        <div>
                            <el-avatar :src="constant.NGINX_SERVER_HOST + order.user.avatar"></el-avatar>
                        </div>
                        <div class="seller-name-wrapper">
                            <span class="seller-name">{{ order.user.nickname }}</span>
                            <span class="seller-username">@{{ order.user.username }}</span>
                        </div>
                    </div>
                    <div>
                        <div class="seller-appraisal">
                            <span>{{ order.user.ratingCountBuyer == 0
                                ? '此用户还没有购买过商品' : '作为买家的好评率：' +
                                (order.user.goodRatingCountBuyer
                                    / order.user.ratingCountBuyer * 100).toFixed(2)
                                + '%' + '(' + order.user.goodRatingCountBuyer + '/' +
                                order.user.ratingCountBuyer + ')' }}</span>
                            <span>{{ order.user.ratingCountSeller == 0
                                ? '此用户还没有卖出过商品' : '作为卖家的好评率：' +
                                (order.user.goodRatingCountSeller
                                    / order.user.ratingCountSeller * 100).toFixed(2)
                                + '%' + '(' + order.user.goodRatingCountSeller + '/' +
                                order.user.ratingCountSeller + ')' }}</span>
                        </div>

                    </div>

                </div>

            </el-card>

            <el-card>
                <div class="addr-card">
                    <div class="address-wrapper">
                        <div>
                            <span class="address-name">{{ order.userAddress.name }}</span>
                            <span class="address-phone">{{ order.userAddress.phone }}</span>
                        </div>
                        <div class="address-detail-wrapper">
                            <span class="address">{{
                                order.userAddress.province + ' ' + order.userAddress.city + ' ' +
                                order.userAddress.area + ' ' +
                                order.userAddress.street
                                + ' ' + order.userAddress.address
                            }}</span>
                        </div>
                    </div>
                    <div class="address-ship">
                        <span v-if="order.shipId != undefined">运单号：{{ order.shipId }}</span>
                        <span v-if="order.shipId != undefined">发货时间：{{ order.shipTime }}</span>
                    </div>
                </div>


            </el-card>
            <el-card v-if="order.orderRatingToSeller != undefined || order.orderRatingToBuyer != undefined">
                <el-row justify="space-between" v-if="order.orderRatingToBuyer != undefined">
                    <el-col :span="12" class="seller-head">
                        <div>
                            <el-avatar :src="constant.NGINX_SERVER_HOST + order.user.avatar"></el-avatar>
                        </div>
                        <div class="seller-name-wrapper">
                            <div>
                                <span class="seller-name">{{ order.user.nickname }}</span><el-tag type="success">卖家</el-tag>
                            </div>
                            <span class="seller-username">@{{ order.user.username }}</span>
                        </div>
                    </el-col>
                    <el-col :span="7" :offset="3" style="display: flex; flex-direction: column;">
                        <el-rate v-model="order.orderRatingToBuyer.score" disabled text-color="#ff9900" />
                        <span>{{ order.orderRatingToBuyer.comment }}</span>
                    </el-col>
                </el-row>
                <el-divider v-if="order.orderRatingToSeller != undefined && order.orderRatingToBuyer != undefined" />
                <el-row style="display: flex; justify-content: space-between;"
                    v-if="order.orderRatingToSeller != undefined">
                    <el-col :span="12" class="seller-head">
                        <div>
                            <el-avatar :src="constant.NGINX_SERVER_HOST + userStore.user.avatar"></el-avatar>
                        </div>
                        <div class="seller-name-wrapper">
                            <div>
                                <span class="seller-name">{{ userStore.user.nickname }}</span><el-tag>我</el-tag>
                            </div>
                            <span class="seller-username">@{{ userStore.user.username }}</span>
                        </div>
                    </el-col>
                    <el-col :span="7" :offset="3" style="display: flex; flex-direction: column;">
                        <el-rate v-model="order.orderRatingToSeller.score" disabled text-color="#ff9900" />
                        <span>{{ order.orderRatingToSeller.comment }}</span>
                    </el-col>
                </el-row>
            </el-card>
            <el-card>
                <div class="order-detail-wrapper">
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>订单号</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span>{{ order.oid }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>支付凭证号</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span>{{ order.tradeId }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>下单时间</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span>{{ order.orderTime }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>支付时间</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span>{{ order.payTime }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>支付方式</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span>支付宝</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>支付账户</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span>{{ order.buyerAlipayId }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3" :offset="3" class="title">
                            <span>支付金额</span>
                        </el-col>
                        <el-col :span="5" :offset="6" class="content">
                            <span class="totalAmount">￥{{ order.totalAmount }}</span>
                        </el-col>
                    </el-row>

                    <div class="order-bottom">
                        <el-button type="primary" size="small" @click="toChat">联系卖家</el-button>
                        <el-button type="success" @click="toSnapShot" size="small">交易快照</el-button>
                        <el-button type="warning" size="small" v-if="order.status == 0"
                            @click="returnVisible = true">退货申请</el-button>
                        <el-button type="primary" size="small" v-if="order.status == 0"
                            :disabled="order.shipId == undefined" @click="toConfirmReceipt">确定收货</el-button>
                    </div>
                </div>

            </el-card>
            <el-card class="order-return" v-if="order.status == constant.ORDER_STATUS_REFUNDING">
                <div
                    v-if="order.status == constant.ORDER_STATUS_REFUNDING && order?.orderReturn?.agree == true && order.orderReturn.shipId == undefined && order.orderReturn.completed == undefined">
                    <p>卖家同意退货</p>
                    <p>回寄地址：</p>
                    <div class="addr-card" style="margin-top: 1rem;">
                        <div class="address-wrapper">
                            <div>
                                <span class="address-name">{{ order?.orderReturn?.userAddress?.name }}</span>
                                <span class="address-phone">{{ order?.orderReturn?.userAddress?.phone }}</span>
                            </div>
                            <div class="address-detail-wrapper">
                                <span class="address">{{
                                    order?.orderReturn?.userAddress?.province + ' ' + order?.orderReturn?.userAddress?.city
                                    + ' ' +
                                    order?.orderReturn?.userAddress?.area + ' ' +
                                    order?.orderReturn?.userAddress?.street
                                    + ' ' + order?.orderReturn?.userAddress?.address
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p>已回寄，等待卖家回应</p>
                    <p>回寄运单号：{{ order.orderReturn.shipId }}</p>
                </div>
                <div class="order-bottom"
                    v-if="order.status == constant.ORDER_STATUS_REFUNDING && order?.orderReturn?.agree == true && order.orderReturn.shipId == undefined && order.orderReturn.completed == undefined">
                    <el-button size="small" type="primary" @click="returnShipVisible = true">填写回寄快递单号</el-button>
                </div>
            </el-card>
        </div>
        <div>

            <el-dialog title="确认收货" width="40rem" v-model="confirmVisible" :close-on-click-modal="false"
                :close-on-press-escape="false">

                <el-row>
                    <el-col :span="6">
                        <el-image :src="constant.NGINX_SERVER_HOST + '/' + order!.commodity.cover" :fit="'fill'"
                            class="cover"></el-image>
                    </el-col>
                    <el-col :span="13" :offset="1">
                        <span class="confirm-info-name">商品名</span>
                        <div class="confirm-info-wrapper">
                            <div class="confirm-info-title">
                                <span>订单号</span>
                                <span>下单时间</span>
                                <span>发货时间</span>
                                <span>运单号</span>
                            </div>
                            <div class="confirm-info-content">
                                <span>{{ order?.oid }}</span>
                                <span>{{ order?.payTime }}</span>
                                <span>{{ order?.shipTime }}</span>
                                <span>{{ order?.shipId }}</span>
                            </div>
                        </div>

                    </el-col>
                </el-row>
                <el-row class="confirm-seller">
                    <el-col>
                        <el-card>
                            <div class="seller-wrapper">
                                <div class="seller-head">
                                    <div>
                                        <el-avatar :src="constant.NGINX_SERVER_HOST + order!.user.avatar"></el-avatar>
                                    </div>
                                    <div class="seller-name-wrapper">
                                        <span class="seller-name">{{ order!.user.nickname }}</span>
                                        <span class="seller-username">@{{ order!.user.username }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="seller-appraisal">
                                        <span>{{ order!.user.ratingCountBuyer == 0
                                            ? '此用户还没有购买过商品' : '作为买家的好评率：' +
                                            (order!.user.goodRatingCountBuyer
                                                / order!.user.ratingCountBuyer * 100).toFixed(2)
                                            + '%' + '(' + order!.user.goodRatingCountBuyer + '/' +
                                            order!.user.ratingCountBuyer + ')' }}</span>
                                        <span>{{ order!.user.ratingCountSeller == 0
                                            ? '此用户还没有卖出过商品' : '作为卖家的好评率：' +
                                            (order!.user.goodRatingCountSeller
                                                / order!.user.ratingCountSeller * 100).toFixed(2)
                                            + '%' + '(' + order!.user.goodRatingCountSeller + '/' +
                                            order!.user.ratingCountSeller + ')' }}</span>
                                    </div>

                                </div>

                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-row style="display: flex; align-items: center;">
                            <el-col :span="5">
                                <span>请为卖家评分:</span>
                            </el-col>
                            <el-col :span="12">
                                <el-rate v-model="score" size="large" :colors="colors"
                                    :texts="['垃圾!糟糕的体验!', '差评!不好的购物体验', '中评,有一些小问题', '好评!不错的购物体验', '好评!好评!!好评!!!']"
                                    show-text />
                            </el-col>
                        </el-row>
                        <el-row style="display: flex; align-items: center;">
                            <el-col :span="5">
                                <span>对卖家的评价:</span>
                            </el-col>
                            <el-col :span="12">
                                <el-input v-model="comment" placeholder="请输入你对卖家的评价" />
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row justify="end" style="margin-top: 1rem;">
                    <el-col :span="6">
                        <el-button type="primary" @click="confirmReceipt">确定</el-button>
                        <el-button @click="confirmVisible = false;">取消</el-button>
                    </el-col>
                </el-row>
            </el-dialog>

            <el-dialog v-model=" returnVisible " width="30rem" title="退货申请">
                <div style="margin-bottom: 1rem;">
                    <span style="color: gray;">建议与卖家商议后再使用本功能</span>
                </div>
                <el-input v-model=" reason " placeholder="请输入退货原因"></el-input>


                <template #footer>
                    <el-button type="primary" @click=" returnCommodity ">确认</el-button>
                    <el-button type="danger" @click=" returnVisible = false ">取消</el-button>
                </template>
            </el-dialog>
            <el-dialog v-model=" returnShipVisible " title="填写回寄运单号" width="30rem">
                <el-input v-model=" returnShipId " placeholder="请填写回寄运单号"></el-input>
                <template #footer>
                    <el-button type="primary" @click=" confirmReturnShipId ">确认</el-button>
                    <el-button type="danger" @click=" returnShipVisible = false ">取消</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import constant from '@/common/constant';
import router from '@/router';
import { useRoute } from 'vue-router'
import { FetchGetWithToken, FetchPostWithToken, FetchPutWithToken } from '@/util/FetchUtil'
import type Order from '@/interface/Order';
import { useUserStore, usePathStore, useLoadingStore, useCaptchaStore, useUserMessageStore } from '@/stores';
import { ElMessage } from 'element-plus';
import type User from "@/interface/User";
import { storeToRefs } from "pinia";
const userMessageStore = useUserMessageStore();
const cptchaStore = useCaptchaStore();
const loadingStore = useLoadingStore();
const userStore = useUserStore();
const route = useRoute();
const pathStore = usePathStore();
const order = ref<Order>();
FetchGetWithToken("/api/order/oid/" + route.params.oid).then(data => {
    order.value = data;
    loadingStore.closeLoading();
});
const confirmVisible = ref(false);
const toConfirmReceipt = () => {
    confirmVisible.value = true;
}
const confirmReceipt = () => {
    if (score.value <= 0) {
        ElMessage.error("请填写评分");
        return;
    }
    if (comment.value.length < 5) {
        ElMessage.error("请输入5字以上的评价");
        return;
    }
    FetchPutWithToken("/api/order", JSON.stringify({
        oid: order.value!.oid,
        score: score.value,
        comment: comment.value
    })).then(data => {
        ElMessage.success("确认成功!");
        confirmVisible.value = false;
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = confirmReceipt;
            captchaStore.nextMethodParam = undefined;
        }
    });
}
const score = ref(0)
const comment = ref('')
const colors = ref({ 2: '#99A9BF', 3: '#F7BA2A', 4.5: '#FF9900' });
onMounted(() => {
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "我的订单", path: '/buyer/order' },
        { name: "订单详情", path: '/buyer/order/' + order.value?.oid },
    ]
});

const toChat = () => {
    userMessageStore.chatUser = order.value!.user as User
    userMessageStore.messageList = [];
    userMessageStore.fetchMessage();
    userMessageStore.putVirtuaChatUserToMap(order.value!.user);
    userMessageStore.showMessageDrawer();
}

const getOrderStatusName = (order: Order) => {
    switch (order.status) {
        case constant.ORDER_STATUS_CLOSED:
            return '已取消'
        case constant.ORDER_STATUS_NORMAL:
            return order.shipTime ? '等待收货' : '等待发货'
        case constant.ORDER_STATUS_REFUNDED:
            return '已退款'
        case constant.ORDER_STATUS_REFUNDING:
            return '退款中'
        case constant.ORDER_STATUS_COMPLETED:
            return '已完成'
    }
}
const getOrderStatusClass = (order: Order) => {
    switch (order.status) {
        case constant.ORDER_STATUS_CLOSED:
            return 'status-closed'
        case constant.ORDER_STATUS_NORMAL:
            return 'status-normal'
        case constant.ORDER_STATUS_REFUNDED:
            return 'status-refunded'
        case constant.ORDER_STATUS_COMPLETED:
            return 'status-refunded'
    }
}
const toSnapShot = () => {
    router.push({ name: "commodity-snapshot", params: { "ssid": order.value!.ssid } });
}
const returnVisible = ref(false);
//退货原因
const reason = ref();
//退货
const returnCommodity = () => {
    if (reason.value.trim() == '') {
        ElMessage.error("请输入退货原因");
        return;
    }
    FetchPostWithToken("/api/return", JSON.stringify({
        oid: order.value?.oid,
        reason: reason.value
    })).then(data => {
        ElMessage.success("已发起退货申请，请耐心等待卖家响应");
        returnVisible.value = false;
        order.value!.status = constant.ORDER_STATUS_REFUNDING;
    })
}
const returnShipVisible = ref(false);
const returnShipId = ref();
const confirmReturnShipId = () => {
    FetchPostWithToken("/api/return/ship", JSON.stringify({
        oid: order.value?.oid,
        shipId: returnShipId.value
    })).then(data => {
        ElMessage.success("回寄单号填写成功，请耐心等待卖家回应");
    })
}
</script>
<style scoped>
.order-wrapper>div {
    margin-top: .5rem;
}

.commodity-wrapper {
    display: flex;
}

.cover {
    width: 8rem;
}

.commodity-info-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: .5rem;
    width: 100%;
}

.commodity-info-wrapper span {
    margin-top: .8rem;
    font-size: small;
    color: gray;
}

.commodity-info-wrapper .name {
    font-size: larger;
    font-weight: 700;

}

.commodity-info-wrapper .seller-price {
    font-size: small;
    color: rgb(255, 136, 136);
    font-weight: 700;
}

.commodity-info-wrapper .info-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.seller-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.seller-head {
    margin-left: 4rem;
    display: flex;
    align-items: center;
}

.seller-name-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: .5rem;

}

.seller-name {
    font-size: medium;
    font-weight: 700;
}

.seller-username {
    font-size: small;
    color: gray;
}

.seller-appraisal {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.seller-bottom {
    display: flex;
    margin-top: .3rem;
    justify-content: end;
}

.seller-appraisal {
    font-size: small;
    color: gray;
}

.seller-appraisal>span {
    margin-bottom: .1rem;
}

.addr-card {
    display: flex;
    justify-content: space-around;
}

.address-wrapper {
    display: flex;
    flex-direction: column;
}

.address-name {
    font-size: larger;
    font-weight: 700;
}

.address-phone {
    font-weight: 700;
    margin-left: 1rem;
}

.address-detail-wrapper {
    margin-top: .5rem;
    font-size: small;
}

.address-ship {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    font-size: small;

}

.order-detail-wrapper>div {
    margin-top: .4rem;
}

.title {
    font-size: small;
    display: flex;
    justify-content: end;
}

.content {
    font-size: small;
}

.totalAmount {
    font-size: medium;
    color: #e1251b;
    font-weight: 700;

}

.order-bottom {
    display: flex;
    justify-content: end;
}


.confirm-info-wrapper {
    display: flex;
    margin-top: 1rem;
}

.confirm-info-wrapper span {
    margin-top: .3rem;
}

.confirm-info-title,
.confirm-info-content {
    display: flex;
    flex-direction: column;
}

.confirm-info-title {
    text-align: right;
}

.confirm-info-content {
    margin-left: 5rem;
}

.confirm-info-name {
    font-size: large;
    ;
}

.confirm-seller {
    margin-top: 1rem;
}

.order-status {
    font-size: small;
}

.status-closed {
    color: gray !important;
}

.status-normal {
    color: #e1251b !important;
}

.status-refunded {
    color: green !important;
}

.order-return p {
    margin-top: 1rem;
    font-size: .9rem;
}
</style>