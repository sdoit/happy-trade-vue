<template>
  <el-container style="height: 100%;">
    <el-header class="header">
      <el-affix :offset="0">
        <Header />
      </el-affix>
    </el-header>
    <el-main class="main">
      <el-scrollbar @scroll="mapSearchBar" ref="scrollbar">
        <el-row v-if="store.mode == constant.MODE_RECEPTION">
          <el-col :span="7">
            <div class="grid-content">
            </div>
          </el-col>
          <el-col :span="10">
            <!-- <div style="height: 20rem;" /> -->
            <div class="grid-content search">
              <el-affix :offset="5">
                <Search ref="SearchBar" @search="search" />
              </el-affix>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content ">
            </div>
          </el-col>
        </el-row>
        <div v-if="store.mode == constant.MODE_RECEPTION" class="content-head"></div>
        <el-row :justify="'center'">
          <el-col :span="24">
            <router-view v-slot="{ Component }" v-if="isRouterAlive" @toBidView="toBidView" @loadDone="loadDone">
              <transition name="bounce">
                <component :is="Component" />
              </transition>
            </router-view>
          </el-col>
        </el-row>
        <el-backtop :right="100" :bottom="100" target=".el-scrollbar__wrap" />
      </el-scrollbar>
    </el-main>
  </el-container>

  <el-dialog v-model="userStore.loginFormVisible" title="登录" width="30%">
    <template #footer>
      <el-form :model="userStore.user" label-width="5rem">
        <el-form-item label="账号：" required>
          <el-input v-model="userStore.user.certificate" placeholder="用户名/手机号码/UID" />
        </el-form-item>
        <el-form-item label="密码：" required>
          <el-input v-model="userStore.user.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin">登录账号</el-button>
          <el-button @click="userStore.loginFormVisible = false">取消</el-button>
        </el-form-item>
        <el-link style="font-size: smaller;color: gray;" :underline="true">没有账号？创建一个</el-link>
        <el-form-item>
        </el-form-item>
      </el-form>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick, provide, watch } from 'vue'
import constant from './common/constant';
import Header from "./components/Header.vue";
import Search from "./components/Search.vue";
import type User from './interface/User';
import type CommonResult from './interface/CommonResult';
import router from './router'
import { ElLoading, ElMessage } from 'element-plus'
import smoothscroll from 'smoothscroll-polyfill'
import { useStore, useUserStore } from '@/stores'
import { useRoute } from 'vue-router';
const store = useStore();
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  })
}
provide('reload', reload);

const lockScroll = ref(false);
const SearchBar = ref();

const mapSearchBar = function (scroll: { scrollTop: number, scrollLeft: number }) {
  SearchBar.value.changeSearchBarSize(scroll.scrollTop);


  if (lockScroll.value && scroll.scrollTop < 500) {
    scrollbar.value.setScrollTop(500);
  }
}

const scrollbar = ref();
const search = function (keyword: string) {
  console.log(keyword);
  SearchBar.value.close();
  router.push({ name: "search", params: { keyword } });
}
const loadDone = () => {
  console.log('load Done')
  setTimeout(() => {
    scrollbar.value.scrollTo({
      top: 500,
      behavior: "smooth",
    });
    setTimeout(() => {
      lockScroll.value = true;
    }, 500);
  }, 200);
}


const toBidView = () => {
  scrollbar.value.scrollTo({
    top: 99999,
    behavior: "smooth",
  });

}


const userStore = useUserStore();
const onLogin = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  userStore.login().then(result => {
    if (result.flag) {
      ElMessage({
        message: "登录成功," + userStore.user.nickname,
        type: "success"
      });
      userStore.loginFormVisible = false;
    } else {
      ElMessage({
        message: "发生错误," + result.message,
        type: "error"
      })
    }
    loading.close();
  })

}
//监听路由，随时更改mode
const rout = useRoute();
watch(rout, (value) => {
  store.mode = value.meta.mode as string
})


userStore.checkLogin();
onMounted(() => {
  smoothscroll.polyfill();
})


</script>
<style scoped>
.header,
.main {
  padding: 0;

}

.search {
  margin-top: 20rem;
}

.content-head {
  margin-top: 10rem;
}


.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
