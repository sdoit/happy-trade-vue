<template>
    <div class="header">
        <el-row>
            <el-col :span="3" :offset="5">
                <div class="logo-wrapper" v-if="modeStore.mode == constant.MODE_BACKSTAGE">
                    <a href="/"> <el-image src="/img/logo.svg" class="logo"></el-image></a>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content" />
            </el-col>
            <el-col :span="8" style="display: flex; justify-content: flex-end;">
                <div class="option">
                    <ul>
                        <li>
                            <el-link v-show="!userStore.logged" :underline="false"
                                @click="userStore.loginFormVisible = true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                    <path fill="#888888"
                                        d="M231.9 220a7.8 7.8 0 0 1-6.9 4H31a7.8 7.8 0 0 1-6.9-4a7.7 7.7 0 0 1 0-8a120.7 120.7 0 0 1 67.1-54.2a72 72 0 1 1 73.6 0a120.7 120.7 0 0 1 67.1 54.2a7.7 7.7 0 0 1 0 8Z" />
                                </svg>
                                <span>登录</span>
                            </el-link>
                            <div v-show="userStore.logged">
                                <el-dropdown>
                                    <div class="nickname-wrapper">
                                        <el-avatar :size="30"
                                            :src="constant.NGINX_SERVER_HOST + '/' + userStore.user.avatar" />
                                        <span class="nickname">{{ userStore.user.nickname }}</span>
                                        <el-icon class="el-icon--right">
                                            <arrow-down />
                                        </el-icon>
                                    </div>
                                    <template #dropdown>
                                        <el-dropdown-menu v-show="userStore.logged">
                                            <el-dropdown-item>
                                                <router-link :to="{ name: 'buyer-order' }"><el-link :underline="false">
                                                        个人中心</el-link></router-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-link :underline="false"
                                                    @click="router.push({ name: 'buyer-order' })">我的订单</el-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-link :underline="false"
                                                    @click="router.push({ name: 'buyer-history' })">我的足迹</el-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-link :underline="false"
                                                    @click="router.push({ name: 'buyer-bid' })">我的出价</el-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-link :underline="false"
                                                    @click="router.push({ name: 'seller-commodity' })">我的商品</el-link>
                                            </el-dropdown-item>

                                            <el-dropdown-item divided>
                                                <el-link :underline="false" @click="loginOut">退出登录</el-link>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </li>

                        <li>
                            <el-link :underline="false" @click="openChatDrawerWithUserList">
                                <el-badge :value="unreadCount" :hidden="unreadCount == 0" class="message-badge">
                                    <div class="link-wrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#888888" d="m20 8l-8 5l-8-5v10h16zm0-2H4l8 4.99z" opacity=".3" />
                                            <path fill="currentColor"
                                                d="M4 20h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2zM20 6l-8 4.99L4 6h16zM4 8l8 5l8-5v10H4V8z" />
                                        </svg>

                                        <span>消息</span>

                                    </div>
                                </el-badge>
                            </el-link>
                        </li>
                        <li>
                            <el-link :underline="false" href="/launch">
                                <div class="link-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048">
                                        <path fill="#888888"
                                            d="M896 1537V936L256 616v880l544 273l-31 127l-641-320V472L960 57l832 415v270q-70 11-128 45V616l-640 320v473l-128 128zM754 302l584 334l247-124l-625-313l-206 103zm206 523l240-120l-584-334l-281 141l625 313zm888 71q42 0 78 15t64 41t42 63t16 79q0 39-15 76t-43 65l-717 717l-377 94l94-377l717-716q29-29 65-43t76-14zm51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 692l-34 135l135-34l692-691z" />
                                    </svg>
                                    <span>发布商品</span>
                                </div>
                            </el-link>
                        </li>
                        <li>
                            <el-link :underline="false" href="/request">
                                <div class="link-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048">
                                        <path fill="#888888"
                                            d="M896 1537V936L256 616v880l544 273l-31 127l-641-320V472L960 57l832 415v270q-70 11-128 45V616l-640 320v473l-128 128zM754 302l584 334l247-124l-625-313l-206 103zm206 523l240-120l-584-334l-281 141l625 313zm888 71q42 0 78 15t64 41t42 63t16 79q0 39-15 76t-43 65l-717 717l-377 94l94-377l717-716q29-29 65-43t76-14zm51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 692l-34 135l135-34l692-691z" />
                                    </svg>
                                    <span>发布求购</span>
                                </div>
                            </el-link>
                        </li>
                        <li>
                            <el-link :underline="false" href="/buyer/order">
                                <div class="link-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <g fill="none" stroke="#888888" stroke-linejoin="round" stroke-width="2">
                                            <path stroke-linecap="round"
                                                d="M11.029 2.54a2 2 0 0 1 1.942 0l7.515 4.174a1 1 0 0 1 .514.874v8.235a2 2 0 0 1-1.029 1.748l-7 3.89a2 2 0 0 1-1.942 0l-7-3.89A2 2 0 0 1 3 15.824V7.588a1 1 0 0 1 .514-.874L11.03 2.54Z" />
                                            <path stroke-linecap="round" d="m7.5 4.5l9 5V13M6 12.328L9 14" />
                                            <path d="m3 7l9 5m0 0l9-5m-9 5v10" />
                                        </g>
                                    </svg>
                                    <span>订单</span>
                                </div>
                            </el-link>
                        </li>
                        <li>
                            <el-link :underline="false" href="/buyer/bid">
                                <div class="link-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                        <mask id="ipSPaperMoney0">
                                            <g fill="none" stroke-linejoin="round" stroke-width="4">
                                                <path fill="#fff" stroke="#fff"
                                                    d="M39 7H9a5 5 0 0 0-5 5v24a5 5 0 0 0 5 5h30a5 5 0 0 0 5-5V12a5 5 0 0 0-5-5Z" />
                                                <path stroke="#000" stroke-linecap="round"
                                                    d="m18 15l6 6l6-6m-13 8h14m-14 6h14m-7-6v11" />
                                            </g>
                                        </mask>
                                        <path fill="#888888" d="M0 0h48v48H0z" mask="url(#ipSPaperMoney0)" />
                                    </svg>
                                    <span>出价</span>
                                </div>
                            </el-link>
                        </li>
                        <!-- <li>
                            <el-link :underline="false" href="/home/wallet">
                                <div class="link-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                        <path fill="#888888" fill-rule="evenodd"
                                            d="M24.04 6c-4.517 0-8.633 1.492-11.068 2.711c-.22.11-.425.218-.616.322c-.378.206-.7.398-.956.567l2.77 4.078l1.304.519c5.096 2.571 11.93 2.571 17.027 0l1.48-.768l2.62-3.829a15.503 15.503 0 0 0-1.69-.957C32.489 7.437 28.472 6 24.04 6Zm-6.443 4.616a24.579 24.579 0 0 1-2.901-.728C16.977 8.875 20.377 7.8 24.039 7.8c2.537 0 4.936.516 6.92 1.17c-2.325.327-4.806.882-7.17 1.565c-1.86.538-4.034.48-6.192.081Zm15.96 5.064l-.245.124c-5.607 2.828-13.043 2.828-18.65 0l-.232-.118C6.008 24.927-.422 41.997 24.04 41.997c24.46 0 17.873-17.389 9.517-26.317ZM23 24a2 2 0 0 0 0 4v-4Zm2-2v-1h-2v1a4 4 0 0 0 0 8v4a2 2 0 0 1-1.886-1.333a1 1 0 1 0-1.886.666A4.001 4.001 0 0 0 23 36v1h2v-1a4 4 0 1 0 0-8v-4c.87 0 1.611.555 1.887 1.333a1 1 0 1 0 1.885-.666A4.001 4.001 0 0 0 25 22Zm0 8v4a2 2 0 1 0 0-4Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <span>钱包</span>
                                </div>
                            </el-link>
                        </li> -->
                        <li>
                            <el-switch v-model="isDark" size="large" inline-prompt :active-icon="MoonNight"
                                :inactive-icon="Sunny"
                                style="--el-switch-on-color:#2c2c2c ; --el-switch-off-color: #c2c2c2" />
                        </li>

                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import constant from "@/common/constant";
