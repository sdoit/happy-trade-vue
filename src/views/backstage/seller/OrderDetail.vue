<template>
  <div>
    <div v-if="order != undefined" class="order-wrapper">
      <el-card>
        <div class="commodity-wrapper">
          <div>
            <el-image :src="constant.NGINX_SERVER_HOST + '/' + order.commodity.cover" :fit="'fill'"
              class="cover"></el-image>
          </div>
          <div class="commodity-info-wrapper">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
              <span class="name">{{ order.name }}</span>
              <span class="status" :class="getOrderStatusClass(order)">
                {{ getOrderStatusName(order) }}</span>
            </div>
            <span class="cid">商品编号：{{ order.cid }}</span>
            <span class="time">发布时间：{{ order.commodity.time }}</span>
            <div class="info-bottom">
              <span class="view-count">浏览量：{{ order.commodity.viewCount }}</span>
              <span class="buyer-price">卖家标价：{{ order.commodity.price }}</span>
            </div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="buyer-wrapper">
          <div class="buyer-head">
            <div>
              <el-avatar :src="constant.NGINX_SERVER_HOST + order.user.avatar"></el-avatar>
            </div>
            <div class="buyer-name-wrapper">
              <span class="buyer-name">{{ order.user.nickname }}</span>
              <span class="buyer-username">@{{ order.user.username }}</span>
            </div>
          </div>
          <div>
            <div class="buyer-appraisal">
              <span>{{
                order!.user.ratingCountBuyer == 0
                ? "此用户还没有购买过商品"
                : "作为买家的好评率：" +
                (
                  (order!.user.goodRatingCountBuyer /
                    order!.user.ratingCountBuyer) *
                  100
                ).toFixed(2) +
                "%" +
                "(" +
                order!.user.goodRatingCountBuyer +
                "/" +
                order!.user.ratingCountBuyer +
                ")"
              }}</span>
              <span>{{
                order!.user.ratingCountSeller == 0
                ? "此用户还没有卖出过商品"
                : "作为卖家的好评率：" +
                (
                  (order!.user.goodRatingCountSeller /
                    order!.user.ratingCountSeller) *
                  100
                ).toFixed(2) +
                "%" +
                "(" +
                order!.user.goodRatingCountSeller +
                "/" +
                order!.user.ratingCountSeller +
                ")"
              }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card>
        <div class="addr-card">
          <div class="address-wrapper">
            <div>
              <span class="address-name">{{ order.userAddress.name }}</span>
              <span class="address-phone">{{ order.userAddress.phone }}</span>
            </div>
            <div class="address-detail-wrapper">
              <span class="address">{{
                order.userAddress.province +
                " " +
                order.userAddress.city +
                " " +
                order.userAddress.area +
                " " +
                order.userAddress.street +
                " " +
                order.userAddress.address
              }}</span>
            </div>
          </div>
          <div class="address-ship">
            <span v-if="order.shipId != undefined">运单号：{{ order.shipId }}</span>
            <span v-if="order.shipId != undefined">
              发货时间：{{ order.shipTime }}</span>
          </div>
        </div>
      </el-card>
      <el-card v-if="order.orderRatingToSeller != undefined ||
        order.orderRatingToBuyer != undefined
        ">
        <el-row justify="space-between" v-if="order.orderRatingToBuyer != undefined">
          <el-col :span="12" class="seller-head">
            <div>
              <el-avatar :src="constant.NGINX_SERVER_HOST + userStore.user.avatar"></el-avatar>
            </div>
            <div class="seller-name-wrapper">
              <div>
                <span class="seller-name">{{ userStore.user.nickname }}</span><el-tag type="success"> 我</el-tag>
              </div>
              <span class="seller-username">@{{ userStore.user.username }}</span>
            </div>
          </el-col>
          <el-col :span="7" :offset="3" style="display: flex; flex-direction: column">
            <el-rate v-model="order.orderRatingToBuyer.score" disabled text-color="#ff9900" />
            <span>{{ order.orderRatingToBuyer.comment }}</span>
          </el-col>
        </el-row>
        <el-divider v-if="order.orderRatingToSeller != undefined &&
          order.orderRatingToBuyer != undefined
          " />
        <el-row style="display: flex; justify-content: space-between" v-if="order.orderRatingToSeller != undefined">
          <el-col :span="12" class="seller-head">
            <div>
              <el-avatar :src="constant.NGINX_SERVER_HOST + order.user.avatar"></el-avatar>
            </div>
            <div class="seller-name-wrapper">
              <div>
                <span class="seller-name">{{ order.user.nickname }}</span><el-tag>买家</el-tag>
              </div>
              <span class="seller-username">@{{ order.user.username }}</span>
            </div>
          </el-col>

          <el-col :span="7" :offset="3" style="display: flex; flex-direction: column">
            <el-rate v-model="order.orderRatingToSeller.score" disabled text-color="#ff9900" />
            <span>{{ order.orderRatingToSeller.comment }}</span>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <div class="order-detail-wrapper">
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>订单号</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span>{{ order.oid }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>支付凭证号</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span>{{ order.tradeId }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>下单时间</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span>{{ order.orderTime }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>支付时间</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span>{{ order.payTime }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>支付方式</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span>支付宝</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>支付账户</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span>{{ order.buyerAlipayId }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" :offset="3" class="title">
              <span>支付金额</span>
            </el-col>
            <el-col :span="5" :offset="6" class="content">
              <span class="totalAmount">￥{{ order.totalAmount }}</span>
            </el-col>
          </el-row>

          <div class="order-bottom" v-if="order.status != constant.ORDER_STATUS_REFUNDING">
            <el-button size="small" type="success" @click="toChat">联系买家</el-button>

            <el-popconfirm title="你确定要关闭订单吗?建议与买家商议后再使用本功能" confirm-button-text="确定" cancel-button-text="取消"
              confirm-button-type="danger" cancel-button-type="primary" @confirm="closeOrder" width="20rem">
              <template #reference>
                <el-button size="small" type="danger" v-if="order.shipTime == undefined && order.status == 0">
                  关闭交易</el-button>
              </template>
            </el-popconfirm>

            <el-button size="small" type="primary" @click="toShipping"
              v-if="order.shipTime == undefined && order.status == 0">发货</el-button>
            <el-button size="small" type="warning" v-if="order.status > -1">交易快照</el-button>
            <el-button size="small" type="primary" v-if="order.status == constant.ORDER_STATUS_COMPLETED &&
              order.orderRatingToBuyer == undefined
              " @click="orderRatingVisible = true">评价本次交易</el-button>
          </div>


        </div>
      </el-card>
      <el-card class="order-return" v-if="order.status == constant.ORDER_STATUS_REFUNDING">
        <p>买家申请退货</p>
        <p>退货理由：</p>
        <p style="font-size: medium; color: var(--el-text-color-primary);margin-top: .5rem;">{{ order.orderReturn.reason
        }}</p>
        <div style="margin-top: 1rem;">
          <p>已同意退货</p>
          <p v-if="order.orderReturn.shipId != undefined">回寄运单单号：{{ order.orderReturn.shipId }}</p>
          <p v-else>正在等待买家回寄商品</p>
          <div class="order-bottom">
            <el-button size="small" type="primary" @click="confirmReturn"
              :disabled="order.orderReturn.shipId == undefined">确定退款</el-button>
          </div>
        </div>
        <div class="order-bottom"
          v-if="order.status == constant.ORDER_STATUS_REFUNDING && order.orderReturn.agree == undefined">
          <el-button size="small" type="primary" @click="toAgreeReturn">同意退货</el-button>
          <el-button size="small" type="danger" @click="returnRejctDialogVisible = true">拒绝退货</el-button>
        </div>

      </el-card>
    </div>
    <el-dialog title="运单号填写" v-model="shippingVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :inline="true">
        <el-form-item label="承运公司">
          <el-select v-model="expressId" placeholder="请选择...">
            <el-option v-for="express in expressList" :key="express.id" :label="express.name" :value="express.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="shipId" placeholder="请输入运单号码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="shipping"> 确定发货 </el-button>
          <el-button @click="shippingVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="评价买家" width="40rem" v-model="orderRatingVisible" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row class="rating-buyer">
        <el-col>
          <el-card>
            <div class="buyer-wrapper">
              <div class="buyer-head">
                <div>
                  <el-avatar :src="constant.NGINX_SERVER_HOST + order!.user.avatar"></el-avatar>
                </div>
                <div class="buyer-name-wrapper">
                  <span class="seller-name">{{ order!.user.nickname }}</span>
                  <span class="seller-username">@{{ order!.user.username }}</span>
                </div>
              </div>
              <div>
                <div class="buyer-appraisal">
                  <span>{{
                    order!.user.ratingCountBuyer == 0
                    ? "此用户还没有购买过商品"
                    : "作为买家的好评率：" +
                    (
                      (order!.user.goodRatingCountBuyer /
                        order!.user.ratingCountBuyer) *
                      100
                    ).toFixed(2) +
                    "%" +
                    "(" +
                    order!.user.goodRatingCountBuyer +
                    "/" +
                    order!.user.ratingCountBuyer +
                    ")"
                  }}</span>
                  <span>{{
                    order!.user.ratingCountSeller == 0
                    ? "此用户还没有卖出过商品"
                    : "作为卖家的好评率：" +
                    (
                      (order!.user.goodRatingCountSeller /
                        order!.user.ratingCountSeller) *
                      100
                    ).toFixed(2) +
                    "%" +
                    "(" +
                    order!.user.goodRatingCountSeller +
                    "/" +
                    order!.user.ratingCountSeller +
                    ")"
                  }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-row style="display: flex; align-items: center">
            <el-col :span="5">
              <span>请为买家评分:</span>
            </el-col>
            <el-col :span="12">
              <el-rate v-model="score" size="large" :colors="colors" :texts="[
                    '垃圾!糟糕的体验!',
                    '差评!不好的购物体验',
                    '中评,有一些小问题',
                    '好评!不错的购物体验',
                    '好评!好评!!好评!!!',
                  ]" show-text />
            </el-col>
          </el-row>
          <el-row style="display: flex; align-items: center">
            <el-col :span="5">
              <span>对卖家的评价:</span>
            </el-col>
            <el-col :span="12">
              <el-input v-model="comment" placeholder="请输入你对卖家的评价" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row justify="end" style="margin-top: 1rem">
        <el-col :span="6">
          <el-button type="primary" @click="confirmRating">确定</el-button>
          <el-button @click="orderRatingVisible = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog v-model="returnAgreeDialogVisible" title="同意退货" width="50rem">
      <span style="color: gray">选择货物回寄地址</span>
      <el-scrollbar height="18rem" class="step2-margin-top step2-address-bar" :wrap-class="'step2-address-bar-content'">
        <el-radio-group v-model="index" style="display: flex; justify-content: center">
          <el-radio :label="index" v-for="(address, index) in addressList" :key="address.aid" class="addr-radio">
            <el-card>
              <div class="addr-title">
                <div>
                  <el-tag v-if="address.defaultAddress">默认</el-tag>
                </div>
                <div>
                  <span class="addr-name">{{ address.name }}</span>
                </div>
                <div :span="20" style="align-self: flex-end !important; margin-bottom: 0.2rem">
                  <span class="addr-phone">{{ address.phone }}</span>
                </div>
              </div>
              <div style="margin-top: 0.8rem">
                <div>
                  <span>{{
                    address.province +
                    " " +
                    address.city +
                    " " +
                    address.area +
                    " " +
                    address.street +
                    " " +
                    address.address
                  }}
                  </span>
                </div>
              </div>
            </el-card>
          </el-radio>
          <el-result v-if="addressList == undefined || addressList.length == 0" title="没有收货地址"
            sub-title="你还有没设置收货地址，请先设置收货地址后再下单">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <g fill="none" stroke="#888888" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M8 4h10a2 2 0 0 1 2 2v10m-.57 3.399c-.363.37-.87.601-1.43.601H8a2 2 0 0 1-2-2V6m4 10h6" />
                  <path d="M11 11a2 2 0 0 0 2 2m2-2a2 2 0 0 0-2-2M4 8h3m-3 4h3m-3 4h3M3 3l18 18" />
                </g>
              </svg>
            </template>
            <template #extra>
              <el-button type="primary" @click="goAddress">去设置</el-button>
            </template>
          </el-result>
        </el-radio-group>
      </el-scrollbar>
      <template #footer>
        <el-button type="primary" @click="agreeReturn"
          :disabled="addressList == undefined || addressList.length == 0">确认</el-button>
        <el-button type="danger" @click="returnAgreeDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="returnRejctDialogVisible" title="拒绝退货" width="30rem">
      <div style="margin-bottom: 1rem">
        <span style="color: gray">建议与买家充分交涉后再使用本功能</span>
      </div>
      <el-input v-model="rejectReason" placeholder="请输入拒绝的理由"></el-input>
      <template #footer>
        <el-button type="primary" @click="rejectReturn">确认</el-button>
        <el-button type="danger" @click="returnRejctDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import constant from "@/common/constant";
import router from "@/router";
import { useRoute } from "vue-router";
import {
  FetchGetWithToken,
  FetchPostWithToken,
  FetchPutWithToken,
} from "@/util/FetchUtil";
import type User from "@/interface/User";
import type Order from "@/interface/Order";
import {
  useUserStore,
  usePathStore,
  useLoadingStore,
  useUserMessageStore,
  useCaptchaStore,
} from "@/stores";
import { ElMessage } from "element-plus";
import type UserAddress from "@/interface/UserAddress";

const loadingStore = useLoadingStore();
const userStore = useUserStore();
const route = useRoute();
const pathStore = usePathStore();
const order = ref<Order>();
const userMessageStore = useUserMessageStore();
FetchGetWithToken("/api/order/oid/" + route.params.oid).then((data) => {
  order.value = data;
  loadingStore.closeLoading();
});
const toChat = () => {
  userMessageStore.chatUser = order.value!.user as User;
  userMessageStore.messageList = [];
  userMessageStore.fetchMessage();
  userMessageStore.putVirtuaChatUserToMap(order.value!.user);
  userMessageStore.showMessageDrawer();
};
const shippingVisible = ref(false);
const shipId = ref();
const expressId = ref();
type express = {
  id: string;
  name: string;
};
const expressList = ref<express[]>();

const toShipping = () => {
  FetchGetWithToken("/api/express").then((data) => {
    expressList.value = data;
  });
  shippingVisible.value = true;
};
const shipping = () => {
  if (expressId.value == undefined) {
    ElMessage.error("请选择快递承运公司");
    return;
  }
  if (shipId.value == undefined) {
    ElMessage.error("请输入快递单号");
    return;
  }
  FetchPutWithToken(
    "/api/order/express",
    JSON.stringify({
      oid: order.value?.oid,
      expressId: expressId.value,
      shipId: shipId.value,
    })
  )
    .then((data) => {
      ElMessage.success("发货成功");
      order.value!.shipTime = new Date().toLocaleTimeString();
      order.value!.shipId = shipId.value;
    })
    .catch((e: Error) => {
      if (
        JSON.parse(e.message).code ==
        constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION
      ) {
        // 储存本次操作
        const captchaStore = useCaptchaStore();
        captchaStore.nextMethod = shipping;
        captchaStore.nextMethodParam = undefined;
      }
    });
};
const getOrderStatusName = (order: Order) => {
  switch (order.status) {
    case constant.ORDER_STATUS_CLOSED:
      return "已取消";
    case constant.ORDER_STATUS_NORMAL:
      return order.shipTime ? "等待收货" : "等待发货";
    case constant.ORDER_STATUS_REFUNDED:
      return "已退款";
    case constant.ORDER_STATUS_REFUNDING:
      return "退款中";
    case constant.ORDER_STATUS_COMPLETED:
      return "已完成";
  }
};
const getOrderStatusClass = (order: Order) => {
  switch (order.status) {
    case constant.ORDER_STATUS_CLOSED:
      return "status-closed";
    case constant.ORDER_STATUS_NORMAL:
      return "status-normal";
    case constant.ORDER_STATUS_REFUNDED:
      return "status-refunded";
    case constant.ORDER_STATUS_COMPLETED:
      return "status-refunded";
  }
};

const orderRatingVisible = ref(false);
const score = ref(0);

const comment = ref("");
const colors = ref({ 2: "#99A9BF", 3: "#F7BA2A", 4.5: "#FF9900" });
const confirmRating = () => {
  if (score.value <= 0) {
    ElMessage.error("请填写评分");
    return;
  }
  if (comment.value.length < 5) {
    ElMessage.error("请输入5字以上的评价");
    return;
  }
  FetchPutWithToken(
    "/api/order",
    JSON.stringify({
      oid: order.value!.oid,
      score: score.value,
      comment: comment.value,
    })
  )
    .then((data) => {
      ElMessage.success("确认成功!");
      orderRatingVisible.value = false;
    })
    .catch((e: Error) => {
      if (
        JSON.parse(e.message).code ==
        constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION
      ) {
        // 储存本次操作
        const captchaStore = useCaptchaStore();
        captchaStore.nextMethod = confirmRating;
        captchaStore.nextMethodParam = undefined;
      }
    });
};
const closeOrder = () => {
  FetchPostWithToken("/api/order/close/" + order.value?.oid).then((data) => {
    ElMessage.success("订单已关闭，相关款项已原路返回。");
    order.value!.status = -1;
  });
};
const returnRejctDialogVisible = ref(false);
const rejectReason = ref();
const returnAgreeDialogVisible = ref(false);
const index = ref();
const addressList = ref<UserAddress[]>([]);
const fetchUserAddress = () => {
  FetchGetWithToken("/api/userAddress/u/").then((data) => {
    addressList.value = data;
  });
};
const toAgreeReturn = () => {
  fetchUserAddress();
  returnAgreeDialogVisible.value = true;
};
const rejectReturn = () => {
  FetchPostWithToken(
    "/api/return/reject",
    JSON.stringify({
      oid: order.value?.oid,
      rejectReason: rejectReason.value,
    })
  ).then((data) => {
    ElMessage.success("拒绝退货成功");
  });
};
const agreeReturn = () => {
  FetchPostWithToken(
    "/api/return/agree",
    JSON.stringify({
      oid: order.value?.oid,
      aid: addressList.value[index.value].aid,
    })
  ).then((data) => {
    ElMessage.success("同意退货成功，请留意买家回寄信息");
    returnAgreeDialogVisible.value = false;
  });
};
const goAddress = () => {
  router.push({ name: "home-address" });
};
const confirmReturn = () => {
  FetchPostWithToken("/api/return/complete/" + order.value?.oid).then(data => {
    ElMessage.success("退后成功，相关款项已退回给买家");
    order.value!.status = constant.ORDER_STATUS_REFUNDED;
  })
}
onMounted(() => {
  pathStore.path = [
    { name: "个人中心", path: "/buyer/order" },
    { name: "我的订单", path: "/seller/order" },
    { name: "订单详情", path: "/seller/order/" + order.value?.oid },
  ];
});
</script>
<style scoped>
.order-wrapper>div {
  margin-top: 0.5rem;
}

.commodity-wrapper {
  display: flex;
}

.cover {
  width: 8rem;
}

.commodity-info-wrapper {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  width: 100%;
}

.commodity-info-wrapper span {
  margin-top: 0.8rem;
  font-size: small;
  color: gray;
}

.commodity-info-wrapper .name {
  font-size: larger;
  font-weight: 700;
}

.commodity-info-wrapper .buyer-price {
  font-size: small;
  color: rgb(255, 136, 136);
  font-weight: 700;
}

.commodity-info-wrapper .info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buyer-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buyer-head {
  margin-left: 4rem;
  display: flex;
  align-items: center;
}

.buyer-wrapper .buyer-name-wrapper {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.buyer-name {
  font-size: medium;
  font-weight: 700;
}

.buyer-username {
  font-size: small;
  color: gray;
}

.buyer-appraisal {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.buyer-bottom {
  display: flex;
  margin-top: 0.3rem;
  justify-content: end;
}

.buyer-appraisal {
  font-size: small;
  color: gray;
}

.buyer-appraisal>span {
  margin-bottom: 0.1rem;
}

.seller-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seller-head {
  margin-left: 4rem;
  display: flex;
  align-items: center;
}

.seller-name-wrapper {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.seller-name {
  font-size: medium;
  font-weight: 700;
}

.seller-username {
  font-size: small;
  color: gray;
}

.seller-appraisal {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.addr-card {
  display: flex;
  justify-content: space-around;
}

.address-wrapper {
  display: flex;
  flex-direction: column;
}

.address-name {
  font-size: larger;
  font-weight: 700;
}

.address-phone {
  font-weight: 700;
  margin-left: 1rem;
}

.address-detail-wrapper {
  margin-top: 0.5rem;
  font-size: small;
}

.address-ship {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  font-size: small;
}

.order-detail-wrapper>div {
  margin-top: 0.4rem;
}

.title {
  font-size: small;
  display: flex;
  justify-content: end;
}

.content {
  font-size: small;
}

.totalAmount {
  font-size: medium;
  color: #e1251b;
  font-weight: 700;
}

.order-bottom {
  display: flex;
  justify-content: end;
}

.order-status {
  font-size: small;
}

.status-closed {
  color: gray !important;
}

.status-normal {
  color: #e1251b !important;
}

.status-refunded {
  color: green !important;
}

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
  margin-top: 0.5rem;
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

.addr-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.addr-title>* {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.order-return p {
  font-size: smaller;
  color: gray;
  margin-top: .3rem;
}
</style>
