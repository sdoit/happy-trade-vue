<template>
    <el-space>
        <el-card>

        </el-card>
    </el-space>
</template>

<script setup lang="ts">
import { useUserStore} from '@/stores'
const userStore=useUserStore();
userStore.checkLogin()
</script>