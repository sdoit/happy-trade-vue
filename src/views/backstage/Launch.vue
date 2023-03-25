<template>
    <div style="margin-top: 2rem;">
        <el-result v-if="!userStore.logged" title="请先登录" sub-title="登录后才能继续操作">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 2048 2048">
                    <path fill="#888888"
                        d="M1728 1152q26 0 45 19t19 45q0 26-19 45t-45 19q-26 0-45-19t-19-45q0-26 19-45t45-19zm-603-19q-79-54-170-81t-187-28q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0q106 0 199 40t163 109t110 163t40 200q0 67-16 129t-48 119t-75 103t-101 83q81 29 156 80l-71 107zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149zm1280 384q79 0 149 30t122 82t83 123t30 149q0 80-30 149t-82 122t-123 83t-149 30q-65 0-128-23v151h-128v128h-128v128H896v-282l395-396q-11-46-11-90q0-79 30-149t82-122t122-83t150-30zm0 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 35 9 64t21 61l-414 413v102h128v-128h128v-128h128v-91l93-92q40 23 77 39t86 16z" />
                </svg>
            </template>
            <template #extra>
                <el-button type="primary" @click="userStore.loginFormVisible = true">点击登录</el-button>
            </template>
        </el-result>
        <div v-if="userStore.logged">
            <el-row :justify="'center'" v-if="$route.meta.launchForRequest" style="margin-bottom: 2rem; height: 12rem;">
                <el-col :span="16">
                    <el-card>
                        <el-row>
                            <el-col :span="6">
                                <el-image :src="constant.NGINX_SERVER_HOST + '/' + request?.cover" :fit="'fill'"
                                    style="width: 10rem;"></el-image>
                            </el-col>
                            <el-col :span="17" :offset="1" class="bid-wrapper">
                                <div class="commodity-info-wrapper" style="display: flex; flex-direction: column;">
                                    <span class="name">{{ request?.name }}</span>
                                    <span class="cid">求购编号：{{ request?.rid }}</span>
                                    <span class="time">发布时间：{{ request?.time }}</span>
                                    <span class="price">预计价格：￥{{ request?.price }}</span>
                                    <span class="price">浏览人数：{{ request?.viewCount }}</span>
                                    <span class="price">出货人数：{{ request?.cidCount }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :justify="'center'">
                <el-col :span="16" class="launch-content-wrapper">
                    <div class="launch-content">
                        <!-- <div class="step1">

                        </div>
                        <div class="step2">

                        </div> -->
                        <div class="step3">
                            <el-row class="commodity-info">
                                <el-col :span="4" class="upload-wrapper">
                                    <el-upload class="cover-uploader"
                                        :action="constant.SPRINGBOOT_SERVER_HOST + '/api/upload/image'"
                                        :headers="{ [userStore.user.tokenName]: userStore.user.tokenValue }"
                                        :on-success="updateSuccess" :on-error="updateError" :before-upload="beforeUpload"
                                        :show-file-list="false">
                                        <el-image v-if="coverUrl" loading="lazy" :src="coverUrl" :fit="'fill'"
                                            class="res-img">
                                            <template #placeholder>
                                                <div class="img-slot-wrapper">
                                                    <img src="/img/loading.svg" alt="正在加载" />
                                                </div>
                                            </template>
                                            <template #error>
                                                <div class="img-slot-wrapper">
                                                    <img src="/img/error.svg" alt="图片加载失败" />
                                                </div>
                                            </template>
                                        </el-image>
                                        <el-icon v-else class="cover-uploader-icon">
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </el-col>
                                <el-col :span="20">
                                    <el-form :model="commodity" label-position="right"
                                        :label-width="$route.meta.request ? '7rem' : '5rem'">
                                        <el-row>
                                            <el-col :span="18">
                                                <el-form-item :label="$route.meta.request ? '求购商品名：' : '商品名：'" required>
                                                    <el-input v-model="commodity.name"
                                                        :placeholder="$route.meta.request ? '填写你要求购的商品名称' : $route.meta.launchForRequest ? '请输入商品名，尽量符合原求购的要求' : '填写你要发布商品的名称'" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item :label="$route.meta.request ? '可接受的成色' : '成色：'" required>
                                                    <el-input-number v-model="commodity.quality" :precision="1" :min='0'
                                                        :max="9.9" :step="0.1" />
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="14">
                                                <el-form-item :label="$route.meta.request ? '预计价格：' : '价格：'" required>
                                                    <el-input v-model="commodity.price" type="number">
                                                        <template #prepend>￥</template>
                                                    </el-input>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="5">
                                                <el-form-item :label="$route.meta.request ? '可接受的邮费' : '邮费：'"
                                                    :required="!commodity.freeShipping && !commodity.freightCollect">
                                                    <el-input v-model="commodity.fare" type="number"
                                                        :disabled="commodity.freeShipping || commodity.freightCollect">
                                                        <template #prepend>￥</template>
                                                    </el-input>

                                                </el-form-item>

                                            </el-col>
                                            <el-col :span="5">
                                                <div class="postage-info">
                                                    <el-switch :disabled="commodity.freeShipping"
                                                        v-model="commodity.freightCollect" class="settlement-method"
                                                        inline-prompt
                                                        style="--el-switch-on-color: #006400; --el-switch-off-color: #8B4513"
                                                        active-text="邮费到付" inactive-text="邮费现结" />

                                                    <el-checkbox v-model="commodity.freeShipping" label="包邮" size="large"
                                                        class="postage-check" />
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col>
                                                <el-form-item label="分类：" required>
                                                    <el-cascader :props="props" placeholder="选择分类"
                                                        v-model="commodity.type.typePath" @change="typeChange"
                                                        class="typeSelecter" />
                                                </el-form-item>
                                            </el-col>
                                        </el-row>

                                    </el-form>
                                    <div class="tag-wrapper">
                                        <el-tag v-for="tag, index in commodity.tags" :key="index" class="tag" closable
                                            :disable-transitions="false" @close="handleClose(tag)"
                                            :type="randomTagType(index)">
                                            {{ tag.tag }}
                                        </el-tag>
                                        <el-autocomplete v-if="inputVisible" ref="InputRef" v-model="tagValue"
                                            :trigger-on-focus="false" :fetch-suggestions="fetchTagSuggestions"
                                            placeholder="请输入标签" @select="handleSelectConfirm"
                                            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" size="small" />
                                        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"
                                            type="primary">
                                            + 新标签
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>


                            <div class="editor-wrapper">
                                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
                                    :defaultConfig="toolbarConfig" :mode="mode" class="editor-toolbar" />
                                <el-scrollbar height="500px" class="editor-scroll">
                                    <Editor style="overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
                                        :mode="mode" @onCreated="handleCreated" />
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="launch-button">
                            <el-button type="primary" size="large" @click="submit">{{ $route.meta.edit ? '确定编辑' :
                                ($route.meta.request ? '发布求购' :
                                    '发布商品') }}</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useUserStore, useLoadingStore, useCaptchaStore, useScrollbarStore } from '@/stores'
