<template>
    <el-row justify="center">
        <el-col :span="16" style="padding: 3rem; background-color: var(--el-fill-color-blank); border-radius: 1rem;">
            <div v-for="commodityTypeRoot in commodityTypes" :key="commodityTypeRoot.tid">
                <el-link :underline="false" :href="'/type/' + commodityTypeRoot.tid">
                    <span class="rootTitle">{{
                        commodityTypeRoot.typeName }}</span>
                </el-link>
                <div v-for="commodityTypeMidel in commodityTypeRoot.commodityTypes" :key="commodityTypeMidel.tid">
                    <el-link :underline="false" :href="'/type/' + commodityTypeMidel.tid">
                        <span class="subTitle">{{ commodityTypeMidel.typeName }}</span>
                    </el-link>
                    <div style="display: flex; flex-wrap: wrap;">
                        <el-link :underline="false" :href="'/type/' + commodityTypeLeaf.tid"
                            v-for="commodityTypeLeaf in commodityTypeMidel.commodityTypes">
                            <div class="typeLeaf" :key="commodityTypeLeaf.tid">
                                <el-image :src="constant.NGINX_SERVER_HOST + '/' + commodityTypeLeaf.img"></el-image>
                                <span>{{ commodityTypeLeaf.typeName }}</span>
                            </div>
                        </el-link>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import constant from '@/common/constant';
import type CommodityType from '@/interface/CommodityType';
import { FetchGetWithToken } from '@/util/FetchUtil';
import { onMounted, ref } from 'vue';
import { useLoadingStore } from '@/stores';
const loadingStore = useLoadingStore();
const commodityTypes = ref<CommodityType[]>();

const fetchCommodityTypes = () => {
    FetchGetWithToken("/api/type/all").then(data => {
        commodityTypes.value = data;
        loadingStore.closeLoading();
    });
}
onMounted(() => {
    fetchCommodityTypes();
})
</script>
<style scoped>
.typeLeaf {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
    margin-top: 1rem;
    height: 8rem;
    width: 8rem;
}

.typeLeaf span {
    font-size: small;
}

.rootTitle {
    font-size: x-large;
    font-weight: 700;
    margin-top: 3rem;
    display: block;
}

.subTitle {
    display: block;
    margin-top: 2rem;
    font-size: large;
    font-weight: 700;
}
</style>