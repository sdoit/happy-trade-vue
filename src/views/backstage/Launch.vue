<template>
    <div>
        <el-row :justify="'center'">
            <el-col :span="16" class="launch-content-wrapper">
                <div class="launch-content">
                    <div class="step1">

                    </div>
                    <div class="step2">

                    </div>
                    <div class="step3">
                        <el-row class="commodity-info">
                            <el-col :span="4">
                                <el-upload class="avatar-uploader"
                                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                    :show-file-list="false">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </el-col>
                            <el-col :span="20">
                                <el-form :model="commodity" label-position="right" label-width="5rem">
                                    <el-row>
                                        <el-col :span="18">
                                            <el-form-item label="商品名：" required>
                                                <el-input v-model="commodity.name" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="成色：" required>
                                                <el-input-number v-model="commodity.quality" :precision="2" :min='0'
                                                    :max="10" :step="0.01" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="14">
                                            <el-form-item label="价格：" required>
                                                <el-input v-model="commodity.price" type="number">
                                                    <template #prepend>￥</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item>
                                                <el-checkbox v-model="commodity.freeShipping" label="包邮" size="large" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="邮费：" :required="!commodity.freeShipping">
                                                <el-input v-model="commodity.price" type="number"
                                                    :disabled="commodity.freeShipping">
                                                    <template #prepend>￥</template>
                                                </el-input>
                                            </el-form-item>
                                            <el-switch v-model="value5" class="ml-2" inline-prompt
                                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                                active-text="完整展示多个内容" inactive-text="多个内容" />
</template>
</el-col>

</el-row>

</el-form>
<div class="tag-wrapper">
    <el-tag v-for="tag in dynamicTags" :key="tag" class="tag" closable :disable-transitions="false"
        @close="handleClose(tag)" :type="randomTagType()">
        {{ tag }}
    </el-tag>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="tag-input" size="small"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
        + 新标签
    </el-button>
</div>
</el-col>
</el-row>


<div class="editor-wrapper">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <el-scrollbar height="500px">
        <Editor style="overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="handleCreated" />
    </el-scrollbar>
</div>
</div>
</div>
</el-col>
</el-row>
<el-row class="launch-wrapper" :justify="'center'">
    <el-col :span="8">
        <el-steps :active="1">
            <el-step title="交易形式" description="选择你的闲置物品的处理方式" :icon="Edit" />
            <el-step title="交易方式" description="设置你与买家之间的交易方式" :icon="Upload" />
            <el-step title="商品信息" description="填写商品的信息" :icon="Picture" />
        </el-steps>
    </el-col>
</el-row>
</div>


</template>
<script lang="ts" setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Edit, Picture, Upload } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useUserStore } from '@/stores'
import '@wangeditor/editor/dist/css/style.css';
import type CommonResult from '@/interface/CommonResult';
import constant from '@/common/constant';
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, ElInput } from 'element-plus'
import type Commodity from '@/interface/Commodity';
const userStore = useUserStore();
const commodity = ref({
    name: '',
    price: 0,
    quality: 0,
    freeShipping: false
});
const imageUrl = ref('');


const inputValue = ref('')
const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}
const tagType = ['', 'success', 'info', 'danger', 'warning'];
const randomTagType = () => {
    return tagType[Math.floor((Math.random() * tagType.length))]
}








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
    placeholder: '请输入内容...',
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
        }
    }
}
onMounted(() => {
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

</script>
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.launch-content-wrapper {
    height: 45rem;
}

/* .launch-content {} */
.editor-wrapper {
    margin-top: 1rem;
    border: 1px solid var(--el-border-color);
}

.commodity-info {}



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

:deep(h5, .h5) {
    font-size: 14px !important;
}

:deep(h4,
    .h4) {
    font-size: 16px !important;
    font-weight: bold !important;
}

:deep(h3,
    .h3) {
    font-size: 18px !important;
    font-weight: bold !important;
}

:deep(h2,
    .h2) {
    font-size: 20px !important;
    font-weight: bold !important;
}

:deep(h1,
    .h1) {
    font-size: 22px !important;
    font-weight: bold !important;
}

:deep(i) {
    font-style: italic !important;
}

:deep(.italic) {
    font-style: italic !important;
}

:deep(.bold, strong) {
    font-weight: bold !important;
}

:deep(.italic strong) {
    font-weight: bold !important;
    font-style: italic !important;
}

:deep(.w-e-toolbar .w-e-menu i) {
    font-style: normal !important;
}

:deep(ol) {
    list-style-type: decimal !important;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>