import '@wangeditor/editor/dist/css/style.css';
import '@/assets/css/wang.css'
import type CommonResult from '@/interface/CommonResult';
import constant from '@/common/constant';
import { Plus } from '@element-plus/icons-vue'
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { type UploadProps, type ElInput, ElLoading } from 'element-plus'
import { ElMessage } from 'element-plus'
import { FetchGetWithToken, FetchPostFileWithToken, FetchPostWithToken, FetchPutWithToken } from '@/util/FetchUtil';
import type CommodityType from '@/interface/CommodityType';
import type Node from 'element-plus/es/components/cascader-panel/src/node';
import router from '@/router';
import { useRoute } from 'vue-router';
import type Tag from '@/interface/Tag';
import type Request from '@/interface/Request';
const Route = useRoute();

const loadingStore = useLoadingStore();
const userStore = useUserStore();

const request = ref<Request>();

const commodity = ref({
    cid: 0,
    name: '',
    price: 0,
    quality: 9.9,
    fare: 0,
    freeShipping: false,
    freightCollect: false,
    type: {
        tid: 0,
        typePath: []
    },
    description: '',
    cover: '',
    tags: [] as Tag[],
    requestId: Route.params.rid
});
const coverUrl = ref('');

//tag
const InputRef = ref<InstanceType<typeof ElInput>>()

