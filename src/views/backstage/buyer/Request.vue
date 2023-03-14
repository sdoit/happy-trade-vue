<template>
    <div class="bid-card-wrapper" v-if="requests.length != 0">
        <el-card v-for="request in requests" :key="request.rid">
            <div class="wrapper">
                <el-row>
                    <el-col :span="6">
                        <el-image :src="constant.NGINX_SERVER_HOST + '/' + request.cover" :fit="'fill'"
                            class="cover"></el-image>
                    </el-col>
                    <el-col :span="17" :offset="1" class="bid-wrapper">
                        <div class="commodity-info-wrapper">
                            <span class="name">{{ request.name }}</span>
                            <span class="cid">求购编号：{{ request.rid }}</span>
                            <span class="time">发布时间：{{ request.time }}</span>
                            <span class="price">预计价格：￥{{ request.price }}</span>
                            <span class="price">浏览人数：{{ request.viewCount }}</span>
                            <span class="price">出货人数：{{ request.cidCount }}</span>

                        </div>
                        <div class="commodity-button" style="display: flex; justify-content: flex-end;">
                            <el-button type="primary" size="small" v-if="!request.completed">编辑</el-button>
                            <el-button :type="request.launched ? 'warning' : 'primary'" size="small"
                                v-if="!request.completed"
                                @click="request.launched ? getDown(request) : uploaded(request)">{{
                                    request.launched ? '下架' : '上架' }}</el-button>

                            <el-popconfirm title="你确定永久删除本商品吗?" confirm-button-text="确定删除" cancel-button-text="取消"
                                confirm-button-type="danger" cancel-button-type="primary" @confirm="deleteRequest(request)"
                                width="11rem">
                                <template #reference>
                                    <el-button type="danger" size="small" v-if="!request.completed">删除</el-button>
                                </template>
                            </el-popconfirm>


                            <el-button type="primary" size="small" v-if="request.completed"
                                @click="toOrderDetail(request)">查看订单</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-divider />
                        <el-card :body-style="{ padding: '.3rem' }" v-for="commodity in commodityMap.get(request.rid) "
                            :key="commodity.cid" shadow="hover" class="card">
                            <el-row class="commodity-card">
                                <el-col :span="5" class="img-wrapper" @click="toCommodity(commodity)">
                                    <el-image loading="lazy" :src="
                                        constant.NGINX_SERVER_HOST + '/' + commodity.cover
                                    " :fit="'fill'" class="cover">
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
                                </el-col>
                                <el-col :span="17" class="commodity-info-wrapper">
                                    <div class="name-wrapper">
                                        <span class="name"> {{ commodity.name }}</span>
                                        <el-tag class="quality" :type="getQualityClass(commodity.quality)">{{
                                            commodity.quality
                                        }}新</el-tag>

                                        <el-tag class="status"
                                            :type="commodity.sold ? 'danger' : commodity.launched ? 'success' : 'warning'">{{
                                                commodity.sold ? '已售出' : commodity.launched ? '上架中' :
                                                '已下架'
                                            }}</el-tag>
                                    </div>
                                    <div class="priceAndQualityWrapper">
                                        <span class="price">{{ "￥ " + commodity.price }}</span>
                                    </div>
                                    <div class="info">
                                        <span>商品编号：{{ commodity.cid }}</span>
                                        <span>类型：{{ commodity.type.typeName }}</span>
                                        <span class="view-count" v-show="commodity.viewCount > 0">{{
                                            commodity.viewCount
                                        }}人看过</span>
                                    </div>
                                    <div class="bottom-wrapper">
                                        <div class="bottom">
                                            <time class="launch-time">{{ commodity.time }}</time>
                                            <div class="commodity-button">
                                                <el-button type="primary" size="small" v-if="!commodity.sold"
                                                    :disabled="commodity.bidCount == '0'"
                                                    @click="toCommodity(commodity)">查看详情</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>

                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import type { CommodityBid, Bid } from '@/interface/CommodityBid';
