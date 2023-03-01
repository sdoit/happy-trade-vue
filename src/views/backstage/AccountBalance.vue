<template>
    <div class="wrapper">
        <el-row class="amount-tips-wrapper">
            <el-col :span="5" class="left"><span>账户余额</span></el-col>
            <el-col :span="10" :offset="4"><span>冻结金额</span></el-col>
        </el-row>
        <el-row class="amount-wrapper">
            <el-col :span="5" class="left"><span class="amount-effectiv">￥{{
                userAmount?.amountEffective
            }}</span></el-col>
            <el-col :span="10" :offset="4"><span class="amount-frozen">￥{{ userAmount?.amountFrozen }}</span></el-col>
        </el-row>
        <el-row class="button-wrapper">
            <el-col :span="8">
                <el-input v-model="withdrawalAmount" type="number" placeholder="输入你要提现的金额">
                    <template #prepend>￥</template>
                </el-input>
            </el-col>
            <el-col :span="6" :offset="1">
                <el-button type="primary" @click="withdrawal">提现</el-button>
            </el-col>
        </el-row>
        <div class="timeline-wrapper">
            <el-timeline>
                <el-timeline-item v-for="amountLog in userAmountLogs" :key="amountLog.id"
                    :timestamp="amountLog.time + ' ID:' + amountLog.sourceId" :color="amountLog.plus ? 'red' : 'green'">
                    <el-row>
                        <el-col :span="3">
                            <span style="font-weight: 700;"> {{ amountLog.plus ? '+' : '-' }} ￥{{ amountLog.amount }}
                            </span>
                        </el-col>
                        <el-col :span="8">
                            {{ amountLog.plus ? amountLog.effective ? '卖出商品，完成订单' : '买家购买商品，订单暂未完成' : '用户提现' }}
                        </el-col>
                    </el-row>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type UserAmount from '@/interface/UserAmount'
import type UserAmountLog from '@/interface/UserAmountLog'
import { FetchGetWithToken, FetchPostWithToken } from '@/util/FetchUtil';
import constant from '@/common/constant';
import { ElMessage } from 'element-plus';
import { useUserStore, useLoadingStore,useCaptchaStore } from '@/stores';
const loadingStore = useLoadingStore();
const userStore = useUserStore();
const userAmountLogs = ref<UserAmountLog[]>();
const userAmount = ref<UserAmount>();
const fetchUserAmountAndLog = () => {
    FetchGetWithToken("/api/amount").then(data => {
        userAmount.value = data;
        //获取收支日志
        FetchGetWithToken("/api/amount/log").then(data => {
            userAmountLogs.value = data;
        });

        loadingStore.clodeLoading();

    });
}
const withdrawalAmount = ref<number>(10);
const withdrawal = () => {
    if (withdrawalAmount.value < 10) {
        ElMessage.error("最少提现金额为 ￥10")
        return;
    }
    FetchPostWithToken("/api/withdrawal", JSON.stringify({
        amount: withdrawalAmount.value
    })).then(data => {
        ElMessage.success("提现申请已发起，请关注到账提示");
        fetchUserAmountAndLog();

    }).catch((e: Error) => {
        if (e.message = constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION.toString()) {
          // 储存本次操作
          const captchaStore = useCaptchaStore();
          captchaStore.nextMethod = withdrawal;
          captchaStore.nextMethodParam=undefined;
        }
      });
}
onMounted(() => {
    fetchUserAmountAndLog();
})
</script>

<style scoped>
.wrapper {
    margin-left: 10%;
}

.left {
    display: flex;
    justify-content: flex-start;

}

.left-tip {
    padding-right: 1rem;
}

.amount-tips-wrapper {
    font-size: small;
    color: gray;
}

.amount-wrapper {
    margin-top: 2rem;
}

.amount-effectiv {
    font-size: xx-large;
    color: #e4393c;
    font-weight: 700;
}

.amount-frozen {
    font-size: xx-large;
    color: gray;
    font-weight: 700;
}

.button-wrapper {
    margin-top: 4rem;
}

.timeline-wrapper {
    margin-top: 5rem;
}
</style>