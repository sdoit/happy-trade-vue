<template>
    <el-card :body-style="{ padding: '.3rem' }" shadow="hover" class="card" style="margin-top: 1rem;">
        <el-row class="commodity-card">
            <el-col :span="22" class="commodity-info-wrapper">
                <div class="name-wrapper">
                    <span class="name">用户申诉：{{ complaint?.violation.target }}</span>
                    <el-tag class="status"
                        :type="complaint?.reply == undefined ? 'warning' : complaint?.withdrawal ? 'success' : 'danger'">{{
                            complaint?.reply == undefined ? '未处理' : complaint?.withdrawal ? '申诉通过' : '申诉未通过'
                        }}</el-tag>
                </div>
                <div class="info">
                    <el-row>
                        <el-col :span="12"> <span>申诉编号：{{ complaint?.cno }}</span></el-col>
                        <el-col :span="12"><span>申诉对象：{{ complaint?.violation.target }}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"> <span>原处罚编号：{{ complaint?.vno }}</span></el-col>
                        <el-col :span="12"><span>申诉人UID：{{ complaint?.uid }}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <span style="font-weight: 700;">申诉理由：{{ complaint?.reason }}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="bottom-wrapper">
                    <div class="bottom">
                        <time class="launch-time">{{ complaint?.time }}</time>

                    </div>
                </div>
            </el-col>
        </el-row>
    </el-card>
    <el-card :body-style="{ padding: '.3rem' }" shadow="hover" class="card">
        <el-row class="commodity-card">
            <el-col :span="5" class="img-wrapper" @click="toCommodity(complaint!.violation.commodity.cid)">
                <el-image loading="lazy" :src="
                    constant.NGINX_SERVER_HOST + '/' + complaint?.violation?.commodity.cover
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
                    <span class="name">{{ complaint?.violation?.commodity.name }}</span>
                    <el-tag class="quality" :type="getQualityClass(complaint?.violation.commodity.quality)">{{
                        complaint?.violation?.commodity.quality
                    }}新</el-tag>

                    <el-tag class="status"
                        :type="complaint?.violation?.commodity.sold ? 'danger' : complaint?.violation?.commodity.launched ? 'success' : 'warning'">{{
                            complaint?.violation?.commodity.sold ? '已售出' : complaint?.violation?.commodity.launched ? '上架中' :
                            '已下架'
                        }}</el-tag>
                </div>
                <div class="priceAndQualityWrapper">
                    <span class="price">{{ "￥ " + complaint?.violation?.commodity.price }}</span>
                </div>
                <div class="info">
                    <el-row>
                        <el-col :span="8">
                            <span>商品编号：{{ complaint?.violation?.commodity.cid }}</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: .7rem;">
                        <el-col :span="12">
                            <!-- <span class="view-count" v-show="complaint!.violation?.commodity?.viewCount > 0">{{
                                complaint?.violation?.commodity?.viewCount
                            }}人看过</span> -->
                        </el-col>
                    </el-row>
                </div>
                <div class="bottom-wrapper">
                    <div class="bottom">
                        <time class="launch-time">{{ complaint?.violation?.commodity.time }}</time>
                        <div class="commodity-button">
                            <el-button type="primary">查看商品详情</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-card>
    <el-card class="box-card" style="margin-top: 1rem;">
        <el-row justify="space-between" class="seller-item">
            <el-col :span="17">
                <el-row class="seller-item">
                    <el-col :span="4">
                        <el-avatar :size="70" :src="constant.NGINX_SERVER_HOST + complaint?.violation?.user.avatar" />
                    </el-col>
                    <el-col :span="20">
                        <el-row>
                            <el-col class="seller-item-text-wrapper seller-item"><span class="seller-nickname">{{
                                complaint?.violation?.user.nickname
                            }}</span></el-col>
                            <el-col class="seller-item-text-wrapper seller-item"><span class="seller-username">@{{
                                complaint?.violation?.user.username
                            }}</span></el-col>
                        </el-row>
                        <el-row class="introduction-wrapper">
                            <el-col class="seller-item-text-wrapper seller-item introduction"><span>{{
                                complaint?.violation?.user.introduction
                            }}</span></el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
    <el-card :body-style="{ padding: '.3rem' }" shadow="hover" class="card" style="margin-top: 1rem;">
        <el-row class="commodity-card">
            <el-col :span="22" class="commodity-info-wrapper">
                <div class="name-wrapper">
                    <span class="name">处罚方式：{{ complaint?.violation?.action }}</span>
                </div>
                <div class="info">
                    <el-row>
                        <el-col :span="12"> <span>处罚编号：{{ complaint?.violation?.vno }}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <span style="font-weight: 700;">处罚原因：{{ complaint?.violation?.reason }}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="bottom-wrapper">
                    <div class="bottom">
                        <time class="launch-time">{{ complaint?.violation?.time }}</time>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-card>
    <div style="margin-top: 1rem; display: flex; justify-content: flex-end;" v-if="complaint?.reply == undefined">
        <el-button type="warning" @click="reject">申诉无效</el-button>
        <el-button type="danger" @click="pass">申诉通过并撤销处罚</el-button>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type Complaint from '@/interface/Complaint'
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { FetchGetWithToken, FetchPostWithToken } from '@/util/FetchUtil';
import { useRoute } from 'vue-router';
import router from '@/router';
import constant from '@/common/constant';
import { useLoadingStore } from '@/stores';
import { data } from 'dom7';
import { ElMessage } from 'element-plus';
const loadingStore = useLoadingStore();
const Route = useRoute();
const complaint = ref<Complaint>();
const fetchComplaint = () => {
    FetchGetWithToken("/admin/complaint/" + Route.params.cno).then(data => {
        complaint.value = data;
        loadingStore.closeLoading();
    });
}
const getQualityClass = (quality?: number) => {
    if (quality == undefined) {
        return 'success' as EpPropMergeType<StringConstructor, "success", unknown>;
    }
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
const reject = () => {
    FetchPostWithToken("/admin/complaint/reject/" + complaint.value?.cno).then(data => {
        ElMessage.success("该申诉不通过");
    });
}
const pass = () => {
    FetchPostWithToken("/admin/complaint/pass/" + complaint.value?.cno).then(data => {
        ElMessage.success("该申诉通过并已撤销对应的处罚");
    });
}

const toCommodity = (cid: string) => {
    router.push({ name: "commodity", params: { cid: cid } })

}
onMounted(() => {
    fetchComplaint();
})
</script>


<style scoped>
.imgs {
    height: 25rem;
}

.res-img {
    height: 100%;
}

.name {
    font-size: xx-large;
}

.commodity-tag {
    margin-right: .3rem;
    margin-top: 1rem;
}

.tips {
    margin-top: 1rem;
}

.tips .quality {
    color: darkgreen;
    font-weight: 700;
    font-size: large;
    margin-left: 1rem;
}

.tips .free-shipping {
    color: darkblue;
    font-weight: 700;
    font-size: large;
    margin-left: 1rem;
}

.tips .view-count {
    color: gray;
    font-size: small;
}

.tips .commodity-type {
    font-size: smaller;
    color: gray;
}

.price-wrapper {
    margin-top: 2rem;
}

.price {
    font-size: xx-large;
    color: #e4393c;
    font-weight: 900;
}

.right-wrapper {
    display: flex;
    justify-content: end;
    align-items: center;
}

.seller-wrapper {
    margin-top: 2rem;
}

.seller-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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

.introduction-wrapper {
    margin-top: .5rem;
}

.introduction {
    font-size: xx-small;
}

.seller-record {
    font-size: xx-small;
    color: firebrick;
}

.button-wrapper {
    margin-top: 2rem;
}

.divider {
    margin-top: 10rem;
    margin-bottom: 3rem;
}

.image-wrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}

