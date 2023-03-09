<template>
    <div>
        <el-result v-if="show" title="没有出价" sub-title="你还没有对任何商品有过出价">
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
        <div class="bid-card-wrapper">
            <el-card v-for="bid in bids" :key="bid.bids[0].bid">
                <el-row class="bid-wrapper">
                    <el-col :span="6">
                        <a :href="'/commodity/' + bid.cid">
                            <el-image :src="constant.NGINX_SERVER_HOST + '/' + bid.cover" :fit="'fill'"
                                class="cover"></el-image>
                        </a>

                    </el-col>
                    <el-col :span="14">
                        <div class="commodity-info-wrapper">
                            <span class="name">{{ bid.name }}</span>
                            <span class="cid">商品编号：{{ bid.cid }}</span>
                            <span class="time">发布时间：{{ bid.time }}</span>
                        </div>
                        <div class="buyer-message-wrapper">
                            <span class="buyer-message">你的留言：{{ bid.bids[0].messageBuyer }}</span>
                            <span class="time-created">{{ bid.bids[0].timeCreated }}</span>
                        </div>
                        <div class="price-wrapper">
                            <div class="price-item">
                                <span class="price">￥{{ bid.price }}</span>
                                <span class="price-tip">卖家标价</span>
                            </div>
                            <div class="price-item-arrow">
                                <div></div>
                            </div>
                            <div class="price-item">
                                <span class="price-bid" :class="myBidPriceClass(bid)">￥{{ bid.bids[0].price }}</span>
                                <span class="price-tip">你的出价</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4" class="seller-reply-wrapper">
                        <div class="seller-reply">
                            <span class="result" :class="sellerReplyClass(bid)">{{ sellerReply(bid) }}</span>

                            <span class="reply" :class="sellerReplyClass(bid)">{{ bid.bids[0].replySeller }}</span>
                        </div>
                        <div class="bid-button">
                            <el-button size="small" type="primary" @click="toChat(bid.bids[0].seller)">联系卖家</el-button>
                            <el-popconfirm title="确定要撤销出价吗?" confirm-button-text="确定撤销" cancel-button-text="不撤销"
                                confirm-button-type="danger" cancel-button-type="primary" @confirm="revoke(bid)"
                                width="11rem">
                                <template #reference>
                                    <el-button :disabled="bid.bids[0].agree != undefined || bid.bids[0].cancel == true"
                                        size="small" type="danger">撤销出价</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CommodityBid } from '@/interface/CommodityBid';
import { FetchGetWithToken, FetchPostWithToken } from '@/util/FetchUtil';
import { useUserStore, usePathStore, useLoadingStore, useCaptchaStore, useUserMessageStore } from '@/stores';
import constant from '@/common/constant';
import { ElMessage } from 'element-plus';
import type User from '@/interface/User';
const loadingStore = useLoadingStore();
const show = ref();
const userStore = useUserStore();
const pathStore = usePathStore();
const bids = ref<CommodityBid[]>();
const userMessageStore = useUserMessageStore();
const fetchCommodityBids = () => {
    userStore.checkLogin().then(data => {
        FetchGetWithToken("/api/bid").then(data => {
            bids.value = data;
            show.value = bids.value == undefined || bids.value.length == 0
            loadingStore.clodeLoading();
        })

    });
}
const revoke = (bid: CommodityBid) => {
    FetchPostWithToken("/api/bid/revoke/" + bid.bids[0].bid).then(result => {
        ElMessage({
            message: '撤销成功',
            type: 'success'
        });
        fetchCommodityBids();


    }).catch((e: Error) => {
        if (e.message = constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION.toString()) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = revoke;
            captchaStore.nextMethodParam = bid;
        }
    });
}


const sellerReply = (bid: CommodityBid) => {

    if (bid.bids[0].cancel) {
        return "已撤销出价";
    }
    return bid.bids[0].replySeller == undefined ? '卖家未回复' : bid.bids[0].agree ? '卖家已同意此报价' : '卖家已拒绝此报价'
}
const sellerReplyClass = (bid: CommodityBid) => {
    if (bid.bids[0].cancel) {
        return "rejected-reply";
    }
    return bid.bids[0].replySeller == undefined ? '' : bid.bids[0].agree ? 'agreed-reply' : 'rejected-reply'

}
const myBidPriceClass = (bid: CommodityBid) => {
    return bid.bids[0].replySeller == undefined ? 'unanswered' : bid.bids[0].agree ? 'agreed' : 'rejected'
}

const toChat = (seller: User) => {
    userMessageStore.chatUser =seller;
    userMessageStore.messageList = [];
    userMessageStore.fetchMessage();
    userMessageStore.putVirtuaChatUserToMap(seller);
    userMessageStore.showMessageDrawer();
}

onMounted(() => {
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "我的出价", path: '/buyer/bid' },
    ]
    fetchCommodityBids();
});
</script>
<style scoped>
.unanswered {
    color: #e4393c;
}

.agreed {
    color: darkgreen;
}

.rejected {
    color: gray !important;
    text-decoration: line-through;
}

.agreed-reply {
    color: green;
    font-weight: 700;
}

.rejected-reply {
    color: #e4393c !important;
    font-weight: 700;
}

.bid-card-wrapper>div {
    margin-top: 1rem;
}

.cover {
    width: 12rem;
}

.bid-wrapper {
    display: flex;
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
    color: gray;
    font-size: medium;
    font-weight: 500;
}

.price-bid {
    color: #e4393c;
    font-weight: 700;
    font-size: larger;
}

.price-tip {
    margin-top: .5rem;
    color: gray;
    font-size: .1rem;
}

.price-item-arrow {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.price-item-arrow div {
    width: 100%;
    height: 1px;
    border-top: 1px solid rgb(177, 177, 177);
}

.buyer-message-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: .5rem;
    margin-top: 1rem;
}

.buyer-message-wrapper .time-created {
    font-size: xx-small;
    margin-top: .5rem;
}

.buyer-message {
    font-size: small;
    font-weight: 700;
}

.seller-reply {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.seller-reply .reply {
    font-size: xx-small;
    font-weight: 500 !important;
    margin-top: 1rem;
    max-width: 15rem;
    min-width: 4rem;
    font-size: small;
    cursor: default;
    /*设置 用来限制在一个块元素显示的文本的行数*/
    -webkit-line-clamp: 10;
    /*必须结合的属性 将对象作为弹性伸缩盒子模型显示 */
    display: -webkit-box;
    /*必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-box-orient: vertical;
    /*溢出隐藏*/
    overflow: hidden;
    /*超出显示省略号*/
    text-overflow: ellipsis;
}

.seller-reply-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
}

.seller-reply-wrapper .bid-button {
    display: flex;
}

.seller-reply-wrapper .result {
    font-size: small;
    color: gray;
    padding-top: 1rem;
}
</style>