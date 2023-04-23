import { EventSourcePolyfill } from 'event-source-polyfill';
import constant from '@/common/constant';
import type Message from '@/interface/Message';
import type { ChatUser } from '@/interface/UserMessage';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { ElNotification } from 'element-plus'
import { h } from 'vue';
import { FetchGetWithToken } from './FetchUtil';
import type User from '@/interface/User';
import { useUserMessageStore, useUserStore, usePayStore } from '@/stores'
import type UserMessage from '@/interface/UserMessage';
import NewMessageNotify from '@/components/NewMessageNotify.vue'

const getType = (s: string) => {
    switch (s) {
        case 'success':
            return 'success' as EpPropMergeType<StringConstructor, 'success', unknown>;
        case 'info':
            return 'info' as EpPropMergeType<StringConstructor, 'info', unknown>;
        case 'error':
            return 'error' as EpPropMergeType<StringConstructor, 'error', unknown>;
        case 'warning':
            return 'warning' as EpPropMergeType<StringConstructor, 'warning', unknown>;
        default:
            return '' as EpPropMergeType<StringConstructor, '', unknown>;
    }
}
const SSEInit = () => {
    const userMessageStore = useUserMessageStore();
    const tokenName: string = localStorage.getItem(constant.TOKEN_NAME_KEY) as string;
    const tokenValue: string = localStorage.getItem(constant.TOKEN_VALUE_KEY) as string;
    const sse = new EventSourcePolyfill(constant.SPRINGBOOT_SERVER_HOST + '/api/sse/connect', {
        headers: {
            [tokenName]: tokenValue
        },
        heartbeatTimeout: 210000,
    });
    sse.onopen = function (event: any) {
        console.log("连接成功", event);
    };
    sse.onmessage = function (event: MessageEvent) {
        console.log(event)
        if (event.data == "ping") {
            //心跳包
            return;
        }
        let rawDataArray = (event.data as string).split("\n")
        let message = {
            type: rawDataArray[0],
            id: rawDataArray[1],
            title: rawDataArray[2],
            content: rawDataArray[3],
            url: rawDataArray[4],
            falg: rawDataArray[5],
            contentType: rawDataArray[6],
        }

        if (message.type == constant.SSE_MESSAGE_ID_NOTIFY) {
            //播放提示音
            userMessageStore.playMessageTipAudio();
            ElNotification({
                title: message.title,
                message: h('p', { style: 'color: teal,text-align:right' }, [message.content, h('p', { style: 'margin-top:.2rem' }, h('a', { href: message.url, style: 'color: #409eff' }, "点击查看"))]),
                type: getType(message.falg),
                duration: 5000
            });
            return;
        } else if (message.type == constant.SSE_MESSAGE_ID_USER_MESSAGE) {
            userMessageStore.playMessageTipAudio();
            if (userMessageStore.chatUserMap.has(message.url)) {
                let userMessage = userMessageStore.chatUserMap.get(message.url);
                if (userMessageStore.chatUser.uid != message.url) {
                    userMessage!.unreadCount += 1
                }
                userMessage!.lastMessage = message.content
                if (userMessageStore.messageMap.has(message.url)) {
                    userMessageStore.messageMap.get(message.url)!.push(
                        {
                            content: message.content,
                            uidSend: message.url,
                            contentType: message.contentType,
                            uidReceive: useUserStore().user.uid,
                            read: false,
                            systemNotify: false
                        } as UserMessage);
                }
            } else {
                FetchGetWithToken("/api/user/" + message.url).then(data => {
                    const user: User = data;
                    let lastMessage = {
                        lastMessage: message.content,
                        contentType: message.contentType,
                        uid: useUserStore().user.uid,
                        userTarget: user,
                    } as ChatUser;


                    userMessageStore.chatUserMap.set(message.url, lastMessage);
                    userMessageStore.chatUserList.push(lastMessage);
                })
            }

            //获取用户头像 昵称 
            FetchGetWithToken("/api/user/" + message.url).then(data => {
                if (data == undefined) {
                    return;
                }
                //播放提示音
                const user: User = data;
                if (userMessageStore.chatDrawerVisible) {
                    return;
                }
                ElNotification({
                    title: '新消息',
                    message: h(NewMessageNotify, { user: user, message: message }),
                    duration: 5000
                });
            })
            return;
        }
        else if (message.type == constant.SSE_PAYMENT_RESULTS_MESSAGE) {
            const payStore = usePayStore();
            if (message.id == constant.ORDER_ALIPAY_SUCCESS) {
                payStore.paySuccessCallBack('order', message.url);
            } else if (message.id == constant.BID_ALIPAY_SUCCESS) {
                payStore.paySuccessCallBack('bid');
            }
        }

    };
    sse.ontimeout = function (event: any) {
        console.log(event)
    }
    sse.onerror = function (error: any) {
        console.log(error)
    }
    return sse;
}
export default SSEInit


// h('div', { style: 'display: flex;flex-direction: column;' },
//                             [
//                                 h('div', { style: 'display: flex;align-items: center;margin-top:1rem;' },
//                                     [
//                                         h('div', { style: 'height:3rem' },
//                                             [h('img', { src: constant.NGINX_SERVER_HOST + "/" + user.avatar, style: 'object-fit: cover; width: 3rem; border-radius: 50%;' })]),
//                                         h('div', { style: 'display: flex; flex-direction: column;align-items: flex-start;justify-content: center; margin-left: .3rem;' },
//                                             [
//                                                 h('span', { class: 'notify-span', style: 'font-size: small;color: black;' }, user.nickname),
//                                                 h('span', { class: 'notify-span', style: 'font-size: smaller;color:gray;' }, message.content)
//                                             ]
//                                         ),
//                                     ]),
//                                 h('a', { href: message.url, style: 'color: #409eff;display:flex;justify-content:flex-end;' }, "点击查看")
//                             ]
//                         ),