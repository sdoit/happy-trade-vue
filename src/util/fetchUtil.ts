import constant from "@/common/constant";
import type CommonResult from "@/interface/CommonResult";
import type CommonResultPage from "@/interface/CommonResultPage";



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
        .then((result: CommonResult) => { return result; })
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
        .then((result: CommonResult) => { return result; })
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
        .then((result: CommonResult) => { return result; })
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
        .then((result: CommonResult) => { return result; })
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
export  const FetchGetWithTokenPage = async (url: string) => {
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
