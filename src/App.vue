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
            <router-view v-slot="{ Component }" v-if="modeStore.isRouterAlive" @toBidView="toBidView" @loadDone="loadDone"
              @goTop="goTop">
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

  <el-dialog v-model="userStore.loginFormVisible"
    :title="userStore.signUpMode ? '注册新用户' : userStore.loginWayPassword ? '密码登录' : '验证码登录'" width="30%">
    <!-- 登录 -->
    <el-form v-if="!userStore.signUpMode" :model="userStore.user" label-width="6rem">
      <el-form-item :label="userStore.loginWayPassword ? '账号：' : '手机号码：'" required>
        <el-col :span="userStore.loginWayPassword ? 24 : 18">
          <el-input v-model="userStore.user.certificate" :placeholder="userStore.loginWayPassword ? '用户名/手机号码' : '手机号码'"
            @keydown.enter="onLogin" />
        </el-col>
        <el-col :span="userStore.loginWayPassword ? 0 : 6">
          <el-button style="width: 100%;" type="primary" @click="sendCode" :disabled="disabledSendCodeButton">{{
            disabledSendCodeButton ? countdown + '秒后重试' : '发送验证码' }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item :label="userStore.loginWayPassword ? '密码：' : '验证码：'" required>
        <el-input v-model="userStore.user.password" :placeholder="userStore.loginWayPassword ? '请输入密码' : '请输入验证码'"
          @keydown.enter="onLogin" :show-password="userStore.loginWayPassword" />
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>
            <el-button type="primary" @click="onLogin">登录账号</el-button>
            <el-button @click="userStore.loginFormVisible = false">取消</el-button>
          </div>
          <div>
            <el-link @click="userStore.changeLoginWay">{{ userStore.loginWayPassword ? '验证码登录' : '密码登录' }}</el-link>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 注册 -->
    <el-form v-if="userStore.signUpMode" :model="signUpUser" label-width="6rem" ref="signUpForm" :rules="signUpRule">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="signUpUser.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="signUpUser.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone" required>
        <el-col :span="18">
          <el-input v-model="signUpUser.phone" placeholder="手机号码" />
        </el-col>
        <el-col :span="6">
          <el-button style="width: 100%;" type="primary" @click="sendCode" :disabled="disabledSendCodeButton">{{
            disabledSendCodeButton ? countdown + '秒后重试' : '发送验证码' }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="验证码" prop="validationCode" required>
        <el-input v-model="signUpUser.validationCode" placeholder="请输入你收到的验证码" />
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input v-model="signUpUser.password" placeholder="设置你的密码" show-password />
      </el-form-item>
      <el-form-item label="重复密码" prop="repassword" required>
        <el-input v-model="signUpUser.repassword" placeholder="重复输入你的密码" show-password />
      </el-form-item>
      <el-form-item>
        <div>
          <el-button type="primary" @click="onSignUp(signUpForm)">注册</el-button>
          <el-button @click="userStore.loginFormVisible = false">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: flex-end;">
        <el-link style="font-size: smaller;color: gray;" :underline="true" @click="userStore.changeSignUpMode">{{
          userStore.signUpMode ? '已有账号?点击登录' : '没有账号？创建一个' }}
        </el-link>
      </div>
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
              <div class="chatuser-list" @click="toMessage(chatUser.userTarget)" v-for="chatUser in chatUserList"
                :key="chatUser.userTarget.uid"
                :class="userMessageStore.chatUser.uid == chatUser.userTarget.uid ? 'chatuser-active' : ''">
                <el-row>
                  <el-col :span="6">
                    <el-badge :value="chatUser.unreadCount" :max="99" :hidden="chatUser.unreadCount == 0"
                      class="chat-userlist-messeage-count">
                      <el-avatar :src="constant.NGINX_SERVER_HOST + chatUser.userTarget.avatar"></el-avatar>
                    </el-badge>
                  </el-col>
                  <el-col :span="17" class="chat-list-name-wrapper">
                    <span class="chat-nickname">{{ chatUser.userTarget.nickname }}</span>
                    <span class="last-message" :class="chatUser.unreadCount != 0 ? 'unread-message' : ''">{{
                      chatUser.lastMessage }}</span>
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
                  <el-row v-for="message, index in userMessageStore.messageList" :key="message.mid"
                    class="chat-message-wrapper" :style="message.systemNotify ? { 'align-items': 'flex-start' } : ''"
                    :class="message.uidSend == userStore.user.uid ? 'message-self' : ''">
                    <el-col :span="3">
                      <el-avatar :size="50"
                        :src="constant.NGINX_SERVER_HOST + (message.uidSend == userStore.user.uid ? userStore.user.avatar : userMessageStore.chatUser.avatar)" />
                    </el-col>
                    <el-col v-if="!message.systemNotify" :span="20"
                      :class="message.uidSend == userStore.user.uid ? 'message-self-content' : ''" class="message"
                      @click="message.status == constant.MESSAGE_STATUS_SEND_FAILED ? userMessageStore.chatSend({ retry: true, i: index }) : null">
                      <svg v-if="message.status == constant.MESSAGE_STATUS_SENDING" xmlns="http://www.w3.org/2000/svg"
                        class="sendLoading" width="12" height="12" viewBox="0 0 24 24">
                        <path fill="#ffffff"
                          d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="1" />
                        <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                          <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite"
                            to="360 12 12" type="rotate" />
                        </path>
                      </svg>
                      <svg v-if="message.status == constant.MESSAGE_STATUS_SEND_FAILED" xmlns="http://www.w3.org/2000/svg"
                        class="sendLoading" width="12" height="12" viewBox="0 0 16 16">
                        <path fill="#B22222"
                          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2a1 1 0 0 0 0-2z" />
                      </svg>
                      <div class="chat-message-content">
                        <span v-if="message.contentType == constant.CONTENT_TYPE_TEXT || message.content == undefined">{{
                          message.content }}</span>
                        <el-image v-if="message.contentType == constant.CONTENT_TYPE_IMAGE"
                          :src="constant.NGINX_SERVER_HOST + message.content" :fit="'fill'" @load="imageLoadSuccess">
                          <template #placeholder>
                            <img src="/img/loading.svg" />
                          </template>
                        </el-image>
                      </div>
                    </el-col>
                    <el-col v-if="message.systemNotify" :span="20"
                      :class="message.uidSend == userStore.user.uid ? 'message-self-content' : ''">
                      <el-card>
                        <el-row>
                          <el-col :span="12">
                            <span>{{ message.title }}</span>
                          </el-col>
                          <el-col :span="6" :offset="6">
                            <span style="font-size: xx-small; color: gray;">{{ message.time }}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col>
                            <div style="margin:2rem 1rem;font-size: smaller;">
                              {{ message.content }}
                            </div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col style="display: flex; justify-content: flex-end;">
                            <el-link :href="message.url" type="primary">点击查看</el-link>
                          </el-col>
                        </el-row>
                      </el-card>
                    </el-col>
                  </el-row>
                  <div style="margin-bottom: 1rem;">

                  </div>
                </div>
              </el-scrollbar>
            </div>
            <!-- 消息发送框 -->
            <div class="message-input-wrapper">
              <div class="chat-content-wrapper">
                <el-input class="chat-content" ref="messageInpuer" v-model="userMessageStore.chatMessage" rows="4"
                  maxlength="250" placeholder="请输入消息..." show-word-limit type="textarea"
                  @keydown.enter.prevent="sendMessage" :disabled="chatUser.uid == '0' || chatUser.uid == '-1'" />
              </div>
              <div style="flex: auto" class="chat-button-warpper">
                <div style="margin-left: .3rem; display: flex; align-items: center;">
                  <el-upload v-show="chatUser.uid != '0' && chatUser.uid != '-1'"
                    :disabled="chatUser.uid == '0' || chatUser.uid == '-1'"
                    style="  display: flex; justify-content: center;align-items: center;width: 1.2rem;height: 1.2rem; "
                    :action="constant.SPRINGBOOT_SERVER_HOST + '/api/upload/image'"
                    :headers="{ [userStore.user.tokenName]: userStore.user.tokenValue }" :show-file-list="false"
                    :on-success="uploadImageSuccess" :before-upload="beforeSend" :on-error="uploadImageError">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#888888" fill-rule="evenodd"
                          d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6.5a1 1 0 0 1-.032.25A1 1 0 0 1 22 12v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 .032-.25A1.002 1.002 0 0 1 2 15.5V5zm2.994 9.83c-.348.006-.68.022-.994.046V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6.016c-4.297.139-7.4 1.174-9.58 2.623c.826.293 1.75.71 2.656 1.256c1.399.84 2.821 2.02 3.778 3.583a1 1 0 1 1-1.706 1.044c-.736-1.203-1.878-2.178-3.102-2.913c-1.222-.734-2.465-1.192-3.327-1.392a15.466 15.466 0 0 0-3.703-.386h-.022zm1.984-8.342A2.674 2.674 0 0 1 8.5 6c.41 0 1.003.115 1.522.488c.57.41.978 1.086.978 2.012c0 .926-.408 1.601-.978 2.011A2.674 2.674 0 0 1 8.5 11c-.41 0-1.003-.115-1.522-.489C6.408 10.101 6 9.427 6 8.5c0-.926.408-1.601.978-2.012z"
                          clip-rule="evenodd" />
                      </svg>
                    </span>
                  </el-upload>
                  <el-upload v-show="chatUser.uid != '0' && chatUser.uid != '-1'"
                    :disabled="chatUser.uid == '0' || chatUser.uid == '-1'"
                    style="  margin-left: .8rem;  display: flex;  justify-content: center;lign-items: center;width: 1.2rem;height: 1.2rem; "
                    :action="constant.SPRINGBOOT_SERVER_HOST + '/api/upload/video'"
                    :headers="{ [userStore.user.tokenName]: userStore.user.tokenValue }" :show-file-list="false"
                    :on-success="uploadVideoSuccess">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                        <mask id="ipTVideoTwo0">
                          <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                            <path d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z" />
                            <path fill="#555" d="M20.5 28v-6.062l5.25 3.03L31 28l-5.25 3.031l-5.25 3.031V28Z" />
                            <path d="M6 15h36m-9-9l-6 9m-6-9l-6 9" />
                          </g>
                        </mask>
                        <path fill="#888888" d="M0 0h48v48H0z" mask="url(#ipTVideoTwo0)" />
                      </svg>
                    </span>
                  </el-upload>
                </div>
                <div>
                  <el-button type="primary" @click="sendMessage"
                    :disabled="chatUser.uid == '0' || chatUser.uid == '-1'">发送</el-button>
                  <el-button type="warning" @click="userMessageStore.clodeMessageDrawer">关闭</el-button>
                </div>
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
import { ElLoading, ElMessage, type FormRules, type FormInstance } from 'element-plus'
import { useModeStore, useUserStore, useLoadingStore, useUserMessageStore, useCaptchaStore, useCommodityListStore, useScrollbarStore } from '@/stores'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { storeToRefs } from 'pinia';
import type User from './interface/User';
import CaptchaSlider from '@/components/CaptchaSlider.vue';
import type { ChatUser } from './interface/UserMessage';
import { FetchPostFileWithToken, FetchPostWithToken } from '@/util/FetchUtil'
import SSEInit from './util/SSEUtil';

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
  if (lockScroll.value && scroll.scrollTop < constant.SCROLLTOP) {
    scrollbar.value.setScrollTop(constant.SCROLLTOP);
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
  SearchBar.value.close();
  router.push({ name: "search", params: { 'keyword': keyword } });
  commodityListStore.url = "/api/commodity?keyword=" + keyword;
}
const loadDone = () => {
  console.log("loaddone")
  scrollbar.value.setScrollTop(0);
  let top = constant.SCROLLTOP;
  setTimeout(() => {
    scrollbar.value.scrollTo({
      top: top,
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
    if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
      // 储存本次操作
      captchaStore.nextMethod = onLogin;
    }
  })

}
const signUpForm = ref<FormInstance>();
const repasswordValidator = (rule: any, value: any, callback: any) => {
  if (value != signUpUser.password) {
    callback(new Error('两次密码不一致'));
    return;
  }
  callback()
}
const signUpUser = reactive({
  validationCode: '',
  username: '',
  password: '',
  repassword: '',
  phone: '',
  nickname: '',
  avatar: '',
});
const signUpRule = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[A-Za-z][A-Za-z0-9]{5,10}$/, message: '允许英文或数字,但开头必须是英文,长度应在5-10之间', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 5, max: 10, message: '长度应在5-10之间', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  validationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{4,6}$/, message: '请输入正确的验证码', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '请输入6-20位密码', trigger: 'blur' },
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: repasswordValidator },
  ],
});
const onSignUp = (signUpForm: FormInstance | undefined) => {
  if (!signUpForm) return
  signUpForm.validate((valid) => {
    if (valid) {
      FetchPostWithToken("/api/user/register", JSON.stringify(signUpUser)).then(data => {
        ElMessage.success("注册成功，已为你自动登录");
        userStore.user = data;
        userStore.logged = true;
        userStore.loginFormVisible = false;
        localStorage.setItem(constant.TOKEN_NAME_KEY, userStore.user?.tokenName as string);
        localStorage.setItem(constant.TOKEN_VALUE_KEY, userStore.user?.tokenValue as string);
        //连接SSE
        userStore.sseClient = SSEInit();
        userMessageStore.fetchChatUserList();
        //如果是首重载首页以获得推荐商品
        if (window.location.pathname == '/') {
          let modeStore = useModeStore();
          modeStore.isRouterAlive = false;
          nextTick(() => {
            modeStore.isRouterAlive = true;
          });
        }
      }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
          // 储存本次操作
          captchaStore.nextMethod = sendCode;
          captchaStore.nextMethodParam = undefined;
        }
      });
    } else {
      return false
    }
  })
}
//发送验证码
const sendCode = () => {
  const send = (phoneNumber: string) => {
    FetchPostWithToken("/api/user/code/" + phoneNumber).then(data => {
      ElMessage.success("验证码发送成功，请注意查收");
      //禁用按钮，并进入倒计时
      disabledSendCodeButton.value = true;
      let timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          disabledSendCodeButton.value = false;
          clearInterval(timer);
        }
      }, 1000);

    }).catch((e: Error) => {
      if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
        // 储存本次操作
        captchaStore.nextMethod = sendCode;
        captchaStore.nextMethodParam = undefined;
      }
    });
  }

  if (userStore.signUpMode) {
    signUpForm.value!.validateField('phone', (valid) => {
      if (valid) {
        send(signUpUser.phone)
      }
      return false
    });
    return;
  }
  if (!userStore.loginWayPassword) {
    //验证手机号
    if (!/^1[3-9]\d{9}$/.test(userStore.user.certificate)) {
      ElMessage.error("请输入正确的手机号码！")
      return;
    }
    send(userStore.user.certificate);
  }
}

