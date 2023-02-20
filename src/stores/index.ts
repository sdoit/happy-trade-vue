import { defineStore } from 'pinia'
import type User from '@/interface/User';
import type CommonResult from '@/interface/CommonResult';
import type { Bid } from '@/interface/CommodityBid';
import { FetchGetWithToken, FetchPostWithToken, FetchPostWithTokenNoLoginRequired } from '@/util/FetchUtil';
import constant from '@/common/constant';
import type Commodity from '@/interface/Commodity';
import type UserAddress from '@/interface/UserAddress';
import SSEInit from '@/util/SSEUtil'
import type UserMessage from '@/interface/UserMessage';
import { ref, nextTick } from 'vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
export const useModeStore = defineStore('mode', {
  state: () => {
    return {
      //backstage:后台模式，reception:前台模式
      mode: "",
    }
  },
  getters: {},
  actions: {


  }
});

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {} as User,
      logged: false,
      loginFormVisible: false,
      addressList: {} as UserAddress[]
    }
  },
  getters: {
    tokenName: () => {
      return localStorage.getItem(constant.TOKEN_NAME_KEY);
    },
    tokenValue: () => {
      return localStorage.getItem(constant.TOKEN_VALUE_KEY);
    },

  },
  actions: {
    async login() {
      return await fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/user/login", {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          certificate: this.user?.certificate,
          password: this.user?.password
        })
      }).then(response => response.json())
        .then((result: CommonResult) => {
          if (result.flag) {
            this.user = result.data;
            this.logged = true;
            localStorage.setItem(constant.TOKEN_NAME_KEY, this.user?.tokenName as string);
            localStorage.setItem(constant.TOKEN_VALUE_KEY, this.user?.tokenValue as string);
            //连接SSE
            SSEInit();
          }
          return result

        });
    },
    async logout() {
      if (this.logged) {
        return await FetchPostWithToken("/api/user/logout").then(data => {
          this.user = {} as User
          this.logged = false;
        });
      }
    },
    async checkLogin() {
      return await FetchPostWithTokenNoLoginRequired("/api/user/check").then(result => {
        if (result?.flag) {
          //已经登录
          this.user = result.data;
          //连接SSE
          SSEInit();
        }
        this.logged = result?.flag as boolean;
        return result?.flag;
      })
    }

  }
});


export const useBidStepStore = defineStore('bid', {

  state: () => {
    return {
      commodity: {} as Commodity,
      address: {} as UserAddress,
      commodityBid: {} as Bid,
      seller: {} as User
    }
  },
  getters: {},
  actions: {


  }
});



export const usePathStore = defineStore('path', {

  state: () => {
    return {
      path: [
        { name: "个人中心", path: '/buyer/order' },
      ]
    }
  },
  getters: {},
  actions: {


  }
});

export const useLoadingStore = defineStore('loading', {

  state: () => {
    return {
      isLoading: false
    }
  },
  actions: {
    loading() {
      this.isLoading = true;
    },
    clodeLoading() {
      this.isLoading = false;
    }
  }
});
export const useUserMessageStore = defineStore('message', {

  state: () => {
    return {
      chatDrawerVisible: false,
      chatUserUid: '',
      messageList: [] as UserMessage[],
      chatMessage: '',
    }
  },
  actions: {
    showMessageDrawer() {
      this.chatDrawerVisible = true;
    },
    clodeMessageDrawer() {
      this.chatDrawerVisible = false;
    },
    async chatSend() {
      return await FetchPostWithToken("/api/message", JSON.stringify({
        content: this.chatMessage,
        uidReceive: this.chatUserUid
      })).then(data => {
        //发送成功
        this.chatMessage = '';
        this.fetMessage();
        return true;
      })
    },
    fetMessage() {
      FetchGetWithToken("/api/message/" + this.chatUserUid).then(data => {
        this.messageList = data;
      })
    }
  }
});