<template>
  <div>
    <el-row justify="center">
      <el-col :span="18">
        <div style="display: flex; justify-content: space-between;">
          <span class="tips-recommendations">{{ userStore.logged ? '你可能感兴趣的品类' : '商品分类' }}</span>
          <el-link> <span style="font-size: smaller; font-weight: 500;">查看全部>></span></el-link>
        </div>
        <el-row justify="space-between" class="type-recommendations">
          <el-col :span="4" v-for="typeRecommend in typeRecommends" :key="typeRecommend.tid">
            <RouterLink :to="{ name: 'search-type', params: { typeId: typeRecommend.tid } }">
              <el-image class="type-img"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-image>
              <div class="type-name-wrapper">
                <span class="type-name">{{ typeRecommend.typeName }}</span>
              </div>
            </RouterLink>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row justify="center" class="commodity-recommendations">
      <el-col :span="18">
        <span class="tips-recommendations"> {{ userStore.logged ? '你可能感兴趣的商品' : '最新发布的商品' }}</span>
      </el-col>
    </el-row>
    <el-row justify="center" class="commodity-recommendations">
      <el-col>
        <CommodityList url="/api/commodity" @loadDone="loadDone" />
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import CommodityList from '@/components/CommodityList.vue';
import { useUserStore, useLoadingStore, useCommodityListStore } from '@/stores';
import { FetchGetWithToken } from '@/util/FetchUtil'
import type CommodityType from '@/interface/CommodityType'
const commodityListStore = useCommodityListStore();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const typeRecommends = ref<CommodityType[]>([]);
const fetchTypeRecommend = () => {
  FetchGetWithToken('/api/commodity/type').then(data => {
    typeRecommends.value = data;
  })
}
const loadDone = () => {
  loadingStore.closeLoading();

}
onMounted(() => {
  fetchTypeRecommend();
  commodityListStore.url = '/api/commodity';
})
</script>

<style scoped>
.tips-recommendations {
  font-size: x-large;
  font-weight: 700;

}

.type-name-wrapper {
  margin-top: .5rem;
}

.type-name {
  font-size: small;
  color: gray;
}

.type-img {
  border-radius: 50%;
  height: 15rem;
  width: 15rem;
}

.type-recommendations {
  margin-top: 2rem;

  text-align: center;
}

.commodity-recommendations {
  margin-top: 4rem;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>