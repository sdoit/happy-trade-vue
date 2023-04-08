<template>
    <div class="user-info">
        <el-card class="user-card">
            <div>
                <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                    :on-change="onChange" :auto-upload="false">
                    <el-avatar :src="constant.NGINX_SERVER_HOST + '/' + userStore.user.avatar" size="large"></el-avatar>
                </el-upload>
                <el-row class="user-item">
                    <el-col :span="4" class="user-item-title">
                        <span>用户ID:</span>
                    </el-col>
                    <el-col :span="18">
                        <span>{{ userStore.user.uid }}</span>
                    </el-col>
                </el-row>
                <el-row class="user-item">
                    <el-col :span="4" class="user-item-title">
                        <span>用户名：</span>
                    </el-col>
                    <el-col :span="18">
                        <span>{{ userStore.user.username }}</span>
                    </el-col>
                </el-row>
                <el-row class="user-item">
                    <el-col :span="4" class="user-item-title">
                        <span>昵称：</span>
                    </el-col>
                    <el-col :span="18">
                        <el-input v-model="editUserInfo.nickname" />
                    </el-col>
                </el-row>

                <el-row class="user-item">
                    <el-col :span="4" class="user-item-title">
                        <span>电话号码：</span>
                    </el-col>
                    <el-col :span="4" class="user-item-title">
                        <span>{{ editUserInfo.phone }}</span>
                    </el-col>
                    <el-col :span="4">
                        <el-link type="primary" @click="updatePhoneVisible = true">修改手机号码</el-link>
                    </el-col>
                    <!-- <el-col :span="4">
                        <el-button type="primary">发送验证码</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-row>
                            <el-col :span="8" class="user-item-title">
                                <span>验证码：</span>
                            </el-col>
                            <el-col :span="16">
                                <el-input v-model="editUserInfo.phone" />
                            </el-col>
                        </el-row>
                    </el-col> -->
                </el-row>

                <el-row class="user-item">
                    <el-col :span="4" class="user-item-title">
                        <span>密码：</span>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="danger" @click="changePasswordDialogVisible = true">修改密码</el-button>
                    </el-col>
                </el-row>


                <el-row class="user-item">
                    <el-col :span="4" class="user-item-title">
                        <span>个人介绍：</span>
                    </el-col>
                    <el-col :span="18">
                        <el-input v-model="editUserInfo.introduction" type="textarea" autosize show-word-limit :rows="5"
                            maxlength="200" />
                    </el-col>
                </el-row>
            </div>
            <div style="margin-top: 1rem;">
                <el-button type="primary" @click="updateUserInfo">保存</el-button>
            </div>
        </el-card>
        <el-dialog title="修改密码" v-model="changePasswordDialogVisible" width="30rem">
            <el-row class="user-item">
                <el-col :span="4" class="user-item-title">
                    <span>旧密码：</span>
                </el-col>
                <el-col :span="18">
                    <el-input show-password v-model="editUserInfo.oldPassword" placeholder="请输入旧密码"></el-input>
                </el-col>
            </el-row>
            <el-row class="user-item">
                <el-col :span="4" class="user-item-title">
                    <span>新密码：</span>
                </el-col>
                <el-col :span="18">
                    <el-input show-password v-model="editUserInfo.password" placeholder="请输入新密码"></el-input>
                </el-col>
            </el-row>
            <el-row class="user-item">
                <el-col :span="4" class="user-item-title">
                    <span>重复新密码：</span>
                </el-col>
                <el-col :span="18">
                    <el-input show-password v-model="editUserInfo.repassword" placeholder="请再次输入新密码"></el-input>
                </el-col>
            </el-row>
            <template #footer>
                <el-button type="success" @click="updatePassword">修改密码</el-button>
                <el-button type="primary" @click="changePasswordDialogVisible = false">取消</el-button>
            </template>
        </el-dialog>
        <el-dialog title="修改手机号码" v-model="updatePhoneVisible" width="30rem">
            <el-row>
                <el-col :span="7" class="user-item-title">
                    <span>请输入新号码</span>
                </el-col>
                <el-col :span="15">
                    <el-input v-model="editUserInfo.newPhone"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 2rem;">
                <el-col :span="7" class="user-item-title">
                    <span>请输入验证码</span>
                </el-col>
                <el-col :span="9">
                    <el-input v-model="editUserInfo.validationCode"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" style="width: 100%;" @click="sendCode" :disabled="disabledSendCodeButton">{{
                        disabledSendCodeButton ? countdown + '秒后重试' : '发送验证码' }}>发送验证码</el-button>
                </el-col>
            </el-row>
            <template #footer>
                <el-button type="primary" @click="updatePhone">提交</el-button>
                <el-button type="danger" @click="updatePhoneVisible = false">取消</el-button>
            </template>
        </el-dialog>
        <el-dialog title="上传头像" v-model="uploadAvatarVisible" width="30rem">
            <Cropper ref="cropper" class="cropper" :src="tempPicUrl" :stencil-props="{
                aspectRatio: 1 / 1
            }" @change="change" />
            <template #footer>
                <el-button type="primary" @click="updateAvatar">提交</el-button>
                <el-button type="danger" @click="uploadAvatarVisible = false">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { useCaptchaStore, useLoadingStore, useUserStore } from '@/stores';
