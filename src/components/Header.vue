<template>
    <el-row class="header">
        <el-col :span="8">
            <div class="grid-content ">
                LOGO
            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content" />
        </el-col>
        <el-col :span="8">
            <div class="grid-content option">
                <ul>
                    <li><el-link :underline="false" @click="$emit('toHistory')">足迹</el-link></li>
                    <li><el-link :underline="false" @click="$emit('toOrder')">信息</el-link></li>
                    <li><el-link :underline="false" @click="$emit('toOrder')">发布商品</el-link></li>
                    <li><el-link :underline="false" @click="$emit('toOrder')">订单</el-link></li>
                    <li>
                        <el-link v-if="!userStore.logged" :underline="false"
                            @click="userStore.loginFormVisible = true">登录</el-link>
                        <div v-if="userStore.logged">
                            <el-dropdown>
                                <div class="nickname-wrapper">
                                    <el-avatar :size="30" :src="constant.NGINX_SERVER_HOST + userStore.user.avatar" />
                                    <span class="nickname">{{ userStore.user.nickname }}</span>
                                    <el-icon class="el-icon--right">
                                        <arrow-down />
                                    </el-icon>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            <router-link :to="{ name: 'buyer-order' }"><el-link :underline="false">
                                                    个人中心</el-link></router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-link :underline="false" @click="$emit('toOrder')">我的订单</el-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-link :underline="false" @click="$emit('toOrder')">我的足迹</el-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-link :underline="false" @click="$emit('toOrder')">我的出价</el-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-link :underline="false" @click="$emit('toOrder')">我的讨论</el-link>
                                        </el-dropdown-item>

                                        <el-dropdown-item divided>
                                            <el-link :underline="false" @click="loginOut">退出登录</el-link>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </li>
                </ul>
            </div>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import constant from "@/common/constant";
import { ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores'
import { result } from "lodash";
import { ElMessage } from "element-plus";
import { inject } from "vue";
import router from '@/router';

const userStore = useUserStore();
const reload = inject('reload') as Function
const loginOut = () => {
    userStore.logout().then(result => {
        if (result?.flag) {
            ElMessage({
                message: "退出成功",
                type: "success"

            })
        } else {
            ElMessage({
                message: result?.message,
                type: "error"

            })
        }
        reload();
    })
}
</script>
<style scoped>
.header {
    background-color: var(--el-color-primary-light-9);
    padding: 0;
    height: 3rem;
}

.option ul {
    display: flex;
    /* justify-content: flex-end; */
}

.option ul li {
    list-style: none;
    margin-right: 2rem;
    height: 3rem;
    display: flex;
    align-items: center;
}

.nickname-wrapper {
    display: flex;
    align-items: center;
}

.nickname {
    padding-left: .5rem;
    font-size: smaller;
    cursor: default;
}

a {
    text-decoration: none;
}
</style>
