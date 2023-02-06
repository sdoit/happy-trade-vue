<template>
    <div class="step3-wrapper">

        <el-space direction="vertical" :size="30" :fill="true">
            <div>
                <el-space wrap>
                    <el-image :src="constant.NGINX_SERVER_HOST + '/'
                        + bidStepStore.commodity.resources[0].type + '/'
                        + bidStepStore.commodity.resources[0].uid + '/'
                        + bidStepStore.commodity.resources[0].date + '/'
                        + bidStepStore.commodity.resources[0].fileName
                    " style="width: 2rem; height: 2rem"></el-image>
                    <span class="commodity-name">{{ bidStepStore.commodity.name }}</span>
                </el-space>
            </div>
            <div>
                <el-card class="addr-view">
                    <el-space direction="vertical" :fill="true">
                        <div>
                            <el-space wrap>
                                <div>
                                    <el-tag>默认</el-tag>
                                </div>
                                <div>
                                    <span class="addr-name">{{ bidStepStore.address.name }}</span>
                                </div>
                                <div :span="20">
                                    <span class="addr-phone">{{ bidStepStore.address.phone }}</span>
                                </div>
                            </el-space>
                        </div>
                        <div>
                            <div>
                                <span>{{
                                    bidStepStore.address.province + ' ' + bidStepStore.address.city + ' ' +
                                        bidStepStore.address.district + ' ' +
                                        bidStepStore.address.street
                                        + ' ' + bidStepStore.address.address
                                }} </span>
                            </div>
                        </div>
                    </el-space>
                </el-card>
            </div>
            <div>
                <el-space direction="vertical" :fill="true">
                    <span class="bid-tips">你的留言</span>
                    <span class="bid-message">{{ bidStepStore.commodityBid.messageBuyer }}</span>
                </el-space>

            </div>
            <div>
                <div class="step2-price-wrapper">
                    <div class="step2-price-item">
                        <span class="step3-price-seller">￥{{ bidStepStore.commodity.price }}</span>
                        <span class="step2-price-tip">卖家标价</span>
                    </div>
                    <div class="step2-price-item-arrow">
                        <div></div>
                    </div>
                    <div class="step2-price-item">
                        <span class="step3-price">￥{{ bidStepStore.commodityBid.price }}</span>
                        <span class="step2-price-tip">你的出价</span>
                    </div>
                </div>
            </div>
        </el-space>
    </div>

</template>
<script setup lang="ts">
import constant from "@/common/constant";
import { useUserStore, useBidStepStore } from "@/stores"
const userStore = useUserStore();
const bidStepStore = useBidStepStore();
// const props = defineProps(['commodity', 'address', 'bid', 'bidMessage'])
</script>

<style scoped>
.commodity-name {
    font-size: x-large;
    font-weight: 700;
}

.addr-view {
    width: 100%;
}

.step3-wrapper {
    display: flex;
    justify-content: center;
}

.bid-tips {
    font-size: smaller;
    color: gray;
}

.bid-message {
    font-size: large;
    font-weight: 700;
}



.step3-price {
    color: #e1251b;
    font-size: xx-large;
    font-weight: 900;
}

.step3-price-seller {
    color: gray;
    font-size: x-large;
    font-weight: 900;
}
</style>