<template>
    <div>

        <el-result v-if="bids == undefined || bids.length == 0" title="没有出价" sub-title="你还没有对任何商品有过出价">
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
            <el-card v-for="bid in bids" :key="bid.bid">
                <div class="bid-wrapper">
                    <div>
                        <el-image :src="constant.NGINX_SERVER_HOST + '/'
                        + bid.cover.type + '/'
                        + bid.cover.uid + '/'
                        + bid.cover.date + '/'
                        + bid.cover.fileName" :fit="'fill'" class="cover"></el-image>
                    </div>
                    <div>
                        <div class="commodity-info-wrapper">
                            <span class="name">{{ bid.commodity.name }}</span>
                            <span class="cid">商品编号：{{ bid.cid }}</span>
                            <span class="time">发布时间：{{ bid.commodity.time }}</span>
                        </div>
                        <div class="buyer-message-wrapper">
                            <span class="buyer-message">你的留言：{{ bid.messageBuyer }}</span>
                            <span class="time-created">{{ bid.timeCreated }}</span>
                        </div>
                        <div class="price-wrapper">
                            <div class="price-item">
                                <span class="price">￥{{ bid.commodity.price }}</span>
                                <span class="price-tip">卖家标价</span>
                            </div>
                            <div class="price-item-arrow">
                                <div></div>
                            </div>
                            <div class="price-item">
                                <span class="price-bid" :class="myBidPriceClass(bid)">￥{{ bid.price }}</span>
                                <span class="price-tip">你的出价</span>
                            </div>
                        </div>
                    </div>
                    <div class="seller-reply-wrapper">
                        <div class="seller-reply">
                            <span class="result" :class="sellerReplyClass(bid)">{{ sellerReply(bid) }}</span>
                            
                            <span class="reply" :class="sellerReplyClass(bid)">{{ bid.replySeller }}</span>
                        </div>
                        <div class="bid-button">
                            <el-button size="small" type="primary">联系卖家</el-button>
                            <el-button :disabled="bid.agree != undefined || bid.cancel == true" size="small"
                                type="danger" @click="revoke(bid)">撤销出价</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type CommodityBid from '@/interface/CommodityBid';
import { FetchGetWithToken, FetchPostWithToken } from '@/util/fetchUtil';
import { useUserStore, usePathStore } from '@/stores';
import constant from '@/common/constant';
import { ElMessage } from 'element-plus';
import { result } from 'lodash';
const userStore = useUserStore();
const pathStore = usePathStore();
const bids = ref<CommodityBid[]>();

const fetchCommodityBids = () => {
    userStore.checkLogin().then(result => {
        if (result.flag) {
            FetchGetWithToken("/api/bid").then(result => {
                if (result.flag) {
                    bids.value = result.data;
                } else if (result.code == constant.NOT_LOGIN_CODE) {
                    userStore.loginFormVisible = true;
                } else {
                    ElMessage({
                        message: result.message,
                        type: 'error'
                    })
                }
            })
        } else {
            userStore.loginFormVisible = true;
        }
    });
}
const revoke = (bid: CommodityBid) => {
    FetchPostWithToken("/api/bid/revoke/" + bid.bid).then(result => {
        if (result.flag) {
            ElMessage({
                message: '撤销成功',
                type: 'success'
            });
            fetchCommodityBids();

        } else if (result.code == constant.NOT_LOGIN_CODE) {
            userStore.loginFormVisible = true;
        } else {
            ElMessage({
                message: result.message,
                type: 'error'
            });
        }
    });
}


const sellerReply = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? '卖家未回复' : bid.agree ? '卖家已同意此报价' : '卖家已拒绝此报价'
}
const sellerReplyClass = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? '' : bid.agree ? 'agreed-reply' : 'rejected-reply'

}
const myBidPriceClass = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? 'unanswered' : bid.agree ? 'agreed' : 'rejected'
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
    color: red;
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
    color: red !important;
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
    color: red;
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
.buyer-message-wrapper .time-created{
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
}
</style>