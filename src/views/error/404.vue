<template>
    <el-empty description="这里什么也没有">
        <el-button type="primary" @click="goHome">返回</el-button>
    </el-empty>
</template>
<script lang="ts" setup>
import router from '@/router';
import { useLoadingStore } from '@/stores'
const loadingStore = useLoadingStore();
loadingStore.closeLoading();

const goHome = () => {
    router.back();
}
</script>