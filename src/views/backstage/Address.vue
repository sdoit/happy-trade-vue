<template>
    <div>

        <div class="right-wrapper"><el-button type="primary" @click="addAddress">添加新地址</el-button></div>
        <el-card v-for="address in addressList" :key="address.aid" class="card-wrapper">
            <div class="addr-wrapper">
                <el-col :span="15" :offset="1">
                    <div>
                        <el-space wrap :fill="true">
                            <div>
                                <span class="addr-name">{{ address.name }}</span>
                                <el-tag class="tag-default" v-if="address.defaultAddress">默认</el-tag>
                            </div>
                            <div :span="20">
                                <span class="addr-phone">{{ address.phone }}</span>
                            </div>
                        </el-space>
                    </div>
                    <div class="addr-detail-wrapper">
                        <div>
                            <span class="addr-detail">{{
                                address.province + ' ' + address.city + ' ' + address.area + ' ' +
                                    address.street
                                    + ' ' + address.address
                            }} </span>
                        </div>
                    </div>

                </el-col>
                <el-col :span="8" class="button-wrapper">
                    <el-button type="primary" size="small">设为默认</el-button>
                    <el-button type="warning" size="small" @click="toUpdateAddress(address)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteAddress(address.aid)">删除</el-button>
                </el-col>
            </div>
        </el-card>
        <el-result v-if="addressList == undefined || addressList.length == 0" title="没有收货地址"
            sub-title="你还有没收货地址，请先添加一个吧">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <g fill="none" stroke="#888888" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path
                            d="M8 4h10a2 2 0 0 1 2 2v10m-.57 3.399c-.363.37-.87.601-1.43.601H8a2 2 0 0 1-2-2V6m4 10h6" />
                        <path d="M11 11a2 2 0 0 0 2 2m2-2a2 2 0 0 0-2-2M4 8h3m-3 4h3m-3 4h3M3 3l18 18" />
                    </g>
                </svg>
            </template>
            <template #extra>
                <el-button type="primary" @click="addAddress">添加收货地址</el-button>
            </template>
        </el-result>
        <el-dialog v-model="addAddressDialogVisible" :title="dialogEditMode ? '修改收货地址' : '添加收货地址'"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-position="right" v-model="addressAdd">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="姓名：" required> <el-input v-model="addressAdd.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="1">
                        <el-form-item label="手机号码：" required> <el-input v-model="addressAdd.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="省：" required>
                            <el-select placeholder="请选择..." v-model="provinceCode">
                                <el-option v-for="item in provinceList" :label="item.name" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="市：" required>
                            <el-select placeholder="请选择..." v-model="cityCode">
                                <el-option v-for="item in cityList" :label="item.name" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="区：" required>
                            <el-select placeholder="请选择..." v-model="areaCode">
                                <el-option v-for="item in areaList" :label="item.name" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="街道：" required>
                            <el-select v-model="addressAdd.streetCode" placeholder="请选择...">
                                <el-option v-for="item in streetList" :label="item.name" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="详细地址：" required>
                    <el-input v-model="addressAdd.address"></el-input>
                </el-form-item>
                <el-checkbox v-model="addressAdd.defaultAddress">设为默认</el-checkbox>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="add">
                        {{ dialogEditMode?'修改': '添加' }}
                    </el-button>
                    <el-button @click="addAddressDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>
<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { useUserStore, useBidStepStore } from "@/stores"
import { FetchGetWithToken, FetchPostWithToken, FetchDeleteWithToken, FetchPutWithToken } from "@/util/fetchUtil"
import type UserAddress from "@/interface/UserAddress"
import type { Province, City, Area, Street } from "@/interface/Address"
import constant from "@/common/constant";
import { ElLoading, ElMessage } from "element-plus";
import { result } from "lodash";

const addressList = ref<UserAddress[]>([]);
const userStore = useUserStore();
const addAddressDialogVisible = ref(false);
let addressAdd = reactive({
    aid: 0,
    name: '',
    phone: '',
    streetCode: '',
    address: '',
    defaultAddress: false
});
const dialogEditMode = ref(false);
const provinceCode = ref();
const cityCode = ref();
const areaCode = ref();

const provinceList = ref<Province[]>();
const cityList = ref<City[]>();
const areaList = ref<Area[]>();
const streetList = ref<Street[]>();
const fetchUserAddress = () => {
    FetchGetWithToken("/api/userAddress/u/")
        .then(result => {
            if (result.flag) {
                addressList.value = result.data;
            } else if (result.code == constant.NOT_LOGIN_CODE) {
                userStore.loginFormVisible = true;
            }
        });
}

