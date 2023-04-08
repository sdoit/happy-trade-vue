<template>
    <div>
        <el-affix :offset="100" style="margin-bottom: 5rem;" v-if="$route.meta.snapshot">
            <div style=" display: flex; justify-content: center;">
                <el-alert title="商品快照" type="warning" description="本页面提供订单创建时的商品描述，买卖双方发生交易争执时，本页面作为判断依据。" :closable="false"
                    show-icon style="width: 50%;" />
            </div>
        </el-affix>
        <el-result v-if="resultVisible" title="商品已售出" sub-title="来晚了，去看看其他商品把">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                    <path fill="#888888"
                        d="M704 288h131.072a32 32 0 0 1 31.808 28.8L886.4 512h-64.384l-16-160H704v96a32 32 0 1 1-64 0v-96H384v96a32 32 0 0 1-64 0v-96H217.92l-51.2 512H512v64H131.328a32 32 0 0 1-31.808-35.2l57.6-576a32 32 0 0 1 31.808-28.8H320v-22.336C320 154.688 405.504 64 512 64s192 90.688 192 201.664v22.4zm-64 0v-22.336C640 189.248 582.272 128 512 128c-70.272 0-128 61.248-128 137.664v22.4h256zm201.408 476.16a32 32 0 1 1 45.248 45.184l-128 128a32 32 0 0 1-45.248 0l-128-128a32 32 0 1 1 45.248-45.248L704 837.504V608a32 32 0 1 1 64 0v229.504l73.408-73.408z" />
                </svg>
            </template>
            <template #extra>
                <el-button type="primary">回到首页</el-button>
            </template>
        </el-result>
        <div v-if="contentVisible">
            <el-row justify="center">
                <el-col :span="16">
                    <el-row>
                        <el-col :span="7">
                            <el-image ref="Anchor" loading="lazy" :src="constant.NGINX_SERVER_HOST + '/' + object?.cover"
                                :fit="'fill'" class="res-img">
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
                        </el-col>
                        <el-col :span="15" :offset="2">

                            <el-row>
                                <el-col>
                                    <span class="name"> <span style="color: #e4393c; font-size: large;">{{
                                        $route.meta.request ? '[求购] ' : '' }} </span> {{ object?.name }} </span>
                                </el-col>
                            </el-row>
                            <el-row justify="space-between" class="tips">
                                <el-col :span="12">
                                    <el-row justify="start">
                                        <el-col>
                                            <span class="commodity-type">{{ object?.type.typeName }}</span>
                                            <span class="quality">{{ Math.round(object?.quality! * 10) }}新</span>
                                            <span class="free-shipping">{{ object?.freeShipping ? '包邮' : '' }}</span>
                                        </el-col>


                                    </el-row>
                                    <el-row justify="start">
                                        <el-col>
                                            <el-tag v-for="tag in object?.tags" :key="tag.tid" :type="getTagType(tag)"
                                                class="commodity-tag">{{ tag.tag }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="5" class="right-wrapper"><span class="view-count">{{
                                    object?.viewCount == 0 ?
                                    '您是本' + ($route.meta.request ? '求购' : '商品') + '的第1个看客' : object?.viewCount + '人浏览过'
                                }}</span></el-col>
                            </el-row>

                            <el-row class="price-wrapper" justify="space-between">
                                <el-col :span="8">
                                    <span style="color: #e4393c;">{{ $route.meta.request ? '[预计价格] ' : '' }} ￥</span><span
                                        class="price">{{ object?.price }} </span>
                                    <span style="color: #e4393c; font-size: small;padding-left: .7rem;"
                                        v-if="!object?.freeShipping && !$route.meta.request">邮费：￥ {{ object?.fare }}</span>
                                </el-col>
                                <el-col :span="5" class="right-wrapper">
                                    <span @click="collect" style="cursor: pointer;">
                                        <svg v-if="!object!.favorite" t="1677921226870" class="icon" viewBox="0 0 1024 1024"
                                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3212" width="24"
                                            height="24">
                                            <path
                                                d="M1010.522034 378.125967c-2.697435-7.186679-9.568936-11.9471-17.244756-11.9471l-317.167616-0.024559L531.542078 29.566386c-2.907213-6.767124-9.56382-11.149944-16.924461-11.149944-0.021489 0-0.042979 0-0.064468 0-7.386224 0.025583-14.042831 4.461615-16.910135 11.269671L355.918175 366.154307l-319.960219 0.024559c-7.66354 0-14.524808 4.746094-17.231453 11.915377-2.706645 7.169283-0.690732 15.264659 5.061272 20.329001l264.485767 232.853325-87.217411 311.044152c-2.061962 7.354502 0.62831 15.21861 6.764054 19.768229 6.135744 4.548596 14.44192 4.840238 20.881586 0.730641l285.916868-182.503591 285.915845 182.503591c3.027963 1.933025 6.471388 2.892887 9.909697 2.892887 3.796466 0 7.584746-1.171686 10.799974-3.497661 6.124488-4.431939 8.919137-12.156878 7.04751-19.481703l-43.378973-169.779801c-0.10847-0.425695-0.233314-0.848321-0.37146-1.264806-7.653307-22.956851-15.889899-63.611783-9.262968-77.967746 4.264117-9.235338 0.233314-20.179598-9.004071-24.443715-9.239432-4.264117-20.180622-0.233314-24.443715 9.004071-7.04137 15.252379-7.662517 37.273928-1.899256 67.321268 3.518127 18.34788 8.340969 33.67189 9.441023 37.062104l31.686676 124.018571L524.528338 742.937696c-6.043646-3.857864-13.776771-3.857864-19.820418 0L249.554706 905.804041l77.314877-275.729855c1.910513-6.814196-0.251733-14.121626-5.563716-18.797112L84.751243 403.013797l283.396465-0.021489c7.40976 0 14.097066-4.441149 16.97358-11.269671L514.783393 83.893712l132.266419 307.947628c2.90619 6.765077 9.56075 11.149944 16.923438 11.149944l280.237519 0.021489L711.389166 606.468558c-7.659447 6.693446-8.443299 18.329461-1.74883 25.989931 6.693446 7.659447 18.331507 8.442276 25.989931 1.74883l269.766027-235.739049C1011.175927 393.417231 1013.219469 385.311623 1010.522034 378.125967z"
                                                fill="#FF9000" p-id="3213"></path>
                                        </svg>
                                        <svg v-else t="1677921569185" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="3525" width="24" height="24">
                                            <path
                                                d="M1006.942208 391.708672c-2.10944-5.599232-7.458816-9.310208-13.459456-9.310208L672.516096 382.398464 526.367744 42.118144c-2.251776-5.26336-7.45472-8.675328-13.205504-8.675328-0.021504 0-0.043008 0-0.043008 0-5.772288 0-10.975232 3.45088-13.2096 8.762368L356.626432 382.399488 32.821248 382.399488c-5.983232 0-11.355136 3.709952-13.459456 9.271296-2.10944 5.604352-0.54784 11.91936 3.959808 15.880192L290.67264 642.930688l-88.240128 314.625024c-1.600512 5.72928 0.504832 11.880448 5.28896 15.418368 4.780032 3.53792 11.246592 3.791872 16.303104 0.590848l289.137664-184.52992 289.133568 184.52992c2.359296 1.514496 5.056512 2.230272 7.7312 2.230272 2.989056 0 5.961728-0.927744 8.489984-2.7392 4.780032-3.493888 6.928384-9.560064 5.413888-15.29344l-84.93568-319.50848L1002.939392 407.59296C1007.468544 403.633152 1009.047552 397.313024 1006.942208 391.708672z"
                                                fill="#FF9000" p-id="3526"></path>
                                        </svg>
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="seller-wrapper">
                                <el-col>
                                    <el-card class="box-card">
                                        <el-row justify="space-between" class="seller-item">
                                            <el-col :span="17">
                                                <el-row class="seller-item">
                                                    <el-col :span="4">
                                                        <el-avatar :size="70"
                                                            :src="constant.NGINX_SERVER_HOST + object?.user.avatar" />
                                                    </el-col>
                                                    <el-col :span="20">
                                                        <el-row>
                                                            <el-col class="seller-item-text-wrapper seller-item"><span
                                                                    class="seller-nickname">{{
                                                                        object?.user.nickname
                                                                    }}</span></el-col>
                                                            <el-col class="seller-item-text-wrapper seller-item"><span
                                                                    class="seller-username">@{{
                                                                        object?.user.username
                                                                    }}</span></el-col>
                                                        </el-row>
                                                        <el-row class="introduction-wrapper">
                                                            <el-col
                                                                class="seller-item-text-wrapper seller-item introduction"><span>{{
                                                                    object?.user.introduction
                                                                }}</span></el-col>
                                                        </el-row>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                            <el-col :span="6" :offset="1">
                                                <el-row class="seller-item">
                                                    <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                                        <span class="seller-record">{{
                                                            object!.user.ratingCountBuyer == 0 ? '此用户还没有购买过商品' :
                                                            '作为买家的好评率：' +
                                                            (object!.user.goodRatingCountBuyer
                                                                / object!.user.ratingCountBuyer * 100).toFixed(2)
                                                            + '%' + '(' + object?.user.goodRatingCountBuyer
                                                            + '/' + object?.user.ratingCountBuyer + ')' }}</span>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="seller-item">
                                                    <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                                        <span class="seller-record">{{ object!.user.ratingCountSeller ==
                                                            0
                                                            ? '此用户还没有卖出过商品' : '作为卖家的好评率：' +
                                                            (object!.user.goodRatingCountSeller
                                                                / object!.user.ratingCountSeller * 100).toFixed(2)
                                                            + '%' + '(' + object?.user.goodRatingCountSeller + '/' +
                                                            object?.user.ratingCountSeller + ')' }}</span>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <el-row class="button-wrapper" justify="end">
                                <el-col :span="3">
                                    <el-popconfirm title="你确定不通过出价购买，而用卖家标价直接购买本商品吗?" confirm-button-text="继续购买"
                                        cancel-button-text="我要出价" confirm-button-type="danger" cancel-button-type="primary"
                                        @confirm="goOrder" @cancel="toBidView" width="20rem">
                                        <template #reference>
                                            <el-button type="danger" v-if="!$route.meta.request"
                                                :disabled="($route.meta.snapshot as boolean)">{{
                                                    (!$route.meta.request && commodity?.requestId == undefined) ? '直接购买' :
                                                    '确认购买' }} </el-button>
                                        </template>
                                    </el-popconfirm>

                                </el-col>
                                <el-col :span="3">
                                    <el-button type="success" @click="toChat"
                                        :disabled="($route.meta.snapshot as boolean)">{{ $route.meta.request ? '联系TA' :
                                            '联系卖家'
                                        }}

                                    </el-button>
                                </el-col>
                                <el-col :span="(!$route.meta.request && commodity!.requestId == undefined) ? 2 : 3.5">
                                    <el-button type="primary" @click="toBidView"
                                        :disabled="($route.meta.snapshot as boolean)">{{ $route.meta.request ? '我有货' :
                                            commodity!.requestId == undefined ? '出价' : '查看其他商品'
                                        }}</el-button>
                                </el-col>

                            </el-row>
                        </el-col>



                    </el-row>
                    <el-divider class="divider">{{ $route.meta.request ? "求购详情" : "商品详情" }}</el-divider>
                    <el-row>
                        <el-col>
                            <el-card shadow="always">
                                <Editor v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
                                    @onCreated="handleCreated" class="editor" />
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-divider content-position="left" class="divider">{{ $route.meta.request ? "商品出售" :
                        commodity?.requestId == undefined ? "出价历史" : '本求购的其他商品' }}</el-divider>
                    <el-row>
                        <el-col v-if="!$route.meta.request && commodity?.requestId == undefined">
                            <el-timeline>
                                <el-timeline-item v-for="bid in bids"
                                    :type="bid.replySeller ? (bid.agree ? statusTimeLine.agree.type : statusTimeLine.reject.type) : statusTimeLine.unanswered.type"
                                    :hollow="bid.replySeller ? (bid.agree ? statusTimeLine.agree.hollow : statusTimeLine.reject.hollow) : statusTimeLine.unanswered.hollow"
                                    :size="'large'" :timestamp="bid.timeCreated" placement="top">
                                    <el-card>
                                        <div class="bid-wrapper">
                                            <div :span="4" style="display: flex; align-items: center;">
                                                <el-avatar :size="50"
                                                    :src="constant.NGINX_SERVER_HOST + bid.buyer.avatar" />
                                                <div style="margin-left:.5rem;">
                                                    <div class="quotation-swapper">
                                                        <div><span class="quotation-username"> {{
                                                            bid.buyer.nickname
                                                        }}</span>
                                                            <el-tag style="margin-left: .2rem;"
                                                                v-if="userStore.logged && bid.buyer.uid == userStore.user.uid">我</el-tag>
                                                        </div>
                                                    </div>
                                                    <div class="quotation-swapper">
                                                        <div><span style="color: #e4393c;">￥</span><span
                                                                class="quotation-price">{{ bid.price }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="message-wrapper">
                                                <el-alert class="quotation-message" :title="bid.messageBuyer" type="success"
                                                    :closable="false" />
                                            </div>
                                        </div>
                                        <div v-if="bid.agree != undefined" class="reply-wrapper">
                                            <div class="diversio-wire-wrapper">
                                                <div class="diversio-wire"></div>
                                            </div>
                                            <div class="quotation-padding"><el-avatar :size="50"
                                                    :src="constant.NGINX_SERVER_HOST + object?.user.avatar" /></div>
                                            <div class="quotation-padding seller-nickname-wrapper">
                                                <div class="nickname-wrapper">
                                                    <div>
                                                        <span class="quotation-username">{{
                                                            object?.user.nickname
                                                        }}</span><el-tag class="seller-tag">卖家</el-tag>
                                                    </div>
                                                </div>
                                                <div class="nickname-wrapper">
                                                    <div><span
                                                            :class="bid.agree ? 'seller-responese-agree' : 'seller-responese-reject'">{{
                                                                bid.agree ? "卖家同意了此报价" : "卖家拒绝了此报价"
                                                            }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="message-wrapper quotation-padding">
                                                <el-alert class="quotation-message" :title="bid.replySeller"
                                                    :type="bid.agree ? 'success' : 'error'" :closable="false" />
                                            </div>
                                        </div>
                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>
                            <el-result v-if="bids == undefined || bids == null || bids.length == 0"
                                :title="$route.meta.request ? '没有商品' : '没有出价'"
                                :sub-title="$route.meta.request ? '这个用户的求购还没有商品出售' : '还没有用户出价，期待你成为第一个出价人'">
                                <template #icon>
                                    <svg t="1677403050548" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="21247" width="200" height="200">
                                        <path
                                            d="M972.798816 522.111021A319.9994 319.9994 0 0 0 575.99956 1023.99808H52.288542A51.903903 51.903903 0 0 1 0.00064 971.902178V282.49547c0-28.799946 23.039957-52.095902 52.287902-52.095902h868.222372c28.863946 0 52.287902 22.911957 52.287902 52.095902v239.615551zM307.200064 382.783282c28.287947 0 51.199904-22.783957 51.199904-50.751905a51.007904 51.007904 0 0 0-51.199904-50.751904c-28.287947 0-51.199904 22.719957-51.199904 50.751904 0 27.967948 22.911957 50.751905 51.199904 50.751905z m358.399328 0c28.287947 0 51.199904-22.783957 51.199904-50.751905a51.007904 51.007904 0 0 0-51.199904-50.751904c-28.287947 0-51.199904 22.719957-51.199904 50.751904 0 27.967948 22.911957 50.751905 51.199904 50.751905zM767.9992 1023.99808a255.99952 255.99952 0 1 1 0-511.99904 255.99952 255.99952 0 0 1 0 511.99904z m106.6878-248.703534c11.775978 0 21.31196-9.599982 21.31196-21.439959a21.43996 21.43996 0 0 0-21.31196-21.50396h-55.167897l55.039897-55.679896a21.631959 21.631959 0 0 0 0-30.399943 21.24796 21.24796 0 0 0-30.079943 0l-78.271854 78.975852-78.207853-78.975852a21.24796 21.24796 0 0 0-30.207943 0 21.631959 21.631959 0 0 0 0 30.463943l55.167896 55.615896h-51.583903a21.43996 21.43996 0 0 0-21.37596 21.50396c0 11.839978 9.599982 21.43996 21.37596 21.439959h85.31184v43.00792h-85.37584a21.37596 21.37596 0 0 0-21.31196 21.503959c0 11.903978 9.599982 21.56796 21.31196 21.56796h85.37584v50.175906c0 11.903978 9.535982 21.50396 21.31196 21.50396 11.775978 0 21.37596-9.599982 21.37596-21.50396v-50.175906h85.31184c11.775978 0 21.31196-9.599982 21.31196-21.56796a21.37596 21.37596 0 0 0-21.31196-21.503959h-85.31184v-43.00792h85.31184z"
                                            fill="#515151" p-id="21248"></path>
                                        <path
                                            d="M691.199344 255.99952v-51.199904a204.863616 204.863616 0 0 0-409.599232 0V255.99952h51.199904v-50.879905A153.343712 153.343712 0 0 1 486.399728 51.199904C571.199569 51.199904 639.99944 120.319774 639.99944 205.119615V255.99952h51.199904z"
                                            fill="#515151" p-id="21249"></path>
                                    </svg>
                                </template>
                                <template #extra>
                                    <el-button type="primary" size="large" @click="goBid"
                                        :disabled="($route.meta.snapshot as boolean)">我要出价</el-button>
                                </template>
                            </el-result>
                        </el-col>
                        <el-col v-else>
                            <el-card :body-style="{ padding: '.3rem' }" v-for="commodityForRequest in commoditiesForRequest"
                                :key="commodityForRequest.cid" shadow="hover" class="card">
                                <el-row class="commodity-card">
                                    <el-col :span="5" class="img-wrapper" @click="toCommodity(commodityForRequest.cid)">
                                        <el-image loading="lazy" :src="
                                            constant.NGINX_SERVER_HOST + '/' + commodityForRequest.cover
                                        " :fit="'fill'" class="cover">
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
                                    </el-col>
                                    <el-col :span="17" class="commodity-info-wrapper">
                                        <div class="name-wrapper">
                                            <span class="name"><span style="color: #e4393c;">{{ commodity?.cid ==
                                                commodityForRequest.cid ? '[当前商品] ' : '' }}</span>
                                                {{ commodityForRequest.name }}</span>
                                            <el-tag class="quality" :type="getQualityClass(commodityForRequest.quality)">{{
                                                commodityForRequest.quality
                                            }}新</el-tag>

                                            <el-tag class="status"
                                                :type="commodityForRequest.sold ? 'danger' : commodityForRequest.launched ? 'success' : 'warning'">{{
                                                    commodityForRequest.sold ? '已售出' : commodityForRequest.launched ? '上架中' :
                                                    '已下架'
                                                }}</el-tag>
                                        </div>
                                        <div class="priceAndQualityWrapper">
                                            <span class="price">{{ "￥ " + commodityForRequest.price }}</span>
                                        </div>
                                        <div class="info">
                                            <span>商品编号：{{ commodityForRequest.cid }}</span>
                                            <span>类型：{{ commodityForRequest.type.typeName }}</span>
                                            <span class="view-count" v-show="commodityForRequest.viewCount > 0">{{
                                                commodityForRequest.viewCount
                                            }}人看过</span>
                                        </div>
                                        <div class="bottom-wrapper">
                                            <div class="bottom">
                                                <time class="launch-time">{{ commodityForRequest.time }}</time>
                                                <div class="commodity-button">
                                                    <el-button type="primary" size="small" v-if="!commodityForRequest.sold"
                                                        :disabled="commodityForRequest.bidCount == '0'"
                                                        @click="toCommodity(commodityForRequest.cid)">查看详情</el-button>
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>

                            </el-card>


                            <el-result
                                v-if="commoditiesForRequest == undefined || commoditiesForRequest == null || commoditiesForRequest.length == 0"
                                title="没有其他商品" sub-title="本求购没有其他商品投递了，先看看这个商品或者再等等">
                                <template #icon>
                                    <svg t="1677403050548" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="21247" width="200" height="200">
                                        <path
                                            d="M972.798816 522.111021A319.9994 319.9994 0 0 0 575.99956 1023.99808H52.288542A51.903903 51.903903 0 0 1 0.00064 971.902178V282.49547c0-28.799946 23.039957-52.095902 52.287902-52.095902h868.222372c28.863946 0 52.287902 22.911957 52.287902 52.095902v239.615551zM307.200064 382.783282c28.287947 0 51.199904-22.783957 51.199904-50.751905a51.007904 51.007904 0 0 0-51.199904-50.751904c-28.287947 0-51.199904 22.719957-51.199904 50.751904 0 27.967948 22.911957 50.751905 51.199904 50.751905z m358.399328 0c28.287947 0 51.199904-22.783957 51.199904-50.751905a51.007904 51.007904 0 0 0-51.199904-50.751904c-28.287947 0-51.199904 22.719957-51.199904 50.751904 0 27.967948 22.911957 50.751905 51.199904 50.751905zM767.9992 1023.99808a255.99952 255.99952 0 1 1 0-511.99904 255.99952 255.99952 0 0 1 0 511.99904z m106.6878-248.703534c11.775978 0 21.31196-9.599982 21.31196-21.439959a21.43996 21.43996 0 0 0-21.31196-21.50396h-55.167897l55.039897-55.679896a21.631959 21.631959 0 0 0 0-30.399943 21.24796 21.24796 0 0 0-30.079943 0l-78.271854 78.975852-78.207853-78.975852a21.24796 21.24796 0 0 0-30.207943 0 21.631959 21.631959 0 0 0 0 30.463943l55.167896 55.615896h-51.583903a21.43996 21.43996 0 0 0-21.37596 21.50396c0 11.839978 9.599982 21.43996 21.37596 21.439959h85.31184v43.00792h-85.37584a21.37596 21.37596 0 0 0-21.31196 21.503959c0 11.903978 9.599982 21.56796 21.31196 21.56796h85.37584v50.175906c0 11.903978 9.535982 21.50396 21.31196 21.50396 11.775978 0 21.37596-9.599982 21.37596-21.50396v-50.175906h85.31184c11.775978 0 21.31196-9.599982 21.31196-21.56796a21.37596 21.37596 0 0 0-21.31196-21.503959h-85.31184v-43.00792h85.31184z"
                                            fill="#515151" p-id="21248"></path>
                                        <path
                                            d="M691.199344 255.99952v-51.199904a204.863616 204.863616 0 0 0-409.599232 0V255.99952h51.199904v-50.879905A153.343712 153.343712 0 0 1 486.399728 51.199904C571.199569 51.199904 639.99944 120.319774 639.99944 205.119615V255.99952h51.199904z"
                                            fill="#515151" p-id="21249"></path>
                                    </svg>
                                </template>
                                <template #extra>
                                    <el-button type="primary" size="large" @click="goLaunch"
                                        :disabled="($route.meta.snapshot as boolean)">我要出售</el-button>
                                </template>
                            </el-result>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="right-wrapper" v-if="!$route.meta.request">
                            <el-button v-if="bids != undefined && bids != null && bids.length > 0" type="primary"
                                size="large" @click="goBid" :disabled="($route.meta.snapshot as boolean)">我要出价</el-button>
                        </el-col>
                        <el-col class="right-wrapper" v-else style="margin-top: 1rem;">
                            <el-button
                                v-if="commoditiesForRequest != undefined && commoditiesForRequest != null && commoditiesForRequest.length != 0"
                                type="primary" size="large" @click="goLaunch"
                                :disabled="($route.meta.snapshot as boolean)">我要出售</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>



            <el-dialog v-model="bidFormVisible" title="出价" :width="'60%'" :close-on-click-modal="false"
                :close-on-press-escape="false">
                <div class="bid-dialog-wrapper">
                    <el-steps direction="vertical" :active="step" class="steps" finish-status="success">
                        <el-step class="step" title="基本信息" description="填写报价和留言" />
                        <el-step class="step" title="选择收货地址" description="选择正确的收货地址，一旦报价被卖家接受，则会按照此收货地址自动创建订单" />
                        <el-step class="step" title="付款" description="付款后24小时内不可撤销" />
                    </el-steps>
                    <div>
                        <div class="step-content-wrapper">
                            <Transition enter-from-class="fade-enter-from" enter-active-class="fade-enter-active"
                                leave-active-class="fade-leave-active" leave-to-class="fade-leave-to">
                                <component :is="stepComponents[step]" :ref="setStepComponent"></component>
                            </Transition>
                        </div>
                        <el-button-group class="margin-top2 right-wrapper">
                            <el-button type="primary" :icon="ArrowLeft" :disabled="step == 0"
                                @click="stepLast">上一步</el-button>


                            <el-button :type="nextType" @click="stepNext" :disabled="goPayAlready">
                                {{ nextStep }}
                                <el-icon class="el-icon--right">
                                    <ArrowRight />
                                </el-icon>
                            </el-button>
                        </el-button-group>
                    </div>

                </div>
            </el-dialog>
            <!-- 订单dialog -->
            <el-dialog v-model="orderFormVisible" title="直接购买" width="50rem" :close-on-click-modal="false"
                :close-on-press-escape="false">
                <div class="order-wrapper">
                    <div>
                        <el-space wrap>
                            <el-image :src="constant.NGINX_SERVER_HOST + '/' + object?.cover"
                                style="width: 2rem; height: 2rem"></el-image>
                            <span class="order-commodity-name">{{ object?.name }}</span>
                        </el-space>
                    </div>

                    <div>
                        <el-card>
                            <el-row justify="space-between" class="seller-item">
                                <el-col :span="10">
                                    <el-row class="seller-item">
                                        <el-col :span="6">
                                            <el-avatar :size="40" :src="constant.NGINX_SERVER_HOST + object?.user.avatar" />
                                        </el-col>
                                        <el-col :span="18">
                                            <el-row>
                                                <el-col class="seller-item-text-wrapper seller-item"><span
                                                        class="seller-nickname">{{
                                                            object?.user.nickname
                                                        }}</span></el-col>
                                                <el-col class="seller-item-text-wrapper seller-item"><span
                                                        class="seller-username">@{{
                                                            object?.user.username
                                                        }}</span></el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row class="seller-item">
                                        <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                            <span class="seller-record">{{
                                                object!.user.ratingCountBuyer == 0 ? '此用户还没有购买过商品' :
                                                '作为买家的好评率：' +
                                                (object!.user.goodRatingCountBuyer
                                                    / object!.user.ratingCountBuyer * 100).toFixed(2)
                                                + '%' + '(' + object?.user.goodRatingCountBuyer
                                                + '/' + object?.user.ratingCountBuyer + ')' }}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="seller-item">
                                        <el-col class="right-wrapper seller-item-text-wrapper seller-item">
                                            <span class="seller-record">{{ object!.user.ratingCountBuyer == 0
                                                ? '此用户还没有卖出过商品' : '作为卖家的好评率：' +
                                                (object!.user.goodRatingCountSeller
                                                    / object!.user.ratingCountSeller * 100).toFixed(2)
                                                + '%' + '(' + object?.user.goodRatingCountSeller + '/' +
                                                object?.user.ratingCountSeller + ')' }}</span>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-card>
                    </div>
                    <div>
                        <el-result v-if="addressDeafult == undefined" title="没有收货地址" sub-title="你还有没设置收货地址，请先设置收货地址后再下单">
                            <template #icon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <g fill="none" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2">
                                        <path
                                            d="M8 4h10a2 2 0 0 1 2 2v10m-.57 3.399c-.363.37-.87.601-1.43.601H8a2 2 0 0 1-2-2V6m4 10h6" />
                                        <path d="M11 11a2 2 0 0 0 2 2m2-2a2 2 0 0 0-2-2M4 8h3m-3 4h3m-3 4h3M3 3l18 18" />
                                    </g>
                                </svg>
                            </template>
                            <template #extra>
                                <el-button type="primary" @click="toAddressSetting">去设置</el-button>
                            </template>
                        </el-result>
                        <el-card class="addr-view" v-if="addressDeafult != undefined">
                            <el-space direction="vertical" :fill="true">
                                <div>
                                    <el-space wrap>
                                        <div>
                                            <el-tag>默认</el-tag>
                                        </div>
                                        <div>
                                            <span class="addr-name">{{ addressDeafult?.name }}</span>
                                        </div>
                                        <div :span="20">
                                            <span class="addr-phone">{{ addressDeafult?.phone }}</span>
                                        </div>
                                    </el-space>
                                </div>
                                <div>
                                    <div>
                                        <span>{{
                                            addressDeafult?.province + ' ' + addressDeafult?.city + ' ' +
                                            addressDeafult?.area + ' ' +
                                            addressDeafult?.street
                                            + ' ' + addressDeafult?.address
                                        }} </span>
                                    </div>
                                </div>

                            </el-space>
                            <div class="right-wrapper">
                                <el-button type="info" :size="'small'" link>更改收货地址</el-button>
                            </div>
                        </el-card>
                    </div>
                    <div class="right-wrapper">
                        <span class="order-price-seller">￥{{ object?.price }}</span>
                    </div>
                    <div class="right-wrapper">
                        <el-button :type="nextType" @click="directGoPay" :disabled="goPayAlreadyOrder">
                            立即支付
                        </el-button>
                    </div>
                </div>

            </el-dialog>



            <br />
            <br />


        </div>

    </div>
</template>
<script setup lang="ts">
import { Star, ArrowLeft } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import constant from '@/common/constant';
import { useRoute } from 'vue-router';
import type Commodity from '@/interface/Commodity';
import type { Bid, CommodityBid } from '@/interface/CommodityBid';
import type User from "@/interface/User";
import type UserAddress from "@/interface/UserAddress";
import type Tag from '@/interface/Tag';
import type CommonResult from '@/interface/CommonResult';
import type Request from '@/interface/Request';
import { ref, onMounted, nextTick, shallowRef, onBeforeUnmount, watchEffect } from 'vue';
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import BidStep1 from "@/components/BidStep1.vue";
import BidStep2 from "@/components/BidStep2.vue";
import BidStep3 from "@/components/BidStep3.vue";
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore, useBidStepStore, useLoadingStore, useUserMessageStore, useCaptchaStore, usePayStore, useScrollbarStore } from '@/stores'
import { FetchGetWithToken, FetchPostWithToken, FetchGetWithTokenRaw } from '@/util/FetchUtil';
import '@wangeditor/editor/dist/css/style.css'
import '@/assets/css/wang.css'
import router from '@/router';
const Anchor = ref();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const userMessageStore = useUserMessageStore();
const contentVisible = ref(false);
//result组件
const resultVisible = ref(false);
const Route = useRoute();
const object = ref<Commodity | Request>();
const commodity = ref<Commodity>();
const request = ref<Request>();
//用户关于本求购出的商品
const commoditiesForRequest = ref<Commodity[]>();



const fetchCommodity = (cid?: string) => {
    let realCid = cid == undefined ? Route.params.cid : cid;
    let url = Route.meta.request ? "/api/request/" + Route.params.id : "/api/commodity/" + realCid;
    if (Route.meta.snapshot) {
        url = "/api/commodity/snapshot/" + Route.params.ssid;
    }
    FetchGetWithToken(url)
        .then(data => {
            if (data == null || (Route.meta.request && data.rid == undefined) || (!Route.meta.request && data.cid == undefined)) {
                router.push({ path: "/404" });
            }
            if (Route.meta.request) {
                request.value = data;
                object.value = request.value;
                contentVisible.value = true;
                valueHtml.value = request.value!.description;
                //获取本求购的商品
                fetchCommodityByRequest(request.value!.rid as string);
                loadingStore.closeLoading();
                return;
            }
            if (data.sold && !Route.meta.snapshot) {
                //商品已售出
                resultVisible.value = true;
                console.log("商品已售出");
                loadingStore.closeLoading();
                return;
            }
            contentVisible.value = true
            commodity.value = data;
            object.value = commodity.value;
            //设置商品描述 富文本
            valueHtml.value = object.value?.description;

            if (commodity.value?.requestId != undefined) {
                //通过求购发布的商品，获取本求购的其他商品
                fetchCommodityByRequest(commodity.value!.requestId as string);
            } else {
                fetchCommodityBid(object.value!.cid as string);;
            }
            loadingStore.closeLoading();
        }).catch((e: Error) => {
            let result: CommonResult = JSON.parse(e.message);
            if (!result.flag) {
                router.push({ name: "404" });
                loadingStore.closeLoading();
            }
        })
}
fetchCommodity();
const toCommodity = (cid: string) => {
    router.go
    router.push({ name: "commodity", params: { cid: cid } }).then(() => {
        fetchCommodity(cid);
        emits("goTop");
    });

}

const bids = ref<Bid[]>([]);
const fetchCommodityBid = (cid: string) => {

    FetchGetWithToken("/api/bid/commodity/" + cid)
        .then(data => {
            if (data == null) {
                return;
            }
            if (data.bids != undefined && data.bids.length > 0) {
                bids.value = data.bids;
            }
        });
}
//获取本求购下的所有商品
const fetchCommodityByRequest = (rid: string) => {
    FetchGetWithToken("/api/request/commodity/" + rid)
        .then(data => {
            if (data == null) {
                return;
            }
            commoditiesForRequest.value = data;
        });
}

const collect = () => {
    let json = Route.meta.request ? { rid: request.value?.rid } : { cid: commodity.value?.cid }
    let url = Route.meta.request ? "/api/request/favorites" : "/api/favorites"
    FetchPostWithToken(url, JSON.stringify(json)).then(result => {
        ElMessage({
            message: result ? "收藏成功" : "已取消收藏",
            type: result ? 'success' : 'warning'
        });
        //点亮图标
        object.value!.favorite = result as boolean;
    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = collect;
            captchaStore.nextMethodParam = undefined;
        }
    });
}



const tagType = ['' as EpPropMergeType<StringConstructor, '', unknown>,
'success' as EpPropMergeType<StringConstructor, 'success', unknown>,
'info' as EpPropMergeType<StringConstructor, 'info', unknown>,
'danger' as EpPropMergeType<StringConstructor, 'danger', unknown>,
'warning' as EpPropMergeType<StringConstructor, 'warning', unknown>];
const getTagType = (tag: Tag) => {
    let typeIndex = Number.parseInt(tag.tid) % tagType.length;
    return tagType[typeIndex];
}


const statusTimeLine = {
    unanswered: {
        hollow: true,
        type: 'info' as EpPropMergeType<StringConstructor, 'info', unknown>
    },
    agree: {
        hollow: false,
        type: 'success' as EpPropMergeType<StringConstructor, 'success', unknown>
    },
    reject: {
        hollow: false,
        type: 'danger' as EpPropMergeType<StringConstructor, 'danger', unknown>
    }

}
//wangeditor设置  
const editorRef = shallowRef()
const valueHtml = ref();
const editorConfig = { readOnly: true, scroll: false }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const mode = "default"

/**联系卖家 */
const toChat = () => {
    userMessageStore.chatUser = object.value?.user as User
    userMessageStore.messageList = [];
    userMessageStore.fetchMessage();
    userMessageStore.putVirtuaChatUserToMap(object.value!.user);
    userMessageStore.showMessageDrawer();
}
// const messageList = shallowRef<UserMessage[]>([]);
// const chatMessage = ref();
// const chatDrawerVisible = ref(false);
// const messageWrapper = ref();
// const messageScrollbar = ref();


//发送消息

/**
 * 直接购买===================
 */
const orderFormVisible = ref(false);
const goPayAlreadyOrder = ref(false);
const addressDeafult = ref<UserAddress>()
const goOrder = () => {
    userStore.checkLogin().then(result => {
        if (result) {
            if (userStore.user.uid == commodity.value!.uid) {
                ElMessage.error("你不能购买自己的商品");
                return;
            }
            openOrderDialog();
        } else {
            ElMessage.error('登录过期，请重新登录');
            userStore.loginFormVisible = true;
        }
    });
}
const openOrderDialog = () => {
    FetchGetWithToken("/api/order/" + commodity.value?.cid).then(data => {
        if (!data) {
            FetchGetWithToken("/api/userAddress/u/default/")
                .then(data => {
                    addressDeafult.value = data;
                    orderFormVisible.value = true;
                });
        } else {
            ElMessage({
                message: "你已经存在一个对本商品的报价，请先取消出价再购买",
                type: "error"
            });
        }
    })
}

const directGoPay = () => {
    if (addressDeafult.value == undefined) {
        ElMessage({
            message: "没有收货地址，请先设置一个",
            type: 'error',
        });
        return;
    }

    loading = ElLoading.service({
        lock: true,
        text: '正在等待支付结果...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    FetchPostWithToken("/api/order", JSON.stringify({
        "cid": commodity.value?.cid,
        "aid": addressDeafult.value?.aid,
    })).then((data) => {
        FetchGetWithTokenRaw(data)
            .then((response) => response.text())
            .then((form) => {
                let divForm = document.getElementsByTagName('divform')
                if (divForm.length) {
                    document.body.removeChild(divForm[0])
                }
                const div = document.createElement('divform')
                div.innerHTML = form
                document.body.appendChild(div)
                let alipay_form = document.getElementsByName('punchout_form')[0] as HTMLFormElement;
                alipay_form.setAttribute('target', '_blank');
                alipay_form.submit();
            }).catch((err) => {
                console.log(err);
            });

        //开始等待支付结果
        waitingPayResult("order");

    }).catch((e: Error) => {
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = directGoPay;
            captchaStore.nextMethodParam = undefined;
        }else{
            loading.close();
        }
    });

}

