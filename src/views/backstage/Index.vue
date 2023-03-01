<template>
    <div>
        <el-result v-if="!userStore.logged" title="请先登录" sub-title="登录后才能查看个人中心">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 2048 2048">
                    <path fill="#888888"
                        d="M1728 1152q26 0 45 19t19 45q0 26-19 45t-45 19q-26 0-45-19t-19-45q0-26 19-45t45-19zm-603-19q-79-54-170-81t-187-28q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0q106 0 199 40t163 109t110 163t40 200q0 67-16 129t-48 119t-75 103t-101 83q81 29 156 80l-71 107zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149zm1280 384q79 0 149 30t122 82t83 123t30 149q0 80-30 149t-82 122t-123 83t-149 30q-65 0-128-23v151h-128v128h-128v128H896v-282l395-396q-11-46-11-90q0-79 30-149t82-122t122-83t150-30zm0 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 35 9 64t21 61l-414 413v102h128v-128h128v-128h128v-91l93-92q40 23 77 39t86 16z" />
                </svg>
            </template>
            <template #extra>
                <el-button type="primary" @click="userStore.loginFormVisible = true">点击登录</el-button>
            </template>
        </el-result>

        <el-row justify="center" v-if="userStore.logged">
            <el-col :span="15" class="wrapper">
                <el-row justify="center">
                    <el-col :span="5" style="display: flex;">
                        <el-affix :offset="60" class="menu-affix">
                            <el-menu :default-active="active" @open="handleOpen" @close="handleClose" :router="true">
                                <el-sub-menu index="1">
                                    <template #title>
                                        <el-icon>
                                            <location />
                                        </el-icon>
                                        <span>买家中心</span>
                                    </template>
                                    <el-menu-item-group title="订单">
                                        <el-menu-item index="/buyer/order">我的订单</el-menu-item>
                                        <el-menu-item index="/buyer/bid">我的出价</el-menu-item>
                                    </el-menu-item-group>
                                    <el-menu-item-group title="浏览">
                                        <el-menu-item index="/buyer/favorites">我的收藏</el-menu-item>
                                        <el-menu-item index="/buyer/history">浏览历史</el-menu-item>
                                    </el-menu-item-group>
                                </el-sub-menu>
                                <el-sub-menu index="2">
                                    <template #title>
                                        <el-icon><icon-menu /></el-icon>
                                        <span>卖家中心</span>
                                    </template>
                                    <el-menu-item-group title="商品">
                                        <el-menu-item index="/seller/commodity">我的商品</el-menu-item>
                                        <el-menu-item index="/seller/bid">出价管理</el-menu-item>
                                    </el-menu-item-group>
                                    <el-menu-item-group title="订单">
                                        <el-menu-item index="/seller/order">订单管理</el-menu-item>
                                        <el-menu-item index="1-2">...</el-menu-item>
                                    </el-menu-item-group>
                                </el-sub-menu>
                                <el-menu-item index="/home/address">
                                    <el-icon>
                                        <LocationFilled />
                                    </el-icon>
                                    <span>地址管理</span>
                                </el-menu-item>
                                <el-menu-item index="/home/wallet">
                                    <el-icon>
                                        <document />
                                    </el-icon>
                                    <span>账户余额</span>
                                </el-menu-item>
                                <el-menu-item index="9">
                                    <el-icon>
                                        <setting />
                                    </el-icon>
                                    <span>个人信息</span>
                                </el-menu-item>
                            </el-menu>
                        </el-affix>

                    </el-col>
                    <el-col :span="18" :offset="1" class="back--indea-main">
                        <el-breadcrumb :separator-icon="ArrowRight" style="margin-top: .3rem;">
                            <el-breadcrumb-item v-for="path in pathStore.path" :to="{ path: path.path }">{{
                                path.name
                            }}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <div style="margin-top: 2rem;"></div>
                        <router-view v-slot="{ Component }">
                            <transition name="fade">
                                <component :is="Component" />
                            </transition>
                        </router-view>

                    </el-col>
                </el-row>
            </el-col>

        </el-row>
    </div>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    ArrowRight,
    LocationFilled
} from '@element-plus/icons-vue';
import { useUserStore, usePathStore, useLoadingStore } from "@/stores";
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
const loadingStore = useLoadingStore();
const pathStore = usePathStore();
const active = ref();
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const userStore = useUserStore();
userStore.checkLogin().then(result => {
    if (result == undefined) {
        //本次操作需要验证
        return;
    }
    if (!result) {
        ElMessage.error('登录过期，请重新登录');
        userStore.loginFormVisible = true;
    }
});



const route = useRoute();
onMounted(() => {
    active.value = route.path;
})
</script>

<style scoped>
.back--indea-main {
    padding-right: 3rem;
}

.menu-affix {
    width: 100%;
}

.wrapper {
    justify-content: center;
    background-color: var(--el-bg-color);
    min-height: 55rem;
}

.menu {
    height: 100%;
}

.fade-enter-active {
    transition: opacity 1s ease;

}

.fade-leave-active {
    transition: opacity 0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
<style>
</style>
