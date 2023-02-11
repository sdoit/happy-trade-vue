<template>
    <div class="order-wrapper">
        
        <el-card v-for="order in orders" :key="order.oid" @click="toDetail(order)" shadow="hover" class="card">
            <div class="commodity-wrapper">
                <el-image :src="
                    constant.NGINX_SERVER_HOST + '/'
                    + order.cover.type + '/'
                    + order.cover.uid + '/'
                    + order.cover.date + '/'
                    + order.cover.fileName
                " class="order-cover"></el-image>
                <div class="info-wrapper">
                    <div>
                        <span class="order-name">{{ order.name }}</span>
                        <el-tag class="tag" :type="getQualityClass(order.commodity.quality)">{{
                            order.commodity.quality
                        }}新</el-tag>
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
                            <span class="order-price">{{
                                order.status == 0 ? ('￥' + order.totalAmount) :
                                    order.statusName
                            }}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore, usePathStore } from '@/stores'
import type Order from '@/interface/Order';
import { FetchGetWithToken } from '@/util/fetchUtil';
import constant from '@/common/constant';
import { ElMessage } from 'element-plus';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import router from '@/router';

const orders = ref<Order[]>([])
const userStore = useUserStore();
const pathStore = usePathStore();

//获取订单
FetchGetWithToken("/api/order").then((result) => {
    if (result.flag) {
        orders.value = result.data;
    } else if (result.code == constant.NOT_LOGIN_CODE) {
        userStore.loginFormVisible = true;
    } else {
        ElMessage({
            message: result.message,
            type: "error"
        });
    }
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

const toDetail = (order: Order) => {
    router.push({ name: "buyer-order-detail", params: { "oid": order.oid } });
}
onMounted(() => {
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "我的订单", path: '/buyer/order' },
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
</style>