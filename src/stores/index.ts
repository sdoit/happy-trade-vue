import { defineStore } from 'pinia'
import type User from '@/interface/User';
import type CommonResult from '@/interface/CommonResult';
import type CommodityBid from '@/interface/CommodityBid';
import { FetchGetWithToken, FetchPostWithToken } from '@/util/fetchUtil';
import constant from '@/common/constant';
import type Commodity from '@/interface/Commodity';
import type UserAddress from '@/interface/UserAddress';
import type Order from '@/interface/Order';
export const useStore = defineStore('main', {
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
    }

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
          }
          return result

        });
    },
    async logout() {
      if (this.logged) {
        return await FetchPostWithToken("/api/user/logout").then(result => {
          if (result.flag) {
            this.user = {} as User
            this.logged = false;
          }
          return result;
        });
      }
    },
    async checkLogin() {
      return await FetchPostWithToken("/api/user/check").then(result => {
        if (result.flag) {
          //已经登录
          this.user = result.data;
          this.logged = true;

        }
        return result;
      })
    }

  }
});

export const useBidStepStore = defineStore('bid', {

  state: () => {
    return {
      commodity: {} as Commodity,
      address: {} as UserAddress,
      commodityBid: {} as CommodityBid,
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
