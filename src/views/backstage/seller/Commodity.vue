<template>
    <div>
        <el-result v-if="commodities == undefined || commodities.length == 0" title="没有商品" sub-title="你还没发布过任何商品">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                    <path fill="#888888"
                        d="M704 288h131.072a32 32 0 0 1 31.808 28.8L886.4 512h-64.384l-16-160H704v96a32 32 0 1 1-64 0v-96H384v96a32 32 0 0 1-64 0v-96H217.92l-51.2 512H512v64H131.328a32 32 0 0 1-31.808-35.2l57.6-576a32 32 0 0 1 31.808-28.8H320v-22.336C320 154.688 405.504 64 512 64s192 90.688 192 201.664v22.4zm-64 0v-22.336C640 189.248 582.272 128 512 128c-70.272 0-128 61.248-128 137.664v22.4h256zm201.408 476.16a32 32 0 1 1 45.248 45.184l-128 128a32 32 0 0 1-45.248 0l-128-128a32 32 0 1 1 45.248-45.248L704 837.504V608a32 32 0 1 1 64 0v229.504l73.408-73.408z" />
                </svg>
            </template>
            <template #extra>
                <el-button type="primary" @click="toLaunch">发布商品</el-button>
            </template>
        </el-result>
        <div v-if="commodities != undefined && commodities.length != 0" class="push-button-wrapper">
            <el-button type="primary" @click="toLaunch">发布新商品</el-button>
        </div>
        <div class="infinite-list-wrapper" v-if="isMounted">
            <div v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled"
                infinite-scroll-immediate="false">
                <el-card :body-style="{ padding: '.3rem' }" v-for="commodity in commodities" :key="commodity.cid"
                    shadow="hover" class="card">
                    <el-row class="commodity-card">
                        <el-col :span="5" class="img-wrapper" @click="toCommodity(commodity.cid)">
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
                                <span class="name">{{ commodity.name }}</span>
                                <el-tag class="quality" :type="getQualityClass(commodity.quality)">{{ commodity.quality
                                }}新</el-tag>

                                <el-tag class="status"
                                    :type="commodity.sold ? 'danger' : commodity.launched ? 'success' : 'warning'">{{
                                        commodity.sold ? '已售出' : commodity.launched ? '上架中' : '已下架'
                                    }}</el-tag>
                            </div>
                            <div class="priceAndQualityWrapper">
                                <span class="price">{{ "￥ " + commodity.price }}</span>
                            </div>
                            <div class="info">
                                <el-row>
                                    <el-col :span="8">
                                        <span>商品编号：{{ commodity.cid }}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span>类型：{{ commodity.type.typeName }}</span>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <span>{{ commodity.bidCount }} 人出价</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="view-count" v-show="commodity.viewCount > 0">{{
                                            commodity.viewCount
                                        }}人看过</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="bottom-wrapper">
                                <div class="bottom">
                                    <time class="launch-time">{{ commodity.time }}</time>
                                    <div class="commodity-button">
                                        <el-button type="primary" size="small" v-if="!commodity.sold"
                                            :disabled="commodity.bidCount == '0'" @click="toBid(commodity)">查看出价</el-button>
                                        <el-button type="primary" size="small" v-if="!commodity.sold"
                                            @click="toEdit(commodity)">编辑</el-button>
                                        <el-button :type="commodity.launched ? 'warning' : 'primary'" size="small"
                                            v-if="!commodity.sold"
                                            @click="commodity.launched ? getDown(commodity) : uploaded(commodity)">{{
                                                commodity.launched ? '下架' : '上架' }}</el-button>


                                        <el-popconfirm title="你确定永久删除本商品吗?" confirm-button-text="确定删除"
                                            cancel-button-text="取消" confirm-button-type="danger"
                                            cancel-button-type="primary" @confirm="deleteCommodity(commodity)"
                                            width="11rem">
                                            <template #reference>
                                                <el-button type="danger" size="small" v-if="!commodity.sold">删除</el-button>
                                            </template>
                                        </el-popconfirm>


                                        <el-button type="primary" size="small" v-if="commodity.sold"
                                            @click="toOrderDetail(commodity)">查看订单</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                </el-card>
            </div>
            <div class="loading-tips">
                <p v-if="loading" class="bottomTips">正在获取更多 请稍等...</p>
                <p v-if="noMore" class="bottomTips">没有更多了...</p>
            </div>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import constant from "@/common/constant";
import type Commodity from '@/interface/Commodity';
import type CommonResult from "@/interface/CommonResult";
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { FetchDeleteWithToken, FetchGetWithToken, FetchPutWithToken } from '@/util/FetchUtil';
import { useUserStore, usePathStore, useLoadingStore, useCaptchaStore } from '@/stores';
import { ElLoading, ElMessage } from 'element-plus';
import router from '@/router';
const loadingStore = useLoadingStore();
const pathStore = usePathStore();
const userStore = useUserStore();
const page = ref(0);
const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value)
const commodities = ref<Commodity[]>([])
const load = function () {
    loading.value = true
    page.value += 1;
    fetchcommodities(page.value);
}
const fetchcommodities = (PageNum: number) => {
    FetchGetWithToken("/api/commodity/u?page=" + PageNum)
        .then(data => {
            if (data.length < 28) {
                noMore.value = true;
                loading.value = false;
            }
            commodities.value = commodities.value.concat(data);
            console.log(commodities.value);
            loading.value = false;
            loadingStore.closeLoading();


        })
}
const toOrderDetail = (commodity: Commodity) => {
    FetchGetWithToken("/api/order/c/" + commodity.cid).then(result => {
        if (result.flag) {
            router.push({ name: "seller-order-detail", params: { oid: result.data.oid } })
        } else if (result.code == constant.NOT_LOGIN_CODE) {
            ElMessage.error('登录过期，请重新登录');
            userStore.loginFormVisible = true;
        } else {
            ElMessage({
                message: result.message,
                type: 'error'
            })
        }
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
const toCommodity = (cid: string) => {
    router.push({ name: "commodity", params:{ cid: cid }})

}
const toBid = (commodity: Commodity) => {
    router.push({ name: "seller-bid-by-cid", params: { cid: commodity.cid } })
}
const toEdit = (commodity: Commodity) => {
    router.push({ name: "edit", params: { cid: commodity.cid } });
}
//下架
const getDown = (commodity: Commodity) => {
    FetchPutWithToken("/api/commodity/down/" + commodity.cid).then(data => {
        ElMessage.success("下架成功");
        commodity.launched = false;
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = getDown;
            captchaStore.nextMethodParam = commodity;
        }
    });

}
//上架
const uploaded = (commodity: Commodity) => {
    FetchPutWithToken("/api/commodity/uploaded/" + commodity.cid,).then(data => {
        ElMessage.success("上架成功");
        commodity.launched = true;
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = uploaded;
            captchaStore.nextMethodParam = commodity;
        }
    });
}

const deleteCommodity = (commodity: Commodity) => {
    FetchDeleteWithToken("/api/commodity/" + commodity.cid).then(result => {
        ElMessage.success("删除成功！");
        //reload
        page.value-=1;
        load();
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = deleteCommodity;
            captchaStore.nextMethodParam = commodity;
        }
    });
}
const toLaunch = () => {
    router.push({ name: "launch" });
}

const isMounted = ref(false);
onMounted(() => {
    isMounted.value = true;
    load();
    pathStore.path = [
        { name: "个人中心", path: '/buyer/order' },
        { name: "我的出价", path: '/buyer/bid' },
    ]
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
.img-wrapper{
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