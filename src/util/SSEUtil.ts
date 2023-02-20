import { EventSourcePolyfill } from 'event-source-polyfill';
import constant from '@/common/constant';
import type Message from '@/interface/Message';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { ElNotification } from 'element-plus'
import { h } from 'vue';


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
    const tokenName: string = localStorage.getItem(constant.TOKEN_NAME_KEY) as string;
    const tokenValue: string = localStorage.getItem(constant.TOKEN_VALUE_KEY) as string;
    const sse = new EventSourcePolyfill(constant.SPRINGBOOT_SERVER_HOST + '/api/sse/connect', {
        headers: {
            [tokenName]: tokenValue
        },
        heartbeatTimeout: 120000,
    });
    sse.onopen = function (event: any) {
        console.log("连接成功", event);
    };


    sse.onmessage = function (event: MessageEvent) {
        if (event.lastEventId == "0") {
            return;
        }
        let rawDataArray = (event.data as string).split("\n")
        let message = {
            type: rawDataArray[0],
            title: rawDataArray[1],
            content: rawDataArray[2],
            url: rawDataArray[3],
            EventId: event.lastEventId
        }
        ElNotification({
            title: message.title,
            message: h('p', { style: 'color: teal,text-align:right' }, [message.content,
            h('p', { style: 'margin-top:.2rem' }, h('a', { href: message.url, style: 'color: #409eff' }, "点击查看"))]),
            type: getType(message.type),
            duration: 10000
        });

    };
    sse.ontimeout = function (event: any) {
        console.log(event)
    }
    sse.onerror = function (error: any) {
        console.log(error)
    }
}
export default SSEInit