//监听路由，随时更改mode
const route = useRoute();
watch(route, (value) => {
  lockScroll.value = false;
  modeStore.mode = value.meta.mode as string;
  loadingStore.loading();
  if (route.meta.mode == "backstage") {
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

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
const toMessage = async (chatUser: User) => {
  count.value = 0;
  userMessageStore.chatUser = chatUser;
  userMessageStore.messageList = [];
  let result = await userMessageStore.fetchMessage();
  let messageWithImage = userMessageStore.messageList.filter(messageL => {
    return messageL.contentType == constant.CONTENT_TYPE_IMAGE;
  });
  while (count.value < messageWithImage.length) {
    await sleep(50);
  }
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
const count = ref(0)
const imageLoadSuccess = (e: Event) => {
  count.value++;
}
watch(tipMMessagePlaySymbols, () => {
  tipAudio.value.play();
});
//发送图片

const uploadImageSuccess = async (response: any) => {
  if (response.flag) {
    count.value = 0
    //发送图片
    await userMessageStore.chatSend({ content: response.data, contentType: constant.CONTENT_TYPE_IMAGE });
    while (count.value < 1) {
      await sleep(50);
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

  } else if (response.code == constant.NOT_LOGIN_CODE) {
    ElMessage.error('登录过期，请重新登录');
    userStore.loginFormVisible = true;
  } else {
    ElMessage({
      message: response.message,
      type: "error"
    });
  }

}
const uploadImageError = (error: any) => {
  if (error.code == constant.NOT_LOGIN_CODE) {
    ElMessage.error('登录过期，请重新登录');
    userStore.loginFormVisible = true;
  } else {
    ElMessage({
      message: error.message,
      type: "error"
    });
  }
}
const beforeSend = (rawFile: any) => {
  if (rawFile.type.slice(0, 6) !== 'image/') {
    ElMessage.error('必须上传图片类型文件!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片不能大于5MB!')
    return false
  }
  return true
}

//上传视频并发送
const uploadVideoSuccess = async (response: any) => {
  if (response.flag) {
    //发送视频
    await userMessageStore.chatSend({ content: response.data, contentType: constant.CONTENT_TYPE_VIDEO });
    // while (count.value < 1) {
    //   await sleep(50);
    // }
    nextTick(() => {
      if (messageScrollBar.value == undefined) {
        return;
      }
      messageScrollBar.value.scrollTo({
        top: messageWrapper.value.clientHeight,
        behavior: "smooth",
      });
    });

  } else if (response.code == constant.NOT_LOGIN_CODE) {
    ElMessage.error('登录过期，请重新登录');
    userStore.loginFormVisible = true;
  } else {
    ElMessage({
      message: response.message,
      type: "error"
    });
  }
}

const disabledSendCodeButton = ref(false);
const countdown = ref(constant.SEND_CODE_Interval)


const goTop = () => {
  scrollbar.value.scrollTo({
    top: 300,
    behavior: "smooth",
  });
}
const aa = () => {
  console.log(1)
}
const scrollbarStore = useScrollbarStore();
onMounted(() => {
  // userMessageStore.messageScrollBar = messageScrollBar;
  // userMessageStore.messageWrapper = messageWrapper;
  // console.log(messageScrollBar.value)
  userStore.checkLogin();
  tipAudio.value = new Audio('/audio/newMessage.mp3');
  scrollbarStore.scrollbar = scrollbar.value;
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
  justify-content: space-between;

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

.sendLoading {
  margin-right: -1rem;
  background: #fbb360;
  border-radius: 50%;
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

.message .el-badge {
  display: flex;
  flex-direction: row-reverse;
}

.message .el-badge__content {
  position: relative;
  cursor: pointer;
}
</style>