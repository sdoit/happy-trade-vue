<template>
    <div>
        <div class="wrapper">
            <el-carousel class="imgs" :arrow="'hover'">
                <el-carousel-item v-for="res in bidStepStore.commodity.resources" :key="res.fileName" class="imgs">
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
            <div class="info">
                <el-row>
                    <el-col>
                        <span class="title">商品名</span>
                    </el-col>
                </el-row>
                <el-row class="margin-top">
                    <el-col :offset="2">
                        <span class="name">{{ bidStepStore.commodity.name }}</span>
                    </el-col>
                </el-row>

                <el-row class="margin-top2">
                    <el-col>
                        <span class="title">卖家标价</span>
                    </el-col>
                </el-row>
                <el-row class="margin-top">
                    <el-col :offset="2">
                        <span class="price">￥{{ bidStepStore.commodity.price }}</span>
                    </el-col>
                </el-row>
                <el-row class="margin-top2">
                    <el-card class="box-card">
                        <el-row justify="space-between" class="seller-item">
                            <el-col :span="10">
                                <el-row class="seller-item">
                                    <el-col :span="6">
                                        <el-avatar :size="40"
                                            :src="constant.NGINX_SERVER_HOST + bidStepStore.seller.avatar" />
                                    </el-col>
                                    <el-col :span="18">
                                        <el-row>
                                            <el-col class="seller-item-text-wrapper seller-item"><span
                                                    class="seller-nickname">{{
                                                        bidStepStore.seller.nickname
                                                    }}</span></el-col>
                                            <el-col class="seller-item-text-wrapper seller-item"><span
                                                    class="seller-username">@{{
                                                        bidStepStore.seller.username
                                                    }}</span></el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="12">
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
                </el-row>

            </div>
        </div>
        <el-row class="bottom">
            <el-form :inline="true">
                    <el-form-item label="你的出价">
                        <el-input-number v-model="bidStepStore.commodityBid.price" :precision="2" :step="0.01"
                            :max="999999999" :controls="false" placeholder="请输入合理的价格" />
                    </el-form-item>
                    <el-form-item label="对卖家的留言">
                        <!-- <span>留言</span> -->
                        <el-input v-model="bidStepStore.commodityBid.messageBuyer" placeholder="请输入你要对卖家的留言" />
                    </el-form-item>
            </el-form>
        </el-row>

    </div>
</template>
<script setup lang="ts">
import constant from "@/common/constant";
import { ref } from "vue";
import { useBidStepStore } from '@/stores'

const bidStepStore = useBidStepStore();

</script>

<style scoped>
.wrapper {
    display: flex;
}

.wrapper .imgs {
    width: 20rem;
}

.res-img {
    height: 100%;
}

.info {
    margin-left: 1rem;
}

.title {
    font-size: medium;
}

.name {
    font-size: large;
}

.price {
    font-size: large;
    color: #e1251b;
}

.margin-top {
    margin-top: 1rem;
}

.margin-top2 {
    margin-top: 2.5rem;
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

.seller-record {
    font-size: xx-small;
    color: firebrick;
}

.bottom {
    display: flex;
    justify-content: flex-end;
}

.right-wrapper {
    display: flex;
    justify-content: end;
    align-items: center;
}
</style>