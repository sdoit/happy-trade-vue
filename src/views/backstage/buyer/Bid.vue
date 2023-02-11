<template>
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
                        <span class="view-count">浏览量：{{ bid.commodity.viewCount }}</span>
                    </div>
                    <div class="buyer-message-wrapper">
                        <span class="buyer-message">你的留言：{{ bid.messageBuyer }}</span>
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
                            <span class="price-bid">￥{{ bid.price }}</span>
                            <span class="price-tip">你的出价</span>
                        </div>
                    </div>
                </div>
                <div class="seller-reply-wrapper">
                    <div>
                        <span class="result" :class="sellerReplyClass">{{ sellerReply(bid) }}</span>
                        <span class="tips"></span>
                    </div>
                    <div class="bid-button">
                        <el-button size="small">联系卖家</el-button>
                        <el-button size="small">撤销出价</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>

</template>
<script setup lang="ts">
import { ref, computed ,onMounted} from 'vue';
import type CommodityBid from '@/interface/CommodityBid';
import { FetchGetWithToken } from '@/util/fetchUtil';
import { useUserStore,usePathStore } from '@/stores';
import constant from '@/common/constant';
import { ElMessage } from 'element-plus';
const userStore = useUserStore();
const pathStore = usePathStore();
const bids = ref<CommodityBid[]>();
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
const sellerReply = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? '卖家未回复' : bid.agree ? '卖家已同意此报价' : '卖家已拒绝此报价'
}
const sellerReplyClass = (bid: CommodityBid) => {
    return bid.replySeller == undefined ? 'unanswered' : bid.agree ? 'agreed' : 'rejected'
}

onMounted(() => {
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
    margin-left: .5rem;
    margin-top: 1rem;
}

.buyer-message {
    font-size: small;
    font-weight: 700;
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