const inputVisible = ref(false)

const handleClose = (tag: Tag) => {
    commodity.value.tags.splice(commodity.value.tags.indexOf(tag), 1)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}
const tagValue = ref()
const handleInputConfirm = () => {
    if (tagValue.value) {
        commodity.value.tags.push({ tid: '0', tag: tagValue.value })
    }
    inputVisible.value = false
    tagValue.value = '';
}
const tagType = ['' as EpPropMergeType<StringConstructor, '', unknown>,
'success' as EpPropMergeType<StringConstructor, 'success', unknown>,
'info' as EpPropMergeType<StringConstructor, 'info', unknown>,
'danger' as EpPropMergeType<StringConstructor, 'danger', unknown>,
'warning' as EpPropMergeType<StringConstructor, 'warning', unknown>];
const randomTagType = (index: number) => {
    return tagType[index % tagType.length]
}
type TagCandidate = { tid: string, value: string }
const handleSelectConfirm = (item: Record<string, any>) => {
    commodity.value.tags.push({ tid: item.tid, tag: item.value })
}

const fetchTagSuggestions = (queryString: string, cb: (arg: any) => void) => {
    FetchGetWithToken("/api/tag/" + queryString).then(data => {
        const tagCandidates: TagCandidate[] = [];
        for (const tag of data as Tag[]) {
            tagCandidates.push({ tid: tag.tid, value: tag.tag })
        }
        if (data.length == 0) {
            tagCandidates.push({ tid: "", value: queryString })
        }
        cb(tagCandidates);

    });
}