import type Commodity from '@/interface/Commodity';
import type Request from '@/interface/Request';
import { FetchGetWithToken, FetchPostWithToken, FetchGetWithTokenPage } from '@/util/FetchUtil';
import { useUserStore, usePathStore, useLoadingStore, useCaptchaStore } from '@/stores';
import constant from '@/common/constant';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import router from '@/router';
import { ElLoading, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router'
const loadingStore = useLoadingStore();
const userStore = useUserStore();
const pathStore = usePathStore();
const commodityMap = ref<Map<string, Commodity[]>>(new Map<string, Commodity[]>());
const requests = ref<Request[]>([]);
const sellerMessage = ref();
const agreeDialogVisible = ref(false);
const bid = ref<Bid>();
const commodityOprate = ref<CommodityBid>();
const agreeMode = ref(true);


const fetchRequest = async () => {
    await FetchGetWithToken("/api/request/u").then(data => {
        requests.value = data;
    });
    for await (const request of requests.value) {
        fetchCommodityForRequest(request.rid);
    }
}

const fetchCommodityForRequest = async (rid: string) => {
    await FetchGetWithToken("/api/request/commodity/" + rid).then(data => {
        if (data != null) {
            commodityMap.value.set(rid, data);
        }
    })
}
const getDown = (request: Request) => {

}
const uploaded = (request: Request) => {

}
const deleteRequest = (request: Request) => {

}
const toOrderDetail = (request: Request) => {

}
const toCommodity = (commodity: Commodity) => {
    router.push({ name: "commodity", params: { cid: commodity.cid } });
}
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
onMounted(async () => {
    await fetchRequest();
    loadingStore.closeLoading();

})

</script>

<style scoped>
.unanswered {
    color: #e4393c;
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

/* .cover {
    width: 14rem;
} */

.bid-wrapper {
    width: 100%;
}

.bid-card {
    margin-top: 1rem;
    border-top: 1px solid rgba(202, 202, 202, 0.363);

}

.commodity-info-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: .5rem;
}

.commodity-info-wrapper>span {
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

.price-item>span {
    font-size: large;
}

.price {
    font-size: medium;
    font-weight: 500;
}

.price-bid {
    color: #e4393c;
    font-weight: 700;
    font-size: medium;
}

.price-tip {
    margin-top: .5rem;
    color: gray;
    font-size: .1rem;
}



.buyer-message {
    font-size: small;
    font-weight: 600;
}

.buyer-wrapper {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    justify-content: space-evenly;
}

.buyer-info-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-left: .5rem;

}

.buyer-message-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: .5rem;

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



.nickname {
    font-size: smaller;
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
    margin-top: .1rem;
}

.bid-button-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
}


.time-created {
    font-size: xx-small;
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
    color: #e4393c;
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


.commodity-card {
    justify-content: space-around;
}

.img-wrapper {
    cursor: pointer;
}

.loading-tips {
    text-align: center;
    font-size: small;
    color: gray;
    margin-top: .3rem;
}

.name-wrapper {
    display: flex;
    align-items: flex-start;
}

.name-wrapper .status {
    margin-left: .5rem;
}

.name {
    font-size: large;
    font-weight: 700;
}

.commodity-info-wrapper {
    font-size: small;
}

.commodity-info-wrapper>div {
    margin-top: .5rem;
}

.info {
    display: flex;
    flex-direction: column;
}

.info>span {
    margin-top: .5rem;
}

.priceAndQualityWrapper {
    margin-top: 1rem !important;
}

.quality {
    margin-left: .3rem;
}

.price {
    font-size: larger;
    color: #e4393c;
}

.bottom-wrapper {
    display: flex;
    flex-direction: column;
}

.bottom {
    display: flex;
    justify-content: space-between;
}

.view-count {
    font-size: small;
    color: gray;
}

.launch-time {
    margin-top: .3rem;
    font-size: small;
    color: gray;
}



.commodity-button {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}

.commodity-button>button {
    margin-top: .3rem;
}
</style>