<template>
    <div class="infinite-list-wrapper" v-if="isMounted">
        <div v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled"
            infinite-scroll-immediate="false">
            <el-row v-for="i in rowCount" class="list-item" :gutter="5">
                <el-col v-for="commodity in data.slice((i - 1) * 4, i * 4)" :key="commodity.cid" :span="4">
                    <router-link :to="{ name: 'commodity', params: { cid: commodity.cid } }" class="a">
                        <el-card :body-style="{ padding: '.3rem' }" shadow="hover">
                            <div class="img-wrapper">
                                <el-image loading="lazy" :src="
                                constant.NGINX_SERVER_HOST + '/' + commodity.cover" :fit="'fill'" class="cover">
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
                                    <span class="price">{{ "￥ "+ commodity.price }}</span>
                                    <el-tag class="quality" :type="getQualityClass(commodity.quality)">{{
                                        commodity.quality
                                    }}新</el-tag>
                                </div>
                                <div class="name-wrapper">
                                    <span class="name">{{ commodity.name }}</span>
                                </div>

                                <el-row class="seller-wrapper">
                                    <el-col :span="4">
                                        <el-avatar :size="40"
                                            :src="constant.NGINX_SERVER_HOST + commodity.user.avatar" />
                                    </el-col>
                                    <el-col :span="20" class="username-wrapper">
                                        <span class="nickname">{{
                                            commodity.user.nickname
                                        }}</span>
                                        <span class="username">@{{ commodity.user.username }}</span>
                                    </el-col>
                                </el-row>
                                <div class="bottom">
                                    <time class="launch-time">{{ commodity.time }}</time>
                                    <span class="view-count" v-show="commodity.viewCount > 0">{{
                                        commodity.viewCount
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
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import constant from "@/common/constant";
import type Commodity from '@/interface/Commodity';
import type CommonResult from "@/interface/CommonResult";
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { useLoadingStore } from '@/stores';

const emits = defineEmits(['loadDone'])
const loadingStore=useLoadingStore();
const rowCount = ref(0);
const page = ref(0);
const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value)
const data = ref<Commodity[]>([])
const load = function () {
    loading.value = true
    page.value += 1;
    fetchcommodities(page.value);
}
const Route = useRoute();
const fetchcommodities = (PageNum: number) => {
    console.log(Route.params.keyword);
    fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/commodity?keyword=" + Route.params.keyword + "&page=" + PageNum)
        .then(response => response.json())
        .then((json: CommonResult) => {
            if (json.data.length < 28) {
                noMore.value = true;
                loading.value = false;
            }
            data.value = data.value.concat(json.data);
            rowCount.value += Math.ceil(json.data.length / 4);
            loading.value = false;
            if (PageNum == 1) {
                //首次加载完成
                emits('loadDone');
            }
            loadingStore.clodeLoading();

        });
}

// const coverError = function () {
//     return "";
// }

const getQualityClass = (quality: number) => {
    if (quality >= 9.5) {
        return 'success' as EpPropMergeType<StringConstructor, "success", unknown>;

    } else if (quality >= 8) {
        return "warning" as EpPropMergeType<StringConstructor, "success", unknown>;

    } else if (quality >= 7) {

        return "info" as EpPropMergeType<StringConstructor, "success", unknown>;
    } else if (quality < 7) {
        return "danger" as EpPropMergeType<StringConstructor, "success", unknown>;
    }

}


const isMounted = ref(false);
onMounted(() => {
    isMounted.value = true;
    load();
})
</script>

<style scoped>
.infinite-list-wrapper {
    text-align: center;
}

.infinite-list-wrapper .list {
    overflow: hidden;
}

.infinite-list-wrapper .list-item {
    display: flex;
    justify-content: center;
}

.infinite-list-wrapper .list-item+.list-item {
    margin-top: 5px;
}

.bottomTips {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: x-small;
    color: gray;
}

.a {
    text-decoration: none;
}


.cover {
    /* width: 80%;
    height: 80%; */
    width: 100%;
    height: 20rem;
}


.priceAndQualityWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.5rem;
}

/* 价格 */
.priceAndQualityWrapper .price {
    color: #e1251b;
    font-size: larger;
    display: block;
}

.priceAndQualityWrapper .quality {
    font-size: medium;
    font-weight: 700;
    -webkit-text-stroke: 0.1px black
}

.name-wrapper {
    width: 100%;
    height: 2rem;
}

.name {
    font-size: small;
    text-align: left;
    width: 406rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.name:hover {
    color: coral;
}

.seller-wrapper {
    margin-top: .5rem;
}

.username-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
}

.nickname {
    color: grey;
    font-size: medium;
}

.username {
    padding: 0;
    color: rgb(179, 179, 179);
    font-size: xx-small;
}

.bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.view-count {
    font-size: small;
    color: grey;
}



.launch-time {
    font-size: small;
    color: gray;
    display: flex;
    margin-top: .8rem;
}

.img-slot-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>