//为这个求购发布商品
const goLaunch = async () => {
    if (! await userStore.checkLogin()) {
        userStore.loginFormVisible = true;
        return;
    }
    if (userStore.user.uid == request.value!.uid) {
        ElMessage.error("你不能自己为自己的求购发布商品")
        return;
    }
    router.push({ name: "launch-for-request", params: { rid: request.value!.rid } });
}












/**
 * 出价============================
 */
const bidStepStore = useBidStepStore();
const toBidView = () => {
    emits("toBidView");
}

const bidFormVisible = ref(false);
const step = ref(0);
// 是否已跳转到支付
const goPayAlready = ref(false)
// 下一步按钮显示的文本的样式
const nextType = ref<EpPropMergeType<StringConstructor, "" | "default" | "info" | "success" | "danger" | "primary" | "text" | "warning", unknown>>('primary');
const pimaryType = ref<EpPropMergeType<StringConstructor, "" | "default" | "info" | "success" | "danger" | "primary" | "text" | "warning", unknown>>('primary');
const successType = ref<EpPropMergeType<StringConstructor, "" | "default" | "info" | "success" | "danger" | "primary" | "text" | "warning", unknown>>('success');
const nextStep = ref("下一步");
const stepComponents = shallowRef([BidStep1, BidStep2, BidStep3]);;


