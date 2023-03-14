import { defineStore } from 'pinia'
import type User from '@/interface/User';
import type CommonResult from '@/interface/CommonResult';
import type { Bid } from '@/interface/CommodityBid';
import { FetchDeleteWithToken, FetchGetWithToken, FetchPostWithToken, FetchPostWithTokenNoLoginRequired, FetchPutWithToken } from '@/util/FetchUtil';
import constant from '@/common/constant';
import type Commodity from '@/interface/Commodity';
import type UserAddress from '@/interface/UserAddress';
import type ImageCaptchaInfo from '@/interface/ImageCaptchaInfo';
import SSEInit from '@/util/SSEUtil'
import type UserMessage from '@/interface/UserMessage';
import type { ChatUser } from '@/interface/UserMessage';
import { ref, nextTick } from 'vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router';
export const useModeStore = defineStore('mode', {
  state: () => {
    return {
      //backstage:后台模式，reception:前台模式
      mode: "",
      isRouterAlive: true
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
      addressList: {} as UserAddress[],
      sseClient: undefined,

      loginWayPassword: true,
      // 注册模式
      signUpMode: false

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
    async login(passToken?: string) {
      const userMessageStore = useUserMessageStore();
      let Header = new Headers()
      Header.append('content-type', 'application/json');

      if (passToken != undefined) {
        Header.append('passToken', passToken);
        Header.append('uidToken', useCaptchaStore().captchaTempToken);
      }
      return await fetch(constant.SPRINGBOOT_SERVER_HOST + "/api/user/login", {
        method: 'POST',
        headers: Header,
        body: JSON.stringify({
          certificate: this.user!.certificate,
          password: this.loginWayPassword ? this.user!.password : null,
          validationCode: this.loginWayPassword ? null : this.user!.password
        })
      }).then(response => response.json())
        .then((result: CommonResult) => {
          if (result.flag) {
            this.user = result.data;
            this.logged = true;
            this.loginFormVisible = false;
            localStorage.setItem(constant.TOKEN_NAME_KEY, this.user?.tokenName as string);
            localStorage.setItem(constant.TOKEN_VALUE_KEY, this.user?.tokenValue as string);
            //连接SSE
            this.sseClient = SSEInit();
            userMessageStore.fetchChatUserList();
            //如果是首重载首页以获得推荐商品
            if (window.location.pathname == '/') {
              let modeStore = useModeStore();
              modeStore.isRouterAlive = false;
              nextTick(() => {
                modeStore.isRouterAlive = true;
              });
            }

          } else if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            const captchaStore = useCaptchaStore();
            //储存验证码参数
            captchaStore.imageCaptchaInfo = result.data;
            captchaStore.captchaVisble = true;

            // 储存本次操作
            captchaStore.nextMethod = this.login;
            captchaStore.nextMethodParam = undefined;
            captchaStore.captchaTempToken = result.data.captchaToken;
          } else {
            ElMessage.error(result.message + "(" + result.code + ")");
          }
          return result

        });
    },
    async logout() {
      const userMessageStore = useUserMessageStore();
      if (this.logged) {
        return await FetchPostWithToken("/api/user/logout").then(data => {
          this.user = {} as User
          this.logged = false;
          //销毁消息
          userMessageStore.destroy();
        });
      }
    },
    async checkLogin() {
      const userMessageStore = useUserMessageStore();
      return await FetchPostWithTokenNoLoginRequired("/api/user/check").then(result => {
        if (result?.flag) {
          //已经登录
          this.user = result.data;
          this.user.tokenName=this.tokenName as string;
          this.user.tokenValue=this.tokenValue as string;
          if (this.sseClient == undefined) {
            //连接SSE
            this.sseClient = SSEInit();
          }
          userMessageStore.fetchChatUserList();
        } else {
          //销毁消息
          userMessageStore.destroy();
        }
        this.logged = result?.flag as boolean;
        return result?.flag;
      }).catch((e: Error) => {
        if (e.message = constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION.toString()) {
          // 储存本次操作
          const captchaStore = useCaptchaStore();
          captchaStore.nextMethod = this.checkLogin;
          captchaStore.nextMethodParam = undefined;
        }
      });
    },

    changeLoginWay() {
      this.loginWayPassword = !this.loginWayPassword;
    },
    changeSignUpMode() {
      this.user = {} as User;
      this.signUpMode = !this.signUpMode
    },

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

export const useCommodityListStore = defineStore('commodityList', {

  state: () => {
    return {
      url: ''
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
    closeLoading() {
      this.isLoading = false;
    }
  }
});
export const useUserMessageStore = defineStore('message', {

  state: () => {
    return {
      chatDrawerVisible: false,
      showUserList: false,
      //全部未读消息数
      unreadCount: 0,
      chatUser: {
        uid: "0",
      } as User,
      chatNewUser: { uid: "0" } as User,
      messageMap: new Map() as Map<string, UserMessage[]>,
      messageList: [] as UserMessage[],
      chatMessage: '',
      chatUserList: [] as ChatUser[],
      chatUserMap: new Map() as Map<string, ChatUser>,
      pageMap: new Map() as Map<string, number>,

      tipMMessagePlaySymbols: false,
      //当用户向上滚动获取更多消息时，控制滚动条不要自动下滚
      doNotScroll: false
    }
  },
  getters: {
  },
  actions: {
    playMessageTipAudio() {
      this.tipMMessagePlaySymbols = !this.tipMMessagePlaySymbols
    },

    showMessageDrawer() {
      const userStore = useUserStore();
      if (!userStore.checkLogin()) {
        ElMessage.error("未登录，请先登录");
        userStore.loginFormVisible = true;
        return;
      }
      if (this.chatNewUser.uid == "0") {
        this.messageList = this.messageMap.get(this.chatUser.uid) as UserMessage[];
      }
      this.chatDrawerVisible = true;
    },
    clodeMessageDrawer() {
      this.chatDrawerVisible = false;
    },
    async chatSend(spacilContent?: {
      content: string,
      contentType: string,
    }) {
      let contentType = "TEXT"
      let message = {
        content: this.chatMessage,
        uidReceive: this.chatUser.uid,
        contentType
      };
      if (spacilContent != undefined) {
        message.content = spacilContent.content
        message.contentType = spacilContent.contentType
      } else {
        if (this.chatMessage.trim() == '') {
          return false;
        }
      }
      return await FetchPostWithToken("/api/message", JSON.stringify(message)).then(data => {
        //发送成功
        if (this.messageMap.has(this.chatUser.uid)) {
          let userMessage = {
            content: message.content,
            contentType: message.contentType,
            uidSend: useUserStore().user.uid,
            uidReceive: this.chatUser.uid,
          } as UserMessage;
          this.messageMap.get(this.chatUser.uid)!.push(userMessage);
          if (this.chatUserMap.has(this.chatUser.uid)) {
            if (spacilContent == undefined) {
              this.chatUserMap.get(this.chatUser.uid)!.lastMessage = this.chatMessage
            } else {
              this.chatUserMap.get(this.chatUser.uid)!.lastMessage = '[图片]'
            }
          } else {
            this.fetchChatUserList();
          }
          this.chatMessage = '';
          return true;
        }
        this.chatMessage = '';
        this.fetchMessage();
        this.fetchChatUserList();
        return true;
      }).catch((e: Error) => {
        if (e.message = constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION.toString()) {
          // 储存本次操作
          const captchaStore = useCaptchaStore();
          captchaStore.nextMethod = this.chatSend;
          if (constant == undefined) {
            captchaStore.nextMethodParam = undefined;
          } else {
            captchaStore.nextMethodParam = spacilContent;
          }

        }
      });
    },
    async fetchMessage(getmore?: boolean) {
      if (this.chatUserMap.has(this.chatUser.uid) && this.chatUserMap.get(this.chatUser.uid)!.unreadCount !== 0) {
        //发送请求
        FetchPutWithToken("/api/message/" + this.chatUser.uid).then(data => {
          //设置为已读
          this.chatUserMap.get(this.chatUser.uid)!.unreadCount = 0;
        });
      }
      if (this.messageMap.has(this.chatUser.uid) && (getmore == undefined || !getmore)) {
        this.messageList = this.messageMap.get(this.chatUser.uid) as UserMessage[];
        return true;
      }
      console.log("load message from server")
      let page = 1;
      if (this.pageMap.has(this.chatUser.uid)) {
        page = this.pageMap.get(this.chatUser.uid) as number;
      }
      let url = "/api/message/" + this.chatUser.uid + "?page=" + page;
      if (this.chatUser.uid == "-1") {
        //获取系统通知
        url = "/api/message/notification?page=" + page;
      }
      await FetchGetWithToken(url).then(data => {
        if (data != null) {
          let result: Array<UserMessage>;
          if (this.messageList == undefined) {
            result = data.messages.reverse()
          } else {
            result = data.messages.reverse().concat(this.messageList)
          }
          this.doNotScroll = getmore as boolean
          this.messageList = result;
          this.messageMap.set(this.chatUser.uid, result);
        }
      });
    },
    fetchNotifications() {
      FetchGetWithToken("/api/message/notification").then(data => {
        if (data == undefined || data == null || data.lenght == 0) {
          return;
        }

      })
    },
    fetchChatUserList() {
      FetchGetWithToken("/api/chatList").then(data => {
        if (data == undefined || data == null || data.lenght == 0) {
          return;
        }
        this.chatUserList = data;
        for (const chatUser of this.chatUserList) {
          if (chatUser.uidTarget == undefined) {
            //系统通知
            chatUser.uid = "-1";
            chatUser.userTarget = {
              uid: "-1",
              nickname: '系统通知',
              avatar: '/image/notify.png'
            } as User
            this.chatUserMap.set("-1", chatUser)
          } else {
            if (chatUser.contentType == constant.CONTENT_TYPE_IMAGE) {
              chatUser.lastMessage = '[图片]'
            } else if (chatUser.contentType == constant.CONTENT_TYPE_VIDEO) {
              chatUser.lastMessage = '[视频]'
            }
            this.chatUserMap.set(chatUser.userTarget.uid, chatUser)
          }
        }

        //设置未读消息数
        let count = 0;
        for (const chatUser of this.chatUserList) {
          count += chatUser.unreadCount == undefined ? 0 : chatUser.unreadCount;
        }
        this.unreadCount = count;
        //如果没有默认选中，就选中第一个
        if (this.chatUser.uid == "0") {
          this.chatUser = this.chatUserList[0].userTarget
          this.fetchMessage()
          return;
        }
        //如果是新聊天，就模拟一个记录插入列表
        //遍历列表，查看是否有chatNewUser
        let haveNew = false;
        for (const chatUser of this.chatUserList) {
          if (chatUser.userTarget.uid == this.chatNewUser.uid) {
            haveNew = true;
            return;
          }
        }
        if (!haveNew && this.chatNewUser.uid != "0") {
          this.chatUserList.push({ lastMessage: '', userTarget: this.chatNewUser, unreadCount: 0 } as ChatUser);
          this.chatUserMap.set(this.chatUser.uid, { lastMessage: '', userTarget: this.chatNewUser, unreadCount: 0 } as ChatUser);
        }
      })
    },

    //当与新用户发起聊天时，插入一个虚假的用户对象到chatUserMap中，使用户列表里有一个头像
    putVirtuaChatUserToMap(user: User) {
      //聊天列表中是否存在这个用户
      let exitsUser = false;
      if (this.chatUserMap.has(this.chatUser.uid) || this.chatUser.uid == "0") {
        for (const chatUser of this.chatUserList) {
          if (chatUser.userTarget.uid == this.chatUser.uid) {
            exitsUser = true;
            return;
          }
        }
      }
      //主动插入，但fetchChatUserList() 会覆盖 228行会重新修正
      this.chatUserList.push({ lastMessage: '', userTarget: user } as ChatUser);
      this.chatUserMap.set(this.chatUser.uid, { lastMessage: '', userTarget: user } as ChatUser);
      this.chatNewUser = user
    },
    removeChatUser(chatUser: ChatUser) {
      this.chatUserMap.delete(chatUser.userTarget.uid);
      this.chatUserList = this.chatUserList.filter((cu) => {
        return cu.userTarget.uid != chatUser.userTarget.uid
      });
      this.messageMap.delete(chatUser.userTarget.uid);
      if (chatUser.uidTarget == this.chatUser.uid) {
        this.messageList = [];
        this.chatUser.uid = "0";
        this.chatUser.nickname = "";
      }
      //发送请求 异步
      FetchDeleteWithToken("/api/chatList/" + chatUser.uidTarget);

    },
    destroy() {
      this.chatDrawerVisible = false,
        this.showUserList = false,
        //全部未读消息数
        this.unreadCount = 0,
        this.chatUser = {
          uid: "0",
        } as User,
        this.chatNewUser = { uid: "0" } as User,
        this.messageMap = new Map() as Map<string, UserMessage[]>,
        this.messageList = [] as UserMessage[],
        this.chatMessage = '',
        this.chatUserList = [] as ChatUser[],
        this.chatUserMap = new Map() as Map<string, ChatUser>
    }
  }
});
/**验证码 */
export const useCaptchaStore = defineStore('captcha', {

  state: () => {
    return {
      captchaVisble: false,
      imageCaptchaInfo: {} as ImageCaptchaInfo,
      nextMethod: {} as any,
      nextMethodParam: undefined as any,
      captchaTempToken: ''

    }
  },
  getters: {},
  actions: {


  }
});

export const usePayStore = defineStore('pay', {
  state: () => {
    return {
      payTimeOutCallBack: {} as any,
      paySuccessCallBack: {} as any,
      typr: ''
    }
  },
})