import { ArrowDown, Sunny, MoonNight } from '@element-plus/icons-vue';
import { useUserStore, useUserMessageStore, useModeStore } from '@/stores'
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { inject } from "vue";
import { useDark, useToggle } from '@vueuse/core'
import router from "@/router";
const modeStore = useModeStore();
const isDark = useDark()
const toggleDark = useToggle(isDark)
const userMessageStore = useUserMessageStore();
const { unreadCount } = storeToRefs(userMessageStore);
const userStore = useUserStore();
const reload = inject('reload') as Function
const loginOut = () => {
    userStore.logout().then(data => {
        ElMessage({
            message: "退出成功",
            type: "success"

        })
        reload();
    })
}
const openChatDrawerWithUserList = () => {
    if (!userStore.checkLogin()) {
        ElMessage.error("未登录，请先登录");
        userStore.loginFormVisible = true;
        return;
    }
    userMessageStore.showUserList = true;
    userMessageStore.fetchChatUserList();
    userMessageStore.showMessageDrawer();
}

</script>
<style>
.header {
    background-color: #fff !important;
    border-bottom: 1px gray solid;
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
    z-index: 999;
}

.link-wrapper {
    display: flex;
    flex-direction: column;
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
<style scoped>
.logo-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
}

.logo {
    width: 5.185185185185185rem;
}</style>
