<template>
    <div>
        <el-result v-if="show" title="没有浏览历史" sub-title="你还没浏览过过任何商品">
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
        <div class="infinite-list-wrapper" v-if="isMounted && rowCount != 0">
            <div v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled"
                infinite-scroll-immediate="false">
                <el-row v-for="i in rowCount" class="list-item" :gutter="5">
                    <el-col v-for="viewHistory, index in viewHistoryList.slice((i - 1) * 4, i * 4)" :key="index" :span="6">
                        <router-link :to="{ name: 'commodity', params: { cid: viewHistory.commodity.cid } }" class="a">
                            <el-card :body-style="{ padding: '.3rem' }" shadow="hover">
                                <div class="img-wrapper">
                                    <el-image loading="lazy" :src="
                                        constant.NGINX_SERVER_HOST + '/' + viewHistory.commodity.cover" :fit="'fill'"
                                        class="cover">
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
                                </div>
                                <div style="padding: 14px">
                                    <div class="priceAndQualityWrapper">
                                        <span class="price">{{ "￥ " + viewHistory.commodity.price }}</span>
                                        <el-tag class="quality" :type="getQualityClass(viewHistory.commodity.quality)">{{
                                            viewHistory.commodity.quality
                                        }}新</el-tag>
                                    </div>
                                    <div class="name-wrapper">
                                        <span class="name">{{ viewHistory.commodity.name }}</span>
                                    </div>
                                    <div class="bottom">
                                        <time class="view-time">{{ viewHistory.time }}</time>
                                        <span class="view-count" v-show="viewHistory.commodity.viewCount > 0">{{
                                            viewHistory.commodity.viewCount
                                        }}人看过</span>
                                    </div>


                                </div>
                            </el-card>
                        </router-link>
                    </el-col>
                </el-row>
            </div>
            <p v-if="loading" class="bottomTips">正在获取更多 请稍等...</p>
            <p v-if="noMore" class="bottomTips">没有更多了...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import constant from "@/common/constant";
import type Commodity from '@/interface/Commodity';
import type CommonResult from "@/interface/CommonResult";
import type ViewHistory from "@/interface/ViewHistory";
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { FetchGetWithToken } from '@/util/FetchUtil';
import { useUserStore, usePathStore, useLoadingStore } from '@/stores'
import { ElLoading, ElMessage } from 'element-plus';
const loadingStore = useLoadingStore();
const show = ref();
const userStore = useUserStore();
const rowCount = ref(0);
const page = ref(0);
const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value)
const viewHistoryList = ref<ViewHistory[]>([]);
const pathStore = usePathStore();
const load = function () {
    loading.value = true
    page.value += 1;
    fetchHistory(page.value);
}
const fetchHistory = (PageNum: number) => {
    FetchGetWithToken("/api/history?" + "page=" + PageNum)
        .then(data => {
            if (data.length < 28) {
                noMore.value = true;
                loading.value = false;
            }
            viewHistoryList.value = viewHistoryList.value.concat(data);
            rowCount.value += Math.ceil(data.length / 4);
            loading.value = false;
            show.value = rowCount.value == 0;

            loadingStore.closeLoading();
        })
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
const isMounted = ref(false);
onMounted(() => {
    isMounted.value = true;
    load();
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "浏览历史", path: '/buyer/history' },
    ]
})
</script>
<style scoped>
.price {
    font-size: smaller;
    color: #e4393c;
}

.time {
    font-size: xx-small;
}

a {
    text-decoration: none;
}

.img-wrapper {
    display: flex;
    justify-content: center;
}

.cover {
    height: 10rem;
}

.img-slot-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.name {
    font-size: x-small;
    /*设置 用来限制在一个块元素显示的文本的行数*/
    -webkit-line-clamp: 2;
    /*必须结合的属性 将对象作为弹性伸缩盒子模型显示 */
    display: -webkit-box;
    /*必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-box-orient: vertical;
    /*溢出隐藏*/
    overflow: hidden;
    /*超出显示省略号*/
    text-overflow: ellipsis;
}

.priceAndQualityWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.bottomTipsWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.bottomTips {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: smaller;
    color: gray;
    text-align: center;
}

.bottom {
    margin-top: .5rem;

}

.view-time {
    font-size: xx-small;
    color: gray;
}
</style>