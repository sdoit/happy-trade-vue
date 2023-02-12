<template>
    <div>
        <div v-if="order != undefined" class="order-wrapper">
            <el-card>
                <div class="commodity-wrapper">
                    <div>
                        <el-image :src="constant.NGINX_SERVER_HOST + '/'
                        + order.cover.type + '/'
                        + order.cover.uid + '/'
                        + order.cover.date + '/'
                        + order.cover.fileName" :fit="'fill'" class="cover"></el-image>
                    </div>
                    <div class="commodity-info-wrapper">
                        <span class="name">{{ order.name }}</span>
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
                            <span>作为卖家卖出432件商品，好评率67%</span>
                            <span>作为买家买到64件商品，好评率98%</span>
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
                        <span>运单号：34098759348275</span>
                        <span>发货时间：2023年2月8日20点23分</span>
                    </div>
                </div>


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
                        <el-button size="small">联系卖家</el-button>
                        <el-button size="small">退货申请</el-button>
                        <el-button size="small">交易快照</el-button>
                    </div>
                </div>

            </el-card>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import constant from '@/common/constant';
import router from '@/router';
import { useRoute } from 'vue-router'
import { FetchGetWithToken } from '@/util/fetchUtil'
import { fill, result } from 'lodash';
import type Order from '@/interface/Order';
import { useUserStore, usePathStore } from '@/stores';
import { ElMessage } from 'element-plus';
const userStore = useUserStore();
const route = useRoute();
const pathStore = usePathStore();
const order = ref<Order>();
FetchGetWithToken("/api/order/oid/" + route.params.oid).then(result => {
    if (result.flag) {
        order.value = result.data;
    } else if (result.code == constant.NOT_LOGIN_CODE) {
        userStore.loginFormVisible = true;
    } else {
        ElMessage({
            message: result.message,
            type: "error"
        });
    }
})

onMounted(() => {
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "我的订单", path: '/buyer/order' },
        { name: "订单详情", path: '/buyer/order/' + order.value?.oid },
    ]
});
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

.seller-wrapper .seller-name-wrapper {
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
</style>