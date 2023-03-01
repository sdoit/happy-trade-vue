<template>
  <el-container style="height: 100%;">
    <el-header class="header">
      <el-affix :offset="0">
        <Header />
      </el-affix>
    </el-header>
    <el-main class="main" v-loading="loadingStore.isLoading">
      <el-scrollbar @scroll="mapSearchBar" ref="scrollbar">
        <el-row v-if="modeStore.mode == constant.MODE_RECEPTION">
          <el-col :span="7">
            <div class="grid-content">
            </div>
          </el-col>
          <el-col :span="10">
            <!-- <div style="height: 20rem;" /> -->
            <div class="grid-content search">
              <el-affix :offset="5">
                <div class="logo-wrapper">
                  <a href="/"> <el-image src="/img/logo.svg" class="logo"
                      :style="{ 'margin-left': logoMarLeft + 'rem', 'width': logoWidth + 'rem' }"></el-image></a>
                </div>
              </el-affix>
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
        <div v-if="modeStore.mode == constant.MODE_RECEPTION" class="content-head"></div>
        <el-row :justify="'center'">
          <el-col :span="24">
            <router-view v-slot="{ Component }" v-if="modeStore.isRouterAlive" @toBidView="toBidView"
              @loadDone="loadDone">
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
          <el-input v-model="userStore.user.certificate" placeholder="用户名/手机号码/UID" @keydown.enter="onLogin" />
        </el-form-item>
        <el-form-item label="密码：" required>
          <el-input v-model="userStore.user.password" placeholder="请输入密码" @keydown.enter="onLogin" show-password />
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
  <div class="chat-wrapper">
    <el-drawer v-model="userMessageStore.chatDrawerVisible" :size="showUserList ? '50%' : '35%'" ref="chatDrawer">
      <template #header>
        <div class="chat-drawer-header-wrapper">
          <span @click="openUserList" class="open-user-list-arrow">
            <svg v-show="!showUserList" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#888888"
                d="m16.9 17.3l-4.6-4.6q-.15-.15-.213-.325T12.026 12q0-.2.063-.375t.212-.325l4.6-4.6q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7L14.425 12l3.875 3.9q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275Zm-6.6 0l-4.6-4.6q-.15-.15-.213-.325T5.425 12q0-.2.063-.375T5.7 11.3l4.6-4.6q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7L7.825 12l3.875 3.9q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275Z" />
            </svg>
            <svg v-show="showUserList" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#888888"
                d="M6.4 18L5 16.6L9.575 12L5 7.4L6.4 6l6 6l-6 6Zm6.6 0l-1.4-1.4l4.575-4.6L11.6 7.4L13 6l6 6l-6 6Z" />
            </svg>
          </span>
          <h4 class="chat-nickname">{{ userMessageStore.chatUser.nickname }}</h4>
        </div>
      </template>
      <template #default>
        <el-row class="row-wrapper">
          <!--联系人 -->
          <el-col :span="showUserList ? 7 : 0">
            <el-scrollbar ref="contactsScrollBar" wrap-style="padding-right:1rem">
              <!-- 列表开始 -->
              <div class="chatuser-list" @click="toMessage(chatUser.targetUser)" v-for="chatUser in chatUserList"
                :key="chatUser.targetUser.uid"
                :class="userMessageStore.chatUser.uid == chatUser.targetUser.uid ? 'chatuser-active' : ''">
                <el-row>
                  <el-col :span="6">
                    <el-badge :value="chatUser.unreadCount" :max="99" :hidden="chatUser.unreadCount == 0"
                      class="chat-userlist-messeage-count">
                      <el-avatar :src="constant.NGINX_SERVER_HOST + chatUser.targetUser.avatar"></el-avatar>
                    </el-badge>
                  </el-col>
                  <el-col :span="17" class="chat-list-name-wrapper">
                    <span class="chat-nickname">{{ chatUser.targetUser.nickname }}</span>
                    <span class="last-message" :class="chatUser.unreadCount != 0 ? 'unread-message' : ''">{{
                      chatUser.lastMessage.content }}</span>
                  </el-col>
                  <el-col :span="1">
                    <span class="close-btn" @click.stop="closeChatUser(chatUser)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512">
                        <path fill="none" stroke="#888888" stroke-miterlimit="10" stroke-width="32"
                          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z" />
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="32" d="M320 320L192 192m0 128l128-128" />
                      </svg>
                    </span>
                  </el-col>
                </el-row>
              </div>
              <!-- 列表结束 -->
            </el-scrollbar>
          </el-col>
          <el-col :span="showUserList ? 17 : 24" class="chat-message-view" :class="showUserList ? 'borderleft' : ''">
            <!-- 消息 -->
            <div class="message" v-loading="loadingMoreMessage">
              <el-scrollbar ref="messageScrollBar" @scroll="messageScrollHandler">
                <div ref="messageWrapper">
                  <el-row v-for="message in userMessageStore.messageList" :key="message.mid" class="chat-message-wrapper"
                    :class="message.uidSend == userStore.user.uid ? 'message-self' : ''">
                    <el-col :span="3">
                      <el-avatar :size="50"
                        :src="constant.NGINX_SERVER_HOST + (message.uidSend == userStore.user.uid ? userStore.user.avatar : userMessageStore.chatUser.avatar)" />
                    </el-col>
                    <el-col :span="20" :class="message.uidSend == userStore.user.uid ? 'message-self-content' : ''">
                      <div class="chat-message-content">
                        <span>{{ message.content }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-scrollbar>
            </div>
            <!-- 消息发送框 -->
            <div class="message-input-wrapper">
              <div class="chat-content-wrapper">
                <el-input class="chat-content" v-model="userMessageStore.chatMessage" rows="4" maxlength="250"
                  placeholder="请输入消息..." show-word-limit type="textarea" @keydown.enter.prevent="sendMessage"
                  :disabled="chatUser.uid == '0'" />
              </div>
              <div style="flex: auto" class="chat-button-warpper">
                <el-button type="primary" @click="sendMessage" :disabled="chatUser.uid == '0'">发送</el-button>
                <el-button type="warning" @click="userMessageStore.clodeMessageDrawer">关闭</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </div>

  <el-dialog v-model="captchaStore.captchaVisble" :fullscreen="true" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" :center="true" :align-center="true">
    <CaptchaSlider v-if="captchaStore.captchaVisble" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick, provide, watch } from 'vue'
