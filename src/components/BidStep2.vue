<template>
    <div>
        <div class="step2-price-wrapper">
            <div class="step2-price-item">
                <span class="step2-price">￥{{ bidStepStore.commodity.price }}</span>
                <span class="step2-price-tip">卖家标价</span>
            </div>
            <div class="step2-price-item-arrow">
                <div></div>
            </div>
            <div class="step2-price-item">
                <span class="step2-price">￥{{ bidStepStore.commodityBid.price }}</span>
                <span class="step2-price-tip">你的出价</span>
            </div>
        </div>
        <div>

        </div>
        <el-scrollbar height="18rem" class="step2-margin-top step2-address-bar" :wrap-class="'step2-address-bar-content'">
            <el-radio-group v-model="index" class="addr-radio-wrapper">
                <el-radio :label="index" v-for="address, index in addressList" :key="address.aid" class="addr-radio">
                    <el-card>
                        <el-space direction="vertical">
                            <div>
                                <el-space wrap>
                                    <div>
                                        <el-tag v-if="address.defaultAddress">默认</el-tag>
                                    </div>
                                    <div>
                                        <span class="addr-name">{{ address.name }}</span>
                                    </div>
                                    <div :span="20">
                                        <span class="addr-phone">{{ address.phone }}</span>
                                    </div>
                                </el-space>
                            </div>
                            <div>
                                <div>
                                    <span>{{
                                        address.province + ' ' + address.city + ' ' + address.area + ' ' +
                                        address.street
                                        + ' ' + address.address
                                    }} </span>
                                </div>
                            </div>
                        </el-space>

                    </el-card>
                </el-radio>
                <el-result v-if="addressList == undefined || addressList.length == 0" title="没有收货地址"
                    sub-title="你还有没设置收货地址，请先设置收货地址后再下单">
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
                        <el-button type="primary">去设置</el-button>
                    </template>
                </el-result>
            </el-radio-group>

        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import type UserAddress from "@/interface/UserAddress";
import type CommonResult from "@/interface/CommonResult";
import constant from "@/common/constant";
import { FetchGetWithToken, FetchPostWithToken } from "@/util/FetchUtil"
import { useUserStore, useBidStepStore } from "@/stores"
import { ElMessage } from "element-plus";
// const props = defineProps(["commodity", 'bid', 'user']);
// const emits = defineEmits(['checkLogin'])
const userStore = useUserStore();
const bidStepStore = useBidStepStore();

//地址id
const index = ref(0);
const addressList = ref<UserAddress[]>([]);

const fetchUserAddress = () => {
    FetchGetWithToken("/api/userAddress/u/")
        .then(data => {
            addressList.value = data;
        });
}

// const getAddress = () => {
//     return addressList.value[addr.value]
// }
watchEffect(() => {
    bidStepStore.address = addressList.value[index.value];
})

fetchUserAddress();
onMounted(() => {

})
// defineExpose({ getAddress })
</script>

<style>
.addr-radio-wrapper {
    justify-content: center;
    width: 100%;
}

.addr-radio {
    height: 8rem;
    width: 100%;
    margin-right: 0;

}

.addr-radio .el-radio__label {
    width: 100%;
}

.step2-price-wrapper {
    display: flex;
    justify-content: center;
}

.step2-price-item {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.step2-price {
    color: #e1251b;
    font-size: xx-large;
    font-weight: 900;
}

.step2-price-tip {
    margin-top: .5rem;
    color: gray;
}

.step2-price-item-arrow {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.step2-price-item-arrow div {
    width: 100%;
    height: 1px;
    border-top: 1px solid rgb(177, 177, 177);
}

.step2-margin-top {
    margin-top: 1rem;
}

.step2-address-bar {

    display: flex;
    justify-content: center;

}

.step2-address-bar-content {
    width: 80%;
}

.addr-name {
    font-size: large;
    font-weight: 700;
}

.addr-phone {
    font-size: small;
    font-weight: 700;
}
</style>