<template>
    <div>
        <el-result v-if="reports == undefined || reports.length == 0" title="没有举报" sub-title="现在还没有举报需要处理">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                    <path fill="#888888"
                        d="M704 288h131.072a32 32 0 0 1 31.808 28.8L886.4 512h-64.384l-16-160H704v96a32 32 0 1 1-64 0v-96H384v96a32 32 0 0 1-64 0v-96H217.92l-51.2 512H512v64H131.328a32 32 0 0 1-31.808-35.2l57.6-576a32 32 0 0 1 31.808-28.8H320v-22.336C320 154.688 405.504 64 512 64s192 90.688 192 201.664v22.4zm-64 0v-22.336C640 189.248 582.272 128 512 128c-70.272 0-128 61.248-128 137.664v22.4h256zm201.408 476.16a32 32 0 1 1 45.248 45.184l-128 128a32 32 0 0 1-45.248 0l-128-128a32 32 0 1 1 45.248-45.248L704 837.504V608a32 32 0 1 1 64 0v229.504l73.408-73.408z" />
                </svg>
            </template>
        </el-result>
        <div>

            <el-card :body-style="{ padding: '.3rem' }" v-for="report in reports" :key="report.rno" shadow="hover"
                class="card">
                <el-row class="commodity-card">
                    <el-col :span="5" class="img-wrapper" @click="toReport(report)">
                        <el-image loading="lazy" :src="
                            constant.NGINX_SERVER_HOST + '/' + getTargeCover(report)" :fit="'fill'" class="cover">
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
                            <span class="name">{{ report.target }}</span>

                            <el-tag class="status"
                                :type="report.valid == undefined ? 'warning' : report.valid ? 'success' : 'danger'">{{
                                    report.valid == undefined ? '未处理' : report.valid ? '举报通过' : '举报未通过'
                                }}</el-tag>
                        </div>
                        <div class="info">
                            <span>举报编号：{{ report.rno }}</span>
                            <span>举报对象：{{ report.target }}</span>
                            <span>举报人：{{ report.uid }}</span>
                            <span>被举报人：{{ report.uidTarget }}</span>
                            <span>举报理由：{{ report.reason }}</span>
                         
                        </div>
                        <div class="bottom-wrapper">
                            <div class="bottom">
                                <time class="launch-time">{{ report.time }}</time>
                                <div class="commodity-button">
                                    <el-button type="primary" size="small" v-if="report.reply == undefined"
                                        @click="toReport(report)">查看详情</el-button>
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
import { ref, onMounted } from 'vue';
import type Report from '@/interface/Report'
import constant from '@/common/constant'
import router from '@/router';
import { FetchGetWithToken } from '@/util/FetchUtil'
import { useLoadingStore } from '@/stores';
import { useRoute } from 'vue-router';
const Route=useRoute();
const loadingStore = useLoadingStore();
const reports = ref<Report[]>([]);
const toReport = (report: Report) => {
    router.push({ name: "admin-report-detail", params: { rno: report.rno } });
}
const fetchReport = () => {
    FetchGetWithToken("/admin/report").then(data => {
        reports.value = data;
        loadingStore.closeLoading();
    })
}

const getTargeCover = (report: Report) => {
    switch (report.target) {
        case constant.TARGET_TYPE_COMMODITY:
            return report.commodity.cover
        case constant.TARGET_TYPE_REQUEST:
            return report.request.cover
        case constant.TARGET_TYPE_User:
            return report.user.avatar
        default:
            break;
    }
}

onMounted(() => {
    fetchReport();
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