import constant from './common/constant';
import Header from "./components/Header.vue";
import Search from "./components/Search.vue";
import router from './router'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import { useModeStore, useUserStore, useLoadingStore, useUserMessageStore, useCaptchaStore, useCommodityListStore } from '@/stores'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { storeToRefs } from 'pinia';
import type User from './interface/User';
import CaptchaSlider from '@/components/CaptchaSlider.vue';
import type { ChatUser } from './interface/UserMessage';


const captchaStore = useCaptchaStore();
const loadingStore = useLoadingStore();
const modeStore = useModeStore();
const userMessageStore = useUserMessageStore();
const { chatDrawerVisible, showUserList, messageList, chatUser, chatUserList, tipMMessagePlaySymbols } = storeToRefs(userMessageStore);
const reload = () => {
  modeStore.isRouterAlive = false;
  nextTick(() => {
    modeStore.isRouterAlive = true;
  })
}
provide('reload', reload);
const lockScroll = ref(false);
const SearchBar = ref();
const logoMarLeft = ref(0);
const logoWidth = ref(20);
const lastscrollTop = ref(0)
const mapSearchBar = function (scroll: { scrollTop: number, scrollLeft: number }) {
  if (lockScroll.value && scroll.scrollTop < 320) {
    scrollbar.value.setScrollTop(320);
  }
  if (modeStore.mode == "reception") {
    SearchBar.value.changeSearchBarSize(scroll.scrollTop);
  }
  if (scroll.scrollTop > lastscrollTop.value && logoWidth.value <= 5.185185185185185) {
    logoWidth.value = 5.185185185185185
    logoMarLeft.value = -33.333333333333336
    return
  }
  logoMarLeft.value = -(scroll.scrollTop / 6);
  logoWidth.value = 20 - (scroll.scrollTop / 13.5);
  lastscrollTop.value = scroll.scrollTop;

}

