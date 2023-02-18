<template>
    <div>

        <el-result v-if="bids == undefined || bids.length == 0 && filter == 'all'" title="没有出价"
            sub-title="还没有买家对你的商品出价">
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
        <div class="filter">
            <el-select v-model="filter" class="m-2" size="default">
                <el-option label="全部出价" value="all" />
                <el-option label="未回应" value="no-response" />
                <el-option label="已回应" value="responded" />
                <el-option label="已同意" value="agreed" />
                <el-option label="已拒绝" value="rejected" />
            </el-select>
        </div>
        <div class="bid-card-wrapper" v-if="bids != undefined && bids.length != 0">

            <el-card v-for="bid in bids" :key="bid.bid">
                <div class="wrapper">
                    <div>
                        <el-image :src="constant.NGINX_SERVER_HOST + '/'
                        + bid.cover.type + '/'
                        + bid.cover.uid + '/'
                        + bid.cover.date + '/'
                        + bid.cover.fileName" :fit="'fill'" class="cover"></el-image>
                    </div>
                    <div class="bid-wrapper">
                        <div class="commodity-info-wrapper">
                            <span class="name">{{ bid.commodity.name }}</span>
                            <span class="cid">商品编号：{{ bid.cid }}</span>
                            <span class="time">发布时间：{{ bid.commodity.time }}</span>
                            <span class="price">价格：￥{{ bid.commodity.price }}</span>
                        </div>
                        <el-row class="buyer-wrapper">
                            <el-col :span="2" class="buyer-info-avatar">
                                <el-avatar :size="30" :src="constant.NGINX_SERVER_HOST + bid.avatar"></el-avatar>
                            </el-col>
                            <el-col :span="7" class="buyer-info">
                                <div class="buyer-name-wrapper">
                                    <span class="nickname">{{ bid.nickname }}</span>
                                    <span class="username">@{{ bid.username }}</span>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="price-item">
                                    <span class="price-bid">￥{{ bid.price }}</span>
                                </div>
                            </el-col>
                            <el-col :span="8" class="buyer-info-wrapper">

                                <div class="buyer-message-wrapper">
                                    <span class="buyer-message">{{ bid.messageBuyer }}</span>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="bid-button" v-if="bid.agree == undefined">
                                    <el-button size="small" type="primary">联系买家</el-button>
                                    <el-button size="small" type="success" @click="toAgreeDialog(bid)">同意报价</el-button>
                                    <el-button size="small" type="danger" @click="toRejectDialog(bid)">拒接报价</el-button>
                                </div>
                                <div v-if="bid.agree != undefined" class="bid-result-wrapper">
                                    <span class="bid-result"
                                        :class="bid.agree ? 'bid-result-agreed' : 'bid-result-rejected'">
                                        {{ bid.agree ? "你已同意此报价" : "你已拒绝此报价" }}</span>
                                    <el-button v-if="bid.agree" type="success" class="bid-result-link">订单详情</el-button>
                                </div>
                            </el-col>

                        </el-row>
                        <div :class="bid.agree != undefined ? 'time-created-wrapper' : ''"
                            class="time-created-wrapper-common">
                            <span class="time-created">{{ bid.timeCreated }}</span>
                        </div>
                    </div>
                </div>
            </el-card>
            <div>
                <el-pagination layout="prev, pager, next" v-model:current-page="currentPage" :total="pageTotal" />
            </div>
        </div>

        <el-dialog v-model="agreeDialogVisible" :title="agreeMode ? '同意报价' : '拒绝报价'" width="40rem"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="dialog-wrapper">
                <span class="dialog-commodity-price"><span class="title">商品标价：</span>￥{{ bid?.commodity.price }}</span>
                <span><span class="title"> 买家报价：<span class="dialog-bid-price">￥{{ bid?.price }}</span></span></span>
                <span><span class="title">买家留言：</span></span>
                <span class="dialog-message">{{ bid?.messageBuyer }}</span>
                <span><span class="title">你的留言：</span></span>
                <el-input v-model="sellerMessage" placeholder="请输入你对买家的留言"></el-input>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :type="agreeMode ? 'success' : 'danger'" @click="operate">
                        {{ agreeMode? '同意': '拒绝' }}
                    </el-button>
                    <el-button @click="agreeDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type CommodityBid from '@/interface/CommodityBid';
