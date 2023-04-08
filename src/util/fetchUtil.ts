import constant from "@/common/constant";
import type CommonResult from "@/interface/CommonResult";
import type CommonResultPage from "@/interface/CommonResultPage";
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore, useCaptchaStore, useLoadingStore } from '@/stores'


export const FetchPostWithToken = async (url: string, body?: BodyInit) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        method: 'POST',
        headers,
        body
    }).then(response => response.json())
        .then((result: CommonResult) => {
            if (result.flag) {
                return result.data;
            }
            else if (result.code == constant.NOT_LOGIN_CODE) {
                ElMessage.error("未登录，请重新登录")
                useUserStore().loginFormVisible = true;
                throw new Error('未登录');
            } else if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
                const captchaStore = useCaptchaStore()
                //储存验证码参数
                captchaStore.imageCaptchaInfo = result.data;
                captchaStore.captchaVisble = true;
                throw new Error(JSON.stringify(result));

            } else {
                ElMessage.error(result.message + " (" + result.code + ")");
                throw new Error(JSON.stringify(result));
            }
        })
}
export const FetchPostFileWithToken = async (url: string, file: File) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const fd = new FormData()
    fd.append('file', file)
    const headers = new Headers();
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        method: 'POST',
        headers,
        body: fd
    }).then(response => response.json())
        .then((result: CommonResult) => {
            if (result.flag) {
                return result.data;
            }
            else if (result.code == constant.NOT_LOGIN_CODE) {
                ElMessage.error("未登录，请重新登录")
                useUserStore().loginFormVisible = true;
                throw new Error('未登录');
            } else if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
                const captchaStore = useCaptchaStore()
                //储存验证码参数
                captchaStore.imageCaptchaInfo = result.data;
                captchaStore.captchaVisble = true;
                throw new Error(JSON.stringify(result));

            } else {
                ElMessage.error(result.message + " (" + result.code + ")");
                useLoadingStore().closeLoading();
                throw new Error(JSON.stringify(result));
            }
        })
}
export const FetchDeleteWithToken = async (url: string, body?: BodyInit) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        method: 'DELETE',
        headers,
        body
    }).then(response => response.json())
        .then((result: CommonResult) => {
            if (result.flag) {
                return result.data;
            } else if (result.code == constant.NOT_LOGIN_CODE) {
                ElMessage.error("未登录，请重新登录")
                useUserStore().loginFormVisible = true;
                throw new Error('未登录');
            } else if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
                const captchaStore = useCaptchaStore()
                //储存验证码参数
                captchaStore.imageCaptchaInfo = result.data;
                captchaStore.captchaVisble = true;
                throw new Error(JSON.stringify(result));
            } else {
                ElMessage.error(result.message + " (" + result.code + ")");
                throw new Error(JSON.stringify(result));
            }
        })
}
export const FetchPutWithToken = async (url: string, body?: BodyInit) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        method: 'PUT',
        headers,
        body
    }).then(response => response.json())
        .then((result: CommonResult) => {
            if (result.flag) {
                return result.data;
            }
            else if (result.code == constant.NOT_LOGIN_CODE) {
                ElMessage.error("未登录，请重新登录")
                useUserStore().loginFormVisible = true;
                throw new Error('未登录');
            } else if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
                const captchaStore = useCaptchaStore()
                //储存验证码参数
                captchaStore.imageCaptchaInfo = result.data;
                captchaStore.captchaVisble = true;
                throw new Error(JSON.stringify(result))
            } else {
                ElMessage.error(result.message + " (" + result.code + ")");
                throw new Error(JSON.stringify(result));
            }
        })
}
export const FetchGetWithToken = async (url: string) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        headers,
    }).then(response => response.json())
        .then((result: CommonResult) => {
            if (result.flag) {
                return result.data;
            }
            else if (result.code == constant.NOT_LOGIN_CODE) {
                ElMessage.error("未登录，请重新登录")
                useUserStore().loginFormVisible = true;
                throw new Error('未登录');
            } else if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
                const captchaStore = useCaptchaStore()
                //储存验证码参数
                captchaStore.imageCaptchaInfo = result.data;
                captchaStore.captchaVisble = true;

            } else {
                ElMessage.error(result.message + " (" + result.code + ")");
                throw new Error(JSON.stringify(result));
            }
        })
}
export const FetchPostWithTokenNoLoginRequired = async (url: string, body?: BodyInit) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        method: 'POST',
        headers,
        body
    }).then(response => response.json())
        .then((result: CommonResult) => {
            if (result.code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
                const captchaStore = useCaptchaStore()
                //储存验证码参数
                captchaStore.imageCaptchaInfo = result.data;
                captchaStore.captchaVisble = true;
                throw new Error(JSON.stringify(result))
            } else {
                return result;
            }
        })
}
/**
 * 不返回json格式化后的结果，直接返回response
 * @param url http开头的地址
 * @returns 
 */
export const FetchGetWithTokenRaw = async (httpurl: string) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(httpurl, {
        headers,
    }).then(response => { return response; })
}
/**
 * 带分页
 * @param url 
 * @returns 
 */
export const FetchGetWithTokenPage = async (url: string) => {
    const tokenName = localStorage.getItem(constant.TOKEN_NAME_KEY);
    const tokenValue = localStorage.getItem(constant.TOKEN_VALUE_KEY);
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append(tokenName!, tokenValue!);
    return await fetch(constant.SPRINGBOOT_SERVER_HOST + url, {
        headers,
    }).then(response => response.json())
        .then((result: CommonResultPage) => { return result; })
}