const emits = defineEmits(['toBidView', 'loadDone', 'goTop']);

//步骤组件对象
const stepComponent = ref();
//动态组件获取方法
const setStepComponent = (el: any) => {
    stepComponent.value = el;
}




const openBid = () => {
    bidFormVisible.value = true;
    bidStepStore.commodity = object.value as Commodity;
    bidStepStore.seller = object.value!.user;
}
const stepLast = () => {
    if (step.value > 0) {
        step.value -= 1;
    }
    nextStep.value = "下一步";
    nextType.value = "primary"
}
const stepNext = () => {
    switch (step.value) {
        case 0:
            if (bidStepStore.commodityBid.price == undefined) {
                ElMessage({
                    message: "请填写你要出的价格",
                    type: 'error'
                });
                return;
            }
            if (bidStepStore.commodityBid.messageBuyer == undefined) {
                ElMessage({
                    message: "请填写你对卖家的留言，以便卖家同意你的报价",
                    type: 'error'
                });
                return;
            }
            step.value += 1;
            break;
        case 1:
            if (bidStepStore.address == undefined) {
                ElMessage({
                    message: "没有收货地址，请选择或创建一个",
                    type: 'error'
                });
                return;
            }
            step.value += 1;
            nextType.value = successType.value;
            nextStep.value = "去支付";
            break;
        case 2:
            goPayAlready.value = true;
            goPay();
            break;
        default:
            break;
    }
}
let loading: any = null;
const goBid = () => {
    if (userStore.user.uid == commodity.value!.uid) {
        ElMessage.error("你不能购买自己的商品");
        return;
    }
    loading = ElLoading.service({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    FetchGetWithToken("/api/bid/" + commodity.value?.cid).then(data => {
        if (!data) {
            //如果没有对这个商品的出价，就去弹出Bid Dialog 同时检查是否登录
            userStore.checkLogin().then(data => {
                openBid();
                loading.close();
            });

        } else {
            loading.close();
            ElMessage({
                message: '你已经对本商品出了一个价了',
                type: 'error',
            });
            loading.close();

        }

    });




}
const goPay = async () => {
    loading = ElLoading.service({
        lock: true,
        text: '正在等待支付结果...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    FetchPostWithToken("/api/bid", JSON.stringify({
        "cid": commodity.value?.cid,
        "messageBuyer": bidStepStore.commodityBid.messageBuyer,
        "price": bidStepStore.commodityBid.price,
        "aid": bidStepStore.address.aid
    })).then((data) => {
        FetchGetWithTokenRaw(data)
            .then((response) => response.text())
            .then((form) => {
                let divForm = document.getElementsByTagName('divform')
                if (divForm.length) {
                    document.body.removeChild(divForm[0])
                }
                const div = document.createElement('divform')
                div.innerHTML = form
                document.body.appendChild(div)
                let alipay_form = document.getElementsByName('punchout_form')[0] as HTMLFormElement;
                alipay_form.setAttribute('target', '_blank');
                alipay_form.submit();
            }).catch((err) => {
                console.log(err);
            });

        //开始等待支付结果
        waitingPayResult("bid");

    }).catch((e: Error) => {
        loading.close();
        if (JSON.parse(e.message).code == constant.THIS_OPERATION_NEEDS_FURTHER_VERIFICATION) {
            // 储存本次操作
            const captchaStore = useCaptchaStore();
            captchaStore.nextMethod = goPay;
            captchaStore.nextMethodParam = undefined;
        }else{
            loading.close();
        }
    });
}
const paySuccessCallBack = (type: string, url?: string) => {
    const message = {
        "bid": "支付成功，请耐心等待卖家的回复",
        "order": "支付成功，请等待卖家发货"
    }
    bidFormVisible.value = false;
    orderFormVisible.value = false;
    loading.close();
    ElMessage({
        message: type == "bid" ? message.bid : message.order,
        type: 'success',
    });
    if (type == "bid") {
        fetchCommodityBid(commodity.value?.cid!);
    } else {
        //跳转到订单详情
        router.push({ path: url as string });
    }
}
const payTimeOutCallBack = (type: string) => {
    const message = {
        "bid": "支付成功，请耐心等待卖家的回复",
        "order": "支付成功，请等待卖家发货"
    }
    bidFormVisible.value = false;
    orderFormVisible.value = false;
    ElMessageBox.confirm(
        '你是否完成了支付？',
        '未收到您的支付结果',
        {
            confirmButtonText: '已完成支付',
            cancelButtonText: '未完成支付',
            type: 'warning',
            center: true,
            showClose: false,
            closeOnPressEscape: false,
            closeOnClickModal: false,
        }
    ).then(() => {
        //查询支付结果
        loading = ElLoading.service({
            lock: true,
            text: '正在查询支付结果...',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        FetchGetWithToken("/api/" + type + "/" + commodity.value?.cid).then(data => {
            if (data) {
                ElMessage({
                    message: type == "bid" ? message.bid : message.order,
                    type: 'success',
                });
                if (type == "bid") {
                    fetchCommodityBid(commodity.value?.cid!);
                } else {
                    //跳转到订单详情
                    console.log("跳转到订单详情")
                }
                loading.close();
            } else {
                ElMessage({
                    message: '未查询到你的支付记录',
                    type: 'error',
                });
            }
            loading.close();
        });

    })
    loading.close();
}
const waitingPayResult = (type: string) => {
    const payStore = usePayStore();
    payStore.paySuccessCallBack = paySuccessCallBack;
    payStore.payTimeOutCallBack = payTimeOutCallBack;
}

const toAddressSetting = () => {
    router.push({ name: 'home-address' });
}

const getQualityClass = (quality: number) => {
    if (quality >= 9.5) {
        return 'success' as EpPropMergeType<StringConstructor, "success", unknown>;

    } else if (quality >= 8) {
        return "warning" as EpPropMergeType<StringConstructor, "warning", unknown>;

    } else if (quality >= 7) {

        return "info" as EpPropMergeType<StringConstructor, "info", unknown>;
    } else if (quality < 7) {
        return "danger" as EpPropMergeType<StringConstructor, "danger", unknown>;
    }

}
watchEffect(() => {
    if (Anchor.value) {
        console.log(Anchor.value);
        emits("loadDone", Anchor.value);
    }
})

</script>

<style scoped>
.imgs {
    height: 25rem;
}

.res-img {
    height: 100%;
}

.name {
    font-size: xx-large;
}

.commodity-tag {
    margin-right: .3rem;
    margin-top: 1rem;
}

.tips {
    margin-top: 1rem;
}

.tips .quality {
    color: darkgreen;
    font-weight: 700;
    font-size: large;
    margin-left: 1rem;
}

.tips .free-shipping {
    color: darkblue;
    font-weight: 700;
    font-size: large;
    margin-left: 1rem;
}

.tips .view-count {
    color: gray;
    font-size: small;
}

.tips .commodity-type {
    font-size: smaller;
    color: gray;
}

.price-wrapper {
    margin-top: 2rem;
}

.price {
    font-size: xx-large;
    color: #e4393c;
    font-weight: 900;
}

.right-wrapper {
    display: flex;
    justify-content: end;
    align-items: center;
}

.seller-wrapper {
    margin-top: 3rem;
}

.seller-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.seller-item-text-wrapper {
    height: 1rem;
}

.seller-wrapper .seller-nickname {
    font-size: medium;
    font-weight: 600;
}

.seller-wrapper .seller-username {
    font-size: x-small;
}

.introduction-wrapper {
    margin-top: .5rem;
}

.introduction {
    font-size: xx-small;
}

.seller-record {
    font-size: xx-small;
    color: firebrick;
}

.button-wrapper {
    margin-top: 2rem;
}

.divider {
    margin-top: 10rem;
    margin-bottom: 3rem;
}

.image-wrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}

.image-wrapper .el-image {
    width: 80%;
}

.description-text {
    font-size: x-large;
    line-height: 2.5rem;
}


.quotation-swapper {
    height: 1.5rem;
    align-items: center;
}

.nickname-wrapper {
    margin-left: .5rem;
}



.quotation-username:hover {
    color: coral;
}

.quotation-price {
    font-size: larger;
    color: #e4393c;
    font-weight: 700;
}

.quotation-padding {
    padding-top: 2rem;
}

.seller-nickname-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.quotation-message {
    height: 100%;
}

.seller-tag {
    margin-left: .3rem;
}


.diversio-wire {
    height: 67%;
    width: 75%;
    border-radius: var(--el-border-radius-small);
    border-left: 1px solid darkgrey;
    border-bottom: 1px solid darkgrey;
}

.seller-responese-agree {
    font-size: small;
    color: green;
    font-weight: 700;
}

.seller-responese-reject {
    font-size: small;
    color: #e1251b;
    font-weight: 700;
}


.quotation-username {
    max-width: 8rem;
    min-width: 4rem;
    font-size: small;
    cursor: default;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

.diversio-wire-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-left: 1rem;
    width: 3rem;
}

.bid-wrapper,
.reply-wrapper {
    display: flex;
}

.message-wrapper {
    margin-left: 1rem;
}


.bid-dialog-wrapper {
    display: flex;
    align-items: center;

}

.steps {
    height: 20rem;
    width: 15rem;
    margin-right: 3rem;
}

.step {
    width: 15rem;
    margin-right: 3rem;
}

.margin-top2 {
    margin-top: 2rem;
}









.order-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.order-wrapper>div {
    margin-top: 2rem;
    width: 90%;
}

.order-commodity-name {
    font-size: x-large;
    font-weight: 700;
}

.order-price-seller {
    font-size: x-large;
    color: #e4393c;
    font-weight: 700;
}

.fade-enter-active {
    transition: opacity 1s ease
}

.fade-leave-active {
    transition: opacity 0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.step-content-wrapper {
    height: 22rem;
    width: 50rem;
}



.card {
    margin-top: .5rem;
}

.commodity-card {
    justify-content: space-around;
}

.img-wrapper {
    cursor: pointer;
}

.loading-tips {
    text-align: center;
    font-size: small;
    color: gray;
    margin-top: .3rem;
}

.name-wrapper {
    display: flex;
    align-items: flex-start;
}

.name-wrapper .status {
    margin-left: .5rem;
}

.name {
    font-size: large;
    font-weight: 700;
}

.commodity-info-wrapper {
    font-size: small;
}

.commodity-info-wrapper>div {
    margin-top: .5rem;
}

.info {
    display: flex;
    flex-direction: column;
}

.info>span {
    margin-top: .5rem;
}

.priceAndQualityWrapper {
    margin-top: 1rem !important;
}

.quality {
    margin-left: .3rem;
}

.price {
    font-size: larger;
    color: #e4393c;
}

.bottom-wrapper {
    display: flex;
    flex-direction: column;
}

.bottom {
    display: flex;
    justify-content: space-between;
}

.view-count {
    font-size: small;
    color: gray;
}

.launch-time {
    margin-top: .3rem;
    font-size: small;
    color: gray;
}



.commodity-button {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}

.commodity-button>button {
    margin-top: .3rem;
}
</style>
<style>
.editor-content-view {
    border: 3px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    margin-top: 20px;
    overflow-x: auto;
}

.editor-content-view p,
.editor-content-view li {
    white-space: pre-wrap;
    /* 保留空格 */
}

.editor-content-view blockquote {
    border-left: 8px solid #d0e5f2;
    padding: 10px 10px;
    margin: 10px 0;
    background-color: #f1f1f1;
}

.editor-content-view code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
    border-radius: 3px;
}

.editor-content-view pre>code {
    display: block;
    padding: 10px;
}

.editor-content-view table {
    border-collapse: collapse;
}

.editor-content-view td,
.editor-content-view th {
    border: 1px solid #ccc;
    min-width: 50px;
    height: 20px;
}

.editor-content-view th {
    background-color: #f1f1f1;
}

.editor-content-view ul,
.editor-content-view ol {
    padding-left: 20px;
}

.el-divider__text {
    background-color: #f2f3f5;
}

.w-e-text-container {
    color: var(--el-text-color-primary);
    background-color: var(--el-bg-color-overlay);

}

.w-e-textarea-video-container {
    background-image: none;
    border: none;
}

.w-e-textarea-video-container video {
    width: 100%;
}
</style>