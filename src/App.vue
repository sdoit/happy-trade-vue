<template>
  <el-container style="height: 100%;">
    <el-header class="header">
      <el-affix :offset="0">
        <Header @needLogin="needLogin = true" @signOut="signOut" :user="user" />
      </el-affix>
    </el-header>
    <el-main class="main">
      <el-scrollbar @scroll="mapSearchBar" ref="scrollbar">
        <el-row>
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
        <el-row :justify="'center'" class="content">
          <el-col :span="24">
            <RouterView></RouterView>
          </el-col>
        </el-row>
      </el-scrollbar>
    </el-main>
  </el-container>

  <el-dialog v-model="needLogin" title="登录" width="30%">
    <template #footer>
      <el-form :model="userLogin" label-width="5rem">
        <el-form-item label="账号：" required>
          <el-input v-model="userLogin.certificate" placeholder="用户名/手机号码/UID" />
        </el-form-item>
        <el-form-item label="密码：" required>
          <el-input v-model="userLogin.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin">登录账号</el-button>
          <el-button @click="needLogin = false">取消</el-button>
        </el-form-item>
        <el-link style="font-size: smaller;color: gray;" :underline="true">没有账号？创建一个</el-link>
        <el-form-item>
        </el-form-item>
      </el-form>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import constant from './common/constant';
import Header from "./components/Header.vue";
import Search from "./components/Search.vue";
import type User from './entity/User';
import type CommonResult from './entity/CommonResult';
import router from './router'
import { ElLoading, ElMessage } from 'element-plus'


const lockScroll = ref(false);

const SearchBar = ref();
const mapSearchBar = function (scroll: { scrollTop: number, scrollLeft: number }) {
  SearchBar.value.changeSearchBarSize(scroll.scrollTop);
  if (lockScroll.value && scroll.scrollTop < 400) {
    scrollbar.value.setScrollTop(400);
    console.log(scroll.scrollTop);
  }
}

const scrollbar = ref();
const search = function (keyword: string) {
  console.log(keyword);
  SearchBar.value.close();
  router.push({ name: "search", params: { keyword } });
  setTimeout(function () {
    scrollbar.value.scrollTo({
      top: 400,
      behavior: 'smooth'
    });
    // setTimeout(function () {
    //   lockScroll.value = true;
    // }, 500);
  }, 100)
}


const user = ref<User>()
const needLogin = ref(false);

const userLogin = reactive({
  certificate: "foxb",
  password: "123456"
})

const onLogin = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });


  fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/user/login", {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(userLogin)
  }).then(response => response.json())
    .then((result: CommonResult) => {
      if (result.flag) {
        needLogin.value = false;
        user.value = result.data;
        localStorage.setItem(constant.TOKEN_NAME_KEY, user.value?.tokenName!);
        localStorage.setItem(constant.TOKEN_VALUE_KEY, user.value?.tokenValue!);
        ElMessage({
          message: '登录成功,' + user.value?.nickname,
          type: 'success',
        });
      } else {
        needLogin.value = true;
        ElMessage({
          message: '登录失败,' + result.message,
          type: 'error',
        });
      }
      loading.close();
    });
}



const signOut = () => {
  const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
  const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  headers.append(tokenName!, tokenValue!);
  fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/user/logout", {
    method: 'POST',
    headers
  }).then(response => response.json())
    .then((result: CommonResult) => {
      if (result.flag) {
        // needLogin.value = true;
        user.value = undefined;
        localStorage.removeItem(constant.TOKEN_NAME_KEY);
        localStorage.removeItem(constant.TOKEN_VALUE_KEY);

        ElMessage({
          message: '退出成功',
          type: 'success',
        });
      }
    });
}





















const checkLogin = () => {
  const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
  const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);

  if (tokenName == null || tokenValue == null) {
    // needLogin.value = true;
  }
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  headers.append(tokenName!, tokenValue!);
  fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/user/check", {
    method: 'POST',
    headers
  }).then(response => response.json())
    .then((result: CommonResult) => {
      if (result.flag) {
        needLogin.value = false;
        user.value = result.data;
      }
    });
}

checkLogin();

onMounted(() => {
  // loading.close();
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

.content {
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
</style>