const scrollbar = ref();
const commodityListStore = useCommodityListStore();
const search = function (keyword: string) {
  console.log(keyword);
  SearchBar.value.close();
  router.push({ name: "search", params: { 'keyword': keyword } });
  commodityListStore.url = "/api/commodity?keyword=" + keyword;
}
const loadDone = () => {
  console.log('load Done')
  setTimeout(() => {
    scrollbar.value.scrollTo({
      top: 320,
      behavior: "smooth",
    });
    setTimeout(() => {
      lockScroll.value = modeStore.mode == "reception"
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
    } else if (result.code != constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
      ElMessage({
        message: "发生错误," + result.message,
        type: "error"
      })
    }
    loading.close();

  }).catch((e: Error) => {
    if (e.message = constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION.toString()) {
      // 储存本次操作
      const captchaStore = useCaptchaStore();
      captchaStore.nextMethod = onLogin;
    }
  })

}
//监听路由，随时更改mode
const rout = useRoute();
watch(rout, (value) => {
  modeStore.mode = value.meta.mode as string;
  loadingStore.loading();
  if (rout.name == "index") {
    lockScroll.value = false;
  }
});

//消息抽屉
const tipAudio = ref();
const messageScrollBar = ref();
const messageWrapper = ref();
const chatDrawer = ref();
const openUserList = () => {
  if (!showUserList.value) {
    userMessageStore.fetchChatUserList();
  }
  showUserList.value = !showUserList.value;
}
const toMessage = async (chatUser: User) => {
  userMessageStore.chatUser = chatUser;
  userMessageStore.messageList = [];
  let result = await userMessageStore.fetchMessage()

  nextTick(() => {
    messageScrollBar.value.scrollTo({
      top: messageWrapper.value.clientHeight,
      behavior: "smooth",
    });
  });

}
let lastTop = 0;
const sendMessage = async () => {
  if (await userMessageStore.chatSend()) {
    nextTick(() => {
      if (messageScrollBar.value == undefined) {
        return;
      }
      messageScrollBar.value.scrollTo({
        top: messageWrapper.value.clientHeight,
        behavior: "smooth",
      });
    });
  }
}
const closeChatUser = (chatUser: ChatUser) => {
  userMessageStore.removeChatUser(chatUser);
}
watch(messageList, () => {
  if (userMessageStore.doNotScroll) {
    return;
  }
  nextTick(() => {
    if (messageScrollBar.value == undefined) {
      return;
    }
    messageScrollBar.value.scrollTo({
      top: messageWrapper.value.clientHeight,
      behavior: "smooth",
    });
  });
}, { deep: true });
//获取更多消息
//防抖
let loadFlag = true;
const loadingMoreMessage = ref(false)
const messageScrollHandler = async (sroll: { scrollTop: number }) => {
  if (sroll.scrollTop < 200) {
    if (lastTop > sroll.scrollTop && loadFlag) {
      loadFlag = false;
      loadingMoreMessage.value = true;
      if (userMessageStore.pageMap.has(userMessageStore.chatUser.uid)) {
        userMessageStore.pageMap.set(userMessageStore.chatUser.uid,
          userMessageStore.pageMap.get(userMessageStore.chatUser.uid)! + 1)
      } else {
        userMessageStore.pageMap.set(userMessageStore.chatUser.uid, 2);
      }
      await userMessageStore.fetchMessage(true);
      loadingMoreMessage.value = false;
      setTimeout(() => {
        loadFlag = true;
      }, 1000);
    }
    lastTop = sroll.scrollTop;
  }
}

watch(tipMMessagePlaySymbols, () => {
  tipAudio.value.play();
});

onMounted(() => {
  // userMessageStore.messageScrollBar = messageScrollBar;
  // userMessageStore.messageWrapper = messageWrapper;
  // console.log(messageScrollBar.value)
  userStore.checkLogin();
  tipAudio.value = new Audio('/audio/newMessage.mp3');
})


</script>
<style scoped>
.header,
.main {
  padding: 0;
  background-color: var(--el-bg-color-page);
}

.search {
  margin-top: 5rem;
}

.content-head {
  margin-top: 10rem;
}


.demonstration {
  color: var(--el-text-color-secondary);
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 5rem;
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


.open-user-list-arrow {
  border: 1px solid rgba(99, 99, 99, 0.473);
  border-radius: 5px;
  cursor: pointer;
}

.chat-drawer-header-wrapper {
  display: flex;
  align-items: center;
}

.chat-drawer-header-wrapper .chat-nickname {
  margin-left: 1rem;

}

.row-wrapper {
  height: 100%;
  justify-content: flex-end;
}

.row-wrapper>div {
  height: 100%;
}

.chat-message-wrapper {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.message-self {
  flex-direction: row-reverse;
}

.message-self-content {
  display: flex;
  justify-content: flex-end;
}

.chat-message-content {
  margin-left: .5rem;
  padding: .8rem;
  background-color: #74867c;
  border: 1px solid rgba(100, 100, 100, 0.144);
  border-radius: .5rem;
  display: inline-flex;
  color: white;
  z-index: 10;
}

.chat-message-view {

  height: 100%;
}

.borderleft {
  border-left: 1px rgba(128, 128, 128, 0.205) solid;
  padding-left: 1rem;
}

.message {
  height: 80%;
}

.message-input-wrapper {
  height: 20%;
}

.message-self .chat-message-content {
  margin-right: .5rem;
  background-color: rgba(231, 231, 231, 0.329);
  border: 1px solid rgba(128, 128, 128, 0.144);
  color: black;

}

.chat-button-warpper {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;

}

.chat-wrapper .chat-nickname {
  font-size: smaller;
  /*设置 用来限制在一个块元素显示的文本的行数*/
  -webkit-line-clamp: 1;
  /*必须结合的属性 将对象作为弹性伸缩盒子模型显示 */
  display: -webkit-box;
  /*必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-box-orient: vertical;
  /*溢出隐藏*/
  overflow: hidden;
  /*超出显示省略号*/
  text-overflow: ellipsis;
}

.chatuser-list {
  padding: 1rem;
  border-radius: 5px;
}

.chatuser-active {
  background-color: #16cbeb91;
}

.chatuser-list:hover {
  background-color: #16cbeb1e;
  cursor: pointer;
}

.chatuser-list:hover .close-btn {
  display: inline;
}

.chat-wrapper .last-message {
  font-size: small;
  color: gray;
  /*设置 用来限制在一个块元素显示的文本的行数*/
  -webkit-line-clamp: 1;
  /*必须结合的属性 将对象作为弹性伸缩盒子模型显示 */
  display: -webkit-box;
  /*必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-box-orient: vertical;
  /*溢出隐藏*/
  overflow: hidden;
  /*超出显示省略号*/
  text-overflow: ellipsis;
}

.unread-message::before {
  content: '[新消息]';
  color: red;
}

.chat-wrapper .chat-list-name-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around
}

.close-btn {
  display: none;
}
</style>
<style>
.chat-wrapper .el-drawer__body {
  padding-bottom: 0;
}

.chat-content>textarea {
  resize: none;
}

.el-drawer__body {
  overflow: hidden;
}

.chat-userlist-messeage-count .el-badge__content {
  right: calc(.2rem + var(--el-badge-size)/ 2);
}

.el-dialog.is-fullscreen.is-align-center.el-dialog--center {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>