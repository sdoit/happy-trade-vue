<template>
    <div>
        <el-result v-if="violations == undefined || violations.length == 0" title="没有违规记录" sub-title="没有找到违规记录">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                    <path fill="#888888"
                        d="M704 288h131.072a32 32 0 0 1 31.808 28.8L886.4 512h-64.384l-16-160H704v96a32 32 0 1 1-64 0v-96H384v96a32 32 0 0 1-64 0v-96H217.92l-51.2 512H512v64H131.328a32 32 0 0 1-31.808-35.2l57.6-576a32 32 0 0 1 31.808-28.8H320v-22.336C320 154.688 405.504 64 512 64s192 90.688 192 201.664v22.4zm-64 0v-22.336C640 189.248 582.272 128 512 128c-70.272 0-128 61.248-128 137.664v22.4h256zm201.408 476.16a32 32 0 1 1 45.248 45.184l-128 128a32 32 0 0 1-45.248 0l-128-128a32 32 0 1 1 45.248-45.248L704 837.504V608a32 32 0 1 1 64 0v229.504l73.408-73.408z" />
                </svg>
            </template>
        </el-result>
        <div>

            <el-card :body-style="{ padding: '.3rem' }" v-for="violation in violations" :key="violation.vno" shadow="hover"
                class="card">
                <el-row class="commodity-card">
                    <el-col :span="5" class="img-wrapper" @click="toViolation(violation)">
                        <el-image loading="lazy" :src="
                            constant.NGINX_SERVER_HOST + '/' + getCover(violation)
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
                            <span class="name">{{ violation.target +"-"+violation.reason}}</span>
                        </div>
                        <div class="info">
                            <el-row>
                                <el-col :span="8">
                                    <span>处罚编号：{{ violation.vno }}</span>
                                </el-col>
                                <el-col :span="12">
                                    <span>处罚方式:{{ violation.action }}</span>
                                </el-col>

                            </el-row>
                            <el-row>
                                <el-col>
                                    <span style="font-weight: 700;">处罚原因：{{ violation.reason }}</span>
                                </el-col>
                            </el-row>

                        </div>
                        <div class="bottom-wrapper">
                            <div class="bottom">
                                <time class="launch-time">{{ violation.time }}</time>
                                <div class="commodity-button">
                                    <el-button type="primary" size="small" @click="toViolation(violation)">查看详情</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>

            </el-card>
        </div>

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type Violation from '@/interface/Violation'
import constant from '@/common/constant'
import router from '@/router';
import { useLoadingStore } from '@/stores'
import { FetchGetWithToken } from '@/util/FetchUtil';
const violations = ref<Violation[]>([]);
const loadingStore = useLoadingStore();
const toViolation = (violation: Violation) => {
    router.push({ name: "admin-violation-detail", params: { vno: violation.vno } });
}

const fetchViolation = () => {
    FetchGetWithToken("/admin/violation").then(data => {
        violations.value = data;
        loadingStore.closeLoading();
    })
}
const getCover = (violation: Violation) => {
    switch (violation.target) {
        case "商品":
            return violation.commodity.cover;
        case "求购":
            return violation.request.cover
        case "用户":
            return violation.user.avatar;
        default:
            return '';
    }
}
onMounted(() => {
    fetchViolation();
})
</script>

<style scoped>
.push-button-wrapper {
    display: flex;
    justify-content: flex-end;
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
</style>