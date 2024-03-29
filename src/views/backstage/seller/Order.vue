<template>
    <div>

        <el-result v-if="orders == undefined || orders.length == 0" title="没有订单" sub-title="你还没有卖出过商品">
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


        <div class="order-wrapper">

            <el-card v-for="order in orders" :key="order.oid" @click="toDetail(order)" shadow="hover" class="card">
                <div class="commodity-wrapper">
                    <el-image :src="
                        constant.NGINX_SERVER_HOST + '/' + order.commodity.cover" class="order-cover"></el-image>
                    <div class="info-wrapper">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <span class="order-name">{{ order.name }}</span>
                                <el-tag class="tag" :type="getQualityClass(order.commodity.quality)">{{
                                    order.commodity.quality
                                }}新</el-tag>
                            </div>
                            <div>
                                <span class="order-status" :class="getOrderStatusClass(order)">{{ getOrderStatusName(order)
                                }}</span>
                            </div>

                        </div>

                        <el-row class="margin-top justify-content-between align-items-center">
                            <el-col :span="9" class="flex align-items-center">
                                <el-avatar :src="constant.NGINX_SERVER_HOST + order.user.avatar" :size="20"></el-avatar>
                                <span class="seller-name">@{{ order.user.username }}</span>
                            </el-col>
                            <el-col :span="5">
                                <span class="paytime">{{ order.payTime }}</span>
                            </el-col>
                            <el-col :span="10" class="right-wrapper">
                                <span class="order-price" :class="getPriceClass(order.status)">{{
                                    '￥' + order.totalAmount
                                }}</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>

            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore, usePathStore, useLoadingStore } from '@/stores'
import type Order from '@/interface/Order';
import { FetchGetWithToken } from '@/util/FetchUtil';
import constant from '@/common/constant';
import { ElMessage } from 'element-plus';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import router from '@/router';

const loadingStore = useLoadingStore();
const orders = ref<Order[]>([])
const userStore = useUserStore();
const pathStore = usePathStore();

//获取订单
FetchGetWithToken("/api/order/seller").then(data => {
    orders.value = data;
    loadingStore.closeLoading();

});
const getQualityClass = (quality: number) => {
    if (quality >= 9.5) {
        return 'success' as EpPropMergeType<StringConstructor, "success", unknown>;

    } else if (quality >= 8) {
        return "warning" as EpPropMergeType<StringConstructor, "warning", unknown>;

    } else if (quality >= 7) {

        return "info" as EpPropMergeType<StringConstructor, "info", unknown>;
    } else if (quality < 7) {
        return "danger" as EpPropMergeType<StringConstructor, "danger", unknown>;
    }

}
const getPriceClass = (status: number) => {
    switch (status) {
        case constant.ORDER_STATUS_CLOSED:
            return 'status-closed'
        case constant.ORDER_STATUS_NORMAL:
            return 'status-normal'
        case constant.ORDER_STATUS_REFUNDED:
            return 'status-closed'
        case constant.ORDER_STATUS_COMPLETED:
            return 'status-normal'
        default:
            break;
    }

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
const toDetail = (order: Order) => {
    router.push({ name: "seller-order-detail", params: { "oid": order.oid } });
}
onMounted(() => {
    pathStore.path = [
        { name: "个人中心", path: '/seller/order' },
        { name: "我的订单", path: '/seller/order' },
    ]
});
</script>
<style scoped>
.order-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.order-wrapper>div {
    margin-top: .6rem;
}

.order-cover {
    width: 5rem;
}

.order-name {
    font-size: large;
    font-weight: 700;
    max-width: 30rem;
    min-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

.commodity-wrapper {
    display: flex;
    align-items: center;
}

.commodity-wrapper>div {
    margin-left: .5rem;
}

.info-wrapper {
    width: 100%;
}

.margin-top {
    margin-top: 1rem;
}

.seller-name {
    font-size: small;
    color: gray;
    margin-left: .2rem;
}

.right-wrapper {
    display: flex;
    justify-content: right !important;
}

.flex {
    display: flex;
}

.justify-content-between {
    justify-content: space-between;

}

.justify-content-center {
    justify-content: center;
}

.align-items-center {
    align-items: center;
}

.order-price {
    font-weight: 700;
    color: #e1251b;
}

.card {
    cursor: pointer;
}

.paytime {
    color: gray;
    font-size: smaller;
}

.tag {
    margin-left: .5rem;
}

.order-status {
    font-size: small;
}

.status-closed {
    color: gray;
}

.status-normal {
    color: #e1251b;
}

.status-refunded {
    color: green;
}
</style>