//cover上传
const updateSuccess: UploadProps['onSuccess'] = (
    response: CommonResult,
    uploadFile
) => {
    if (response.flag) {
        coverUrl.value = constant.NGINX_SERVER_HOST + "/" + response.data;
        commodity.value.cover = response.data;
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
const updateError: UploadProps['onError'] = (error: Error, uploadFile) => {
    const result: CommonResult = JSON.parse(error.message);
    if (result.code == constant.NOT_LOGIN_CODE) {
        ElMessage.error('登录过期，请重新登录');
        userStore.loginFormVisible = true;
    } else {
        ElMessage({
            message: result.message,
            type: "error"
        });
    }
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type.slice(0, 6) !== 'image/') {
        ElMessage.error('必须上传图片类型文件!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('图片不能大于5MB!')
        return false
    }
    return true
}


//富文本
const editorRef = shallowRef();
const mode = ref('default');
const valueHtml = ref('')
const toolbarConfig = {
    toolbarKeys: [
        'headerSelect',
        "blockquote",
        '|',
        'bold',
        'underline',
        'italic',
        'through',
        {
            key: 'group-more-style',
            title: '更多样式',
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>', // 可选
            menuKeys: ["sub", "sup", "clearStyle"]
        },
        'color',
        'bgColor',
        '|',
        'fontSize',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'codeBlock',
        'divider',
        '|',
        'uploadImage',
        'uploadVideo',
        '|',
        'undo',
        'redo',
        '|',
        'fullScreen'
    ]
}

type InsertFnType = (url: string, alt: string, href: string) => void;

const editorConfig = {

    placeholder: Route.meta.request ? '请输入你要收购商品的详细描述和要求...' : Route.meta.launchForRequest ? '请输入商品介绍，尽量符合原求购要求' : '请输入商品描述以吸引更多买家...',
    MENU_CONF: {
        uploadImage: {
            server: constant.SPRINGBOOT_SERVER_HOST + '/api/upload/image',
            fieldName: 'file',
            maxFileSize: 10 * 1024 * 1024, // 10M
            maxNumberOfFiles: 10,
            headers: {
                [userStore.tokenName as string]: userStore.tokenValue
            },
            // 超时时间，默认为 10 秒
            timeout: 5 * 1000, // 5 秒
            customInsert(result: CommonResult, insertFn: InsertFnType) {
                if (result.flag) {
                    console.log(result.data);
                    let url = constant.NGINX_SERVER_HOST + "/" + result.data
                    insertFn(url, '', '');
                }
            },
        },
        uploadVideo: {
            server: constant.SPRINGBOOT_SERVER_HOST + '/api/upload/video',
            fieldName: 'file',
            maxFileSize: 150 * 1024 * 1024, // 150M
            maxNumberOfFiles: 3,
            allowedFileTypes: ['video/*'],
            headers: { [userStore.user.tokenName]: userStore.user.tokenValue },
            timeout: 60 * 1000, // 60 秒
            // async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
            //     FetchPostFileWithToken("/api/upload/video", file).then(result => {
            //         if (result.flag) {
            //             insertFn(constant.NGINX_SERVER_HOST + "/" + result.data, '', '');
            //         } else if (result.code == constant.NOT_LOGIN_CODE) {
            //             ElMessage.error('登录过期，请重新登录');
            //             userStore.loginFormVisible = true;
            //         } else {
            //             ElMessage({
            //                 message: result.message,
            //                 type: "error"
            //             });
            //         }
            //     })
            // },

            customInsert(result: CommonResult, insertFn: InsertFnType) {  // TS 语法
                if (result.flag) {
                    console.log(result.data);
                    let url = constant.NGINX_SERVER_HOST + "/" + result.data
                    insertFn(url, '', '');
                }
            },
            onSuccess(file: File, res: any) {  // TS 语法
                // onSuccess(file, res) {          // JS 语法
                console.log(`${file.name} 上传成功`, res)
            },
            // 单个文件上传失败
            onFailed(file: File, res: any) {  // TS 语法
                // onFailed(file, res) {          // JS 语法
                console.log(`${file.name} 上传失败`, res)
            },
            onError(file: File, err: any, res: any) {
                let result: CommonResult = JSON.parse(err.request.response)
                if (result.code == constant.NOT_LOGIN_CODE) {
                    ElMessage.error('登录过期，请重新登录');
                    userStore.loginFormVisible = true;
                } else {
                    ElMessage.error('发生意外错误，请稍后重试');
                }
            },
        }
    }
}
onMounted(async () => {

    if (Route.meta.launchForRequest) {
        //获取 求购 元信息
        await FetchGetWithToken("/api/request/" + Route.params.rid).then(data => {
            request.value = data;
            commodity.value.price = request.value!.price;
            commodity.value.quality = request.value!.quality;
            commodity.value.type.tid = request.value!.type.tid;
            commodity.value.type.typePath = data.type.typePath;
        });
    }

    //读取模式（新建或编辑）
    if (Route.meta.edit) {
        let url = Route.meta.request ? "/api/request/" : "/api/commodity/"
        await FetchGetWithToken(url + (Route.meta.request ? Route.params.rid : Route.params.cid)).then(data => {
            if (data.uid != userStore.user.uid && userStore.logged) {
                ElMessage.error("这不是你的商品");
                return;
            }
            commodity.value = data;
            // commodity.value.cid = commodityEditStore.commodity.cid;
            // commodity.value.name = commodityEditStore.commodity.name;
            // commodity.value.price = commodityEditStore.commodity.price;
            // commodity.value.quality = commodityEditStore.commodity.quality;
            // commodity.value.fare = commodityEditStore.commodity.fare;
            // commodity.value.freeShipping = commodityEditStore.commodity.freeShipping;
            // commodity.value.freightCollect = commodityEditStore.commodity.freightCollect;
            // commodity.value.type = commodityEditStore.commodity.type.tid;
            // commodity.value.description = commodityEditStore.commodity.description;
            // commodity.value.cover = commodityEditStore.commodity.cover;
            // commodity.value.tags = commodityEditStore.commodity.tags;
            //设置cover
            coverUrl.value = constant.NGINX_SERVER_HOST + "/" + commodity.value.cover;
            //设置商品描述 富文本
            valueHtml.value = commodity.value.description;
            loadingStore.closeLoading();

        });
    }
    useScrollbarStore().scrollSmoothTo(0);
    loadingStore.closeLoading();


});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}



//商品type
const props = {
    // expandTrigger: 'hover' as const,
    lazy: true,
    lazyLoad(node: Node, resolve: any) {
        let url = "/api/type"
        if (node.level != 0) {
            url += "/" + node.value
        }
        FetchGetWithToken(url).then(data => {
            const nodes = data.map((typeItem: CommodityType) => ({
                value: typeItem.tid,
                label: typeItem.typeName,
                leaf: node.level >= 2 || typeItem.tid == 20,
            })
            );
            resolve(nodes);
        });
    },
}

const typeChange = (value: any) => {
    if (value.length == 3) {
        commodity.value.type.tid = value[2]
    }
}
//提交
const submit = () => {
    //数据校验
    if (commodity.value.name == '') {
        ElMessage.error('请输入商品名');
        return;
    }
    if (commodity.value.quality == 0) {
        ElMessage.error('请输入商品成色');
        return;
    }
    if (commodity.value.price <= 0) {
        ElMessage.error('请输入正确的商品价格');
        return;
    }
    if (commodity.value.cover == '') {
        ElMessage.error('请上传商品的封面图');
        return;
    }
    if (commodity.value.type.tid == 0) {
        ElMessage.error('请选择分类');
        return;
    }
    if (editorRef.value.getText().length < 10) {
        ElMessage.error('请详细介绍一下你的商品 (至少10字)');
        return;
    }
    const loading = ElLoading.service({
        lock: true,
        text: '正在提交，请稍等...',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    commodity.value.description = editorRef.value.getHtml();
    let url = Route.meta.request ? "/api/request" : "/api/commodity";
    let fetchResult;
    let successMessage = "发布成功，即将跳转到商品详情页"
    if (Route.meta.edit) {
        fetchResult = FetchPutWithToken(url, JSON.stringify(commodity.value));
        successMessage = "编辑成功，即将跳转到商品详情页"
    } else {
        fetchResult = FetchPostWithToken(url, JSON.stringify(commodity.value))
    }
    fetchResult.then(result => {
        ElMessage.success(successMessage);
        if (Route.meta.edit) {
            result = commodity.value.cid;
        }
        if (Route.meta.request) {
            router.push({ name: "request", params: { cid: result, t: new Date().getTime().toString() } });
        } else {
            router.push({ name: "commodity", params: { cid: result, t: new Date().getTime().toString() } });
        }
        loading.close();
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = submit;
            captchaStore.nextMethodParam = undefined;
        }
    });

}
</script>
<style scoped>
.launch-content-wrapper {
    height: 45rem;
}

/* .launch-content {} */
.editor-wrapper {
    margin-top: 1rem;
    border: 1px solid var(--el-border-color);
}

.launch-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
}

.res-img {
    height: 100%;
    width: 100%;
}

.img-slot-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.step-wrapper {
    margin-top: 3rem;
}

.postage-info {
    display: flex;
    align-items: center;
}

.postage-info .settlement-method {
    margin-left: 1rem;
}

.postage-info .postage-check {
    margin-left: 1rem;
}

.tag-wrapper {
    margin-left: 5rem;
}

.tag {
    margin-right: .3rem;
    margin-bottom: .3rem;
}

.tag-input {
    width: 5rem;
}

.commodity-info-wrapper {
    font-size: small;
}

.commodity-info-wrapper>span {
    margin-top: .5rem;
}
</style>
<style>
.cover-uploader {
    height: 12rem;
    width: 12rem;
}

.cover-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    height: 100%;
    width: 100%;
}

.cover-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.typeSelecter {
    width: 18rem;
}

.el-cascader-node__label {
    width: 10rem;
}

.editor-scroll,
.editor-toolbar,
.editor-toolbar>div {
    background-color: var(--el-bg-color-overlay) !important;
    color: var(--el-text-color-primary) !important;
}

.w-e-textarea-video-container video {
    width: 100%;
}
</style>