import constant from '@/common/constant';
import type CommonResult from '@/interface/CommonResult'
import { FetchPostFileWithToken, FetchPutWithToken, FetchPostWithToken } from '@/util/FetchUtil';
import { ElMessage, type UploadFile } from 'element-plus';
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
const loadingStore = useLoadingStore();
const captchaStore = useCaptchaStore();
const userStore = useUserStore();
const changePasswordDialogVisible = ref(false);
const editUserInfo = ref({
    ...userStore.user,
    code: null,
    repassword: null,
    oldPassword: null,
    validationCode: null,
    newPhone: null
});
const updateUserInfo = () => {
    FetchPutWithToken("/api/user/update", JSON.stringify(editUserInfo.value)).then(data => {
        ElMessage.success("修改成功");
        userStore.checkLogin();
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            captchaStore.nextMethod = updateUserInfo;
            captchaStore.nextMethodParam = undefined;
        }
    })
}
const updatePassword = () => {
    if (editUserInfo.value.oldPassword == "") {
        ElMessage.error("请输入旧密码");
        return;
    } else if (editUserInfo.value.password == "") {
        ElMessage.error("请输入新密码");
        return;
    } else if (editUserInfo.value.repassword == "") {
        ElMessage.error("请输入重复密码");
        return;
    } else if (editUserInfo.value.repassword != editUserInfo.value.repassword) {
        ElMessage.error("两次新密码不一致，请重新输入");
        return;
    }
    FetchPutWithToken("/api/user/update/password", JSON.stringify(editUserInfo.value)).then(data => {
        ElMessage.success("修改成功，请重新登录");
        //强制重新登录
        userStore.logout();
        userStore.loginFormVisible = true;
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            captchaStore.nextMethod = updatePassword;
            captchaStore.nextMethodParam = undefined;
        }
    })
}
const handleAvatarSuccess = (response: CommonResult) => {
    if (response.flag) {
        FetchPutWithToken("/api/user/update/avatar", JSON.stringify(editUserInfo.value)).then(data => {
            ElMessage.success("修改成功，请重新登录");
            userStore.checkLogin();
        })
    } else if (response.code == constant.NOT_LOGIN_CODE) {
        ElMessage.error('登录过期，请重新登录');
        userStore.loginFormVisible = true;
    } else {
        ElMessage({
            message: response.message + "(" + response.code + ")",
            type: "error"
        });
    }


}
const cropper = ref();
const uploadAvatarVisible = ref(false);
const tempPicUrl = ref()
const onChange = (uploadFile: UploadFile) => {
    uploadAvatarVisible.value = true;
    tempPicUrl.value = URL.createObjectURL(uploadFile.raw as Blob);
    console.log(tempPicUrl.value);
}
const beforeAvatarUpload = (rawFile: any) => {
    if (rawFile.type.slice(0, 6) !== 'image/') {
        ElMessage.error('必须上传图片类型文件!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('图片不能大于5MB!')
        return false
    }
    return true
}
const change = ({ coordinates, canvas }: any) => {
    console.log(coordinates, canvas)
}
const updateAvatar = () => {
    const { canvas } = cropper.value.getResult();
    if (canvas) {
        canvas.toBlob((blob: File) => {
            FetchPostFileWithToken("/api/upload/image", blob).then(data => {
                editUserInfo.value.avatar = data
                FetchPutWithToken("/api/user/update/avatar", JSON.stringify(editUserInfo.value)).then(data => {
                    uploadAvatarVisible.value = false;
                    ElMessage.success("修改成功");
                    userStore.checkLogin()
                });
            })
        }, 'image/jpeg');
    } else {
        ElMessage.error("发生错误")
    }

}
const countdown = ref(constant.SEND_CODE_Interval)
const disabledSendCodeButton = ref(false);
const sendCode = () => {
    if (editUserInfo.value.newPhone == null || editUserInfo.value.newPhone == '') {
        ElMessage.error("请输入新手机号码");
        return;
    } else if (!/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(editUserInfo.value.newPhone)) {
        ElMessage.error("手机号码格式不正确");
        return;
    }
    FetchPostWithToken("/api/user/code/" + editUserInfo.value.newPhone).then(data => {
        ElMessage.success("验证码发送成功！");
        //禁用按钮，并进入倒计时
        disabledSendCodeButton.value = true;
        let timer = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--;
            } else {
                disabledSendCodeButton.value = false;
                clearInterval(timer);
            }
        }, 1000);
    })
}


const updatePhoneVisible = ref(false);
const updatePhone = () => {
    FetchPutWithToken("/api/user/update/phone", JSON.stringify(editUserInfo.value)).then(data => {
        updatePhoneVisible.value = false;
        ElMessage.success("修改成功");
        userStore.checkLogin()
    });
}
onMounted(() => {
    loadingStore.closeLoading();
})
</script>
  
<style scoped>
.user-item {
    margin-top: 1rem;
    font-size: smaller;

}

.user-item-title {
    display: flex;
    align-items: center;


}

.cropper {
    height: 30rem;
    width: 30rem;
}
</style>
  