.image-wrapper .el-image {
    width: 80%;
}

.description-text {
    font-size: x-large;
    line-height: 2.5rem;
}


.quotation-swapper {
    height: 1.5rem;
    align-items: center;
}

.nickname-wrapper {
    margin-left: .5rem;
}



.quotation-username:hover {
    color: coral;
}

.quotation-price {
    font-size: larger;
    color: #e4393c;
    font-weight: 700;
}

.quotation-padding {
    padding-top: 2rem;
}

.seller-nickname-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.quotation-message {
    height: 100%;
}

.seller-tag {
    margin-left: .3rem;
}


.diversio-wire {
    height: 67%;
    width: 75%;
    border-radius: var(--el-border-radius-small);
    border-left: 1px solid darkgrey;
    border-bottom: 1px solid darkgrey;
}

.seller-responese-agree {
    font-size: small;
    color: green;
    font-weight: 700;
}

.seller-responese-reject {
    font-size: small;
    color: #e1251b;
    font-weight: 700;
}


.quotation-username {
    max-width: 8rem;
    min-width: 4rem;
    font-size: small;
    cursor: default;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

.diversio-wire-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-left: 1rem;
    width: 3rem;
}

.bid-wrapper,
.reply-wrapper {
    display: flex;
}

.message-wrapper {
    margin-left: 1rem;
}


.bid-dialog-wrapper {
    display: flex;
    align-items: center;

}

.steps {
    height: 20rem;
    width: 15rem;
    margin-right: 3rem;
}

.step {
    width: 15rem;
    margin-right: 3rem;
}

.margin-top2 {
    margin-top: 2rem;
}









.order-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.order-wrapper>div {
    margin-top: 2rem;
    width: 90%;
}

.order-commodity-name {
    font-size: x-large;
    font-weight: 700;
}

.order-price-seller {
    font-size: x-large;
    color: #e4393c;
    font-weight: 700;
}

.fade-enter-active {
    transition: opacity 1s ease
}

.fade-leave-active {
    transition: opacity 0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.step-content-wrapper {
    height: 22rem;
    width: 50rem;
}



.card {
    margin-top: .5rem;
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

.info>div {
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

.seller-wrapper {
    margin-top: 2rem;
}

.seller-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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

.introduction-wrapper {
    margin-top: .5rem;
}

.introduction {
    font-size: xx-small;
}
</style>