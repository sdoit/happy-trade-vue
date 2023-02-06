<template>
    <el-row class="wrapper">
        <el-col :span="5">
            <el-row class="tac">
                <el-col :span="12">
                    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                        :router="true">
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
                                <el-menu-item index="/buyer/collection">我的收藏</el-menu-item>
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
                        <el-menu-item index="4">
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>地址管理</span>
                        </el-menu-item>
                        <el-menu-item index="5">
                            <el-icon>
                                <setting />
                            </el-icon>
                            <span>个人信息</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="10">
            <router-view />
        </el-col>
    </el-row>

</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style scoped>
.wrapper {
    justify-content: center;
}
</style>