import { FetchGetWithToken, FetchPostWithToken, FetchGetWithTokenPage } from '@/util/fetchUtil';
import { useUserStore, usePathStore } from '@/stores';
import constant from '@/common/constant';
import { ElLoading, ElMessage } from 'element-plus';
const userStore = useUserStore();
const pathStore = usePathStore();
const bids = ref<CommodityBid[]>();
const currentPage = ref(1);
const sellerMessage = ref();
const agreeDialogVisible = ref(false);
const bid = ref<CommodityBid>();
const agreeMode = ref(true)
const toAgreeDialog = (bidAgree: CommodityBid) => {
    bid.value = bidAgree;
    agreeMode.value = true;
    agreeDialogVisible.value = true;
}
const toRejectDialog = (bidReject: CommodityBid) => {
    bid.value = bidReject;
    agreeMode.value = false;
    agreeDialogVisible.value = true;
}
const operate = () => {


    if (sellerMessage.value.length == 0) {
        ElMessage({
            message: "请输入你对买家的留言",
            type: 'error'
        });
        return;
    }
    const loading = ElLoading.service({
        text: "正在加载..."
    });
    FetchPostWithToken(agreeMode.value ? "/api/bid/agree" : "/api/bid/reject", JSON.stringify({
        bid: bid.value?.bid,
        message: sellerMessage.value
    })).then(result => {
        if (result.flag) {
            ElMessage({
                message: agreeMode.value ? "同意成功，已生成订单" : "拒绝成功，系统已为该用户退款",
                type: 'success'
            });
            agreeDialogVisible.value = false;
            fetchSellerBid();

        } else if (result.code == constant.NOT_LOGIN_CODE) {
            userStore.loginFormVisible = true;
        } else {
            ElMessage({
                message: result.message,
                type: 'error'
            })
        }
        loading.close();
    })
}
const pageTotal = ref<number>(1);
const filter = ref("all");
const fetchSellerBid = () => {
    FetchGetWithTokenPage("/api/bid/seller?page=" + currentPage.value + "&type=" + filter.value).then(result => {
        if (result.flag) {
            bids.value = result.data;
            pageTotal.value = result.total;
        } else if (result.code == constant.NOT_LOGIN_CODE) {
            userStore.loginFormVisible = true;
        } else {
            ElMessage({
                message: result.message,
                type: 'error'
            })
        }
    });
}
watch(currentPage, () => {
    fetchSellerBid();
})
watch(filter, () => {
    fetchSellerBid();
})

const sellerReply = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? '卖家未回复' : bid.agree ? '卖家已同意此报价' : '卖家已拒绝此报价'
}
const sellerReplyClass = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? 'unanswered' : bid.agree ? 'agreed' : 'rejected'
}
onMounted(() => {
    fetchSellerBid();
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "我的出价", path: '/buyer/bid' },
    ]
});
</script>
<style scoped>
.unanswered {
    color: red;
}

.agreed {
    color: darkgreen;
}

.rejected {
    color: gray;
    text-decoration: line-through;
}

.bid-card-wrapper>div {
    margin-top: 1rem;
}

.cover {
    width: 14rem;
}

.bid-wrapper {
    width: 100%;
}

.commodity-info-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: .5rem;
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

.price-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.price-item {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.price {
    font-size: medium;
    font-weight: 500;
}

.price-bid {
    color: red;
    font-weight: 700;
    font-size: medium;
}

.price-tip {
    margin-top: .5rem;
    color: gray;
    font-size: .1rem;
}


.buyer-message-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.buyer-message {
    font-size: small;
    font-weight: 600;
}

.buyer-wrapper {
    display: flex;
    align-items: center;
    margin-top: 1rem;
}

.buyer-info-wrapper {
    display: flex;
    width: 100%;
    margin-left: .5rem;

}

.buyer-info {
    display: flex;
    padding-left: .3rem;
}

.buyer-info-avatar {
    display: flex;
    justify-content: end;
}

.buyer-name-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.wrapper {
    display: flex;
}

.nickname {
    font-size: small;
    font-weight: 700;
    max-width: 8rem;
    min-width: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

.username {
    font-size: x-small;
    color: gray;
}

.bid-button-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
}

.time-created-wrapper-common {
    margin-left: .7rem;
}

.time-created-wrapper {
    margin-top: 1rem;
    margin-left: .7rem;
}

.time-created {
    font-size: small;
    color: gray;
    margin-top: .3rem;
}

.bid-button {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.bid-button>button {
    margin-top: .3rem;
}

.dialog-commodity-price {
    font-size: small;

}

.dialog-bid-price {
    font-size: medium;
    color: red;
}

.dialog-wrapper {
    display: flex;
    flex-direction: column;
    font-weight: 600;
}

.dialog-wrapper>span {
    font-size: small;
    margin-top: .2rem;
    margin-bottom: .5rem;
}

.dialog-message {
    font-size: xx-small;
}

.title {
    color: gray;
}

.filter {
    display: flex;
    justify-content: flex-end;
}

.bid-result-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bid-result {
    font-size: xx-small;
    font-weight: 600;
}

.bid-result-link {
    margin-top: 1rem;
    font-size: xx-small;
}

.bid-result-agreed {
    color: green;
}

.bid-result-rejected {
    color: darkred;
}
</style>