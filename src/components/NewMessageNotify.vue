<!-- h('div', {  },
[
    h('div', {  },
        [
            h('div', {  },
                [h('img', { src: , style: 'object-fit: cover; width: 3rem; border-radius: 50%;' })]),
            h('div', {  },
                [
                    h('span', { class: 'notify-span', style: ';' }, user.nickname),
                    h('span', { class: 'notify-span', style: '' }, message.content)
                ]
            ),
        ]),
    h('a', { href: message.url, style: 'color: #409eff;display:flex;justify-content:flex-end;' }, "")
]
), -->


<template>
    <div style="display: flex;flex-direction: column;">
        <div style="display: flex;align-items: center;margin-top:1rem;">
            <div style="height:3rem">
                <el-avatar :size="45" :src="constant.NGINX_SERVER_HOST + '/' + user.avatar"></el-avatar>
            </div>
            <div
                style="display: flex; flex-direction: column;align-items: flex-start;justify-content: center; margin-left: .3rem;">
                <span class='notify-span' style="font-size: smaller;color:#08080">{{ user.nickname }}</span>
                <span class='notify-span' style="font-size: small;color:#696969;">
                    {{ message.content }}
                </span>
            </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: .4rem;">
            <el-link @click="toChat" type="primary">点击查看</el-link>
        </div>
    </div>
</template>
<script setup lang="ts">
import constant from '@/common/constant';
import type User from '@/interface/User';
import { useUserStore, useUserMessageStore } from '@/stores'

const userMessageStore = useUserMessageStore();
const props = defineProps(['user', 'message']);


const toChat = () => {
    userMessageStore.chatNewUser = { uid: "0" } as User
    userMessageStore.chatUser = props.user;
    if (userMessageStore.messageMap.has(props.user.uid)) {
        userMessageStore.showMessageDrawer()
    } else {
        userMessageStore.fetchMessage();
    }
}
</script>
<style>
.el-notification__group {
    display: flex;
    flex-direction: column;
    width: 100%;
}


.notify-span {
    max-width: 14rem;
    min-width: 4rem;
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
</style>