<template>
    <div style="display: flex;">

        <el-autocomplete v-model="keyword" :fetch-suggestions="querySearchAsync" placeholder="请输入商品名" class="searchBar"
            :style="{ width: width + '%', marginLeft: marginLeft + '%' }" :trigger-on-focus="false" size="large"
            @select="$emit('search', keyword)" ref="searchBar" @keydown.enter="$emit('search', keyword)">
            <template #prepend>
                <el-select v-model="commodityListStore.searchMode" size="large" style="width: 5rem;">
                    <el-option label="商品" :value=constant.SEARCH_FOR_COMMODITY />
                    <el-option label="求购" :value=constant.SEARCH_FOR_REQUEST />
                </el-select>
            </template>
            <template #append>
                <el-button :icon="Search" @click="$emit('search', keyword)">搜索</el-button>
            </template>
        </el-autocomplete>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { Link, Search } from '@element-plus/icons-vue'
import constant from "@/common/constant";
import type CommonResult from "@/interface/CommonResult";
import { useCommodityListStore } from '@/stores'
defineProps(['scrollTop']);
const commodityListStore = useCommodityListStore();
// 搜索框大小控制
const width = ref(100)
const marginLeft = ref(0)
const lastscrollTop = ref(0)
const changeSearchBarSize = function (scrollTop: number) {
    if (scrollTop > lastscrollTop.value && width.value <= 70) {
        return;
    }
    close();
    width.value = 100 - scrollTop / 10;
    marginLeft.value = scrollTop / 20;
    lastscrollTop.value = scrollTop;
}
// 候选词
const keyword = ref("");
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
    fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/search/candidate?keyword=" + queryString)
        .then(response => response.json())
        .then((json: CommonResult) => {
            const candidates: any = [];
            for (const candidate of json.data) {
                candidates.push({ value: candidate })
            }
            if (candidates.length == 0) {
                candidates.push({ value: queryString })
            }
            cb(candidates);
        })
}

//点击搜索时隐藏候选词列表
const searchBar = ref();
const close = function () {
    searchBar.value.close();
}

defineExpose({
    changeSearchBarSize,
    close
})
</script>
<style>
.searchBar {
    width: 100%;
}
</style>
<style></style>