const fetchProvinceList = () => {
    FetchGetWithToken("/api/address")
        .then(result => {
            if (result.flag) {
                provinceList.value = result.data;
            } else if (result.code == constant.NOT_LOGIN_CODE) {
                userStore.loginFormVisible = true;
            }
        });
}
const fetchCityList = (pCode: string) => {
    FetchGetWithToken("/api/address/" + pCode)
        .then(result => {
            if (result.flag) {
                cityList.value = result.data;
            } else if (result.code == constant.NOT_LOGIN_CODE) {
                userStore.loginFormVisible = true;
            }
        });
}
const fetchAreaList = (pCode: string, cCode: string) => {
    FetchGetWithToken("/api/address/" + pCode + "/" + cCode)
        .then(result => {
            if (result.flag) {
                areaList.value = result.data;
            } else if (result.code == constant.NOT_LOGIN_CODE) {
                userStore.loginFormVisible = true;
            }
        });
}
const fetchStreetList = (pCode: string, cCode: string, aCode: string) => {
    FetchGetWithToken("/api/address/" + pCode + "/" + cCode + "/" + aCode)
        .then(result => {
            if (result.flag) {
                streetList.value = result.data;
            } else if (result.code == constant.NOT_LOGIN_CODE) {
                userStore.loginFormVisible = true;
            }
        });
}

const addAddress = () => {
    fetchProvinceList();
    dialogEditMode.value = false;
    addressAdd.aid = 0;
    addressAdd.name = '';
    addressAdd.phone = '';
    addressAdd.streetCode = '';
    addressAdd.address = '';
    addressAdd.defaultAddress = false;
    addAddressDialogVisible.value = true;
}
const add = () => {

    if (addressAdd.name == '') {
        ElMessage({
            message: '请填写姓名',
            type: 'error'
        });

        return;
    }
    if (addressAdd.phone == '') {
        ElMessage({
            message: '请填写手机号码',
            type: 'error'
        });
        return;
    }
    if (addressAdd.streetCode == '') {
        ElMessage({
            message: '请选择地址',
            type: 'error'
        });
        return;
    }
    if (addressAdd.address == '') {
        ElMessage({
            message: '请填写详细地址',
            type: 'error'
        });
        return;
    }
    const loading = ElLoading.service({
        lock: true,
        text: '正在等待服务器响应...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    //保存到数据库
    let fetchResult
    let message = '添加成功';
    if (dialogEditMode.value) {
        fetchResult = FetchPutWithToken('/api/userAddress', JSON.stringify(addressAdd))
        message = "修改成功"
    } else {
        fetchResult = FetchPostWithToken('/api/userAddress', JSON.stringify(addressAdd))
    }
    fetchResult.then(result => {
        if (result.flag) {
            ElMessage({
                message: message,
                type: 'success'
            });
            fetchUserAddress();
            addAddressDialogVisible.value = false;
        } else if (result.code == constant.NOT_LOGIN_CODE) {
            userStore.loginFormVisible = true;
        } else {
            ElMessage({
                message: result.message,
                type: 'error'
            });
        }
        loading.close();
    })
}
const toUpdateAddress = (address: UserAddress) => {
    fetchProvinceList();
    addressAdd.address = address.address;
    addressAdd.defaultAddress = address.defaultAddress;
    addressAdd.name = address.name;
    addressAdd.phone = address.phone;
    addressAdd.address = address.address;
    addressAdd.aid = address.aid;
    dialogEditMode.value = true;
    addAddressDialogVisible.value = true;
}

const deleteAddress = (aid: number) => {
    const loading = ElLoading.service({
        lock: true,
        text: '正在等待服务器响应...',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    FetchDeleteWithToken("/api/userAddress/" + aid).then(result => {
        if (result.flag) {
            ElMessage({
                message: "删除成功",
                type: 'success'
            });
            fetchUserAddress();

        } else if (result.code == constant.NOT_LOGIN_CODE) {
            userStore.loginFormVisible = true;
        } else {
            ElMessage({
                message: result.message,
                type: 'error'
            });
        }
        loading.close();
    })
}


watch(provinceCode, (pCode) => {
    cityCode.value = undefined;
    if (pCode != undefined) {
        fetchCityList(pCode);
    }
});
watch(cityCode, (cCode) => {
    areaCode.value = undefined;
    if (cCode != undefined) {
        fetchAreaList(provinceCode.value, cCode);
    }
});
watch(areaCode, (aCode) => {
    addressAdd.streetCode = ''
    if (aCode != undefined) {
        fetchStreetList(provinceCode.value, cityCode.value, aCode);
    }
});

onMounted(() => {
    fetchUserAddress();
})
</script>
<style scoped>
.right-wrapper {
    display: flex;
    justify-content: flex-end;
}

.name-wrapper {
    display: flex;
}

.name-wrapper>div {
    display: flex;
}

.tag-default {
    margin-left: .5rem;
}

.card-wrapper {
    margin-top: 1rem;
}

.addr-name {
    font-size: large;
    font-weight: 700;
}

.addr-phone {
    font-size: small;
    font-weight: 700;

}

.addr-detail-wrapper {
    margin-top: .5rem;

}

.addr-detail {
    font-size: .9rem;
}

.addr-wrapper {
    display: flex;
    justify-content: space-around;
}

.button-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
}
</style>