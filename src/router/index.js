import Vue from "vue";
import Router from "vue-router";
import store from "./../store/store";
import axios from './../http'; // axios
// zxy页面start
import Layout from "../view/layout";

import Consume from '../view/financeStatement/consume.vue'

import CustodyUnfinished from '../view/financeStatement/custody-unfinished.vue'
import CustodyFinished from '../view/financeStatement/custody-finished.vue'
import CustodyUnfinishedDetail from '../view/financeStatement/custody-unfinished-detail.vue'
import CustodyUnfinishedWithdraw from '../view/financeStatement/custody-unfinished-withdraw.vue'

import TallyOrder from '../view/financeStatement/tallyOrder.vue'
import TallyOrderDetail from '../view/financeStatement/tallyOrder-detail.vue'
import TallyOrderDetailBillDetail from '../view/financeStatement/tallyOrder-detail-billDetail.vue'

import BillingMan from '../view/sysInfoSetting/billingMan.vue'

Vue.use(Router);

export const routerMap = [
    {
        //首页
        path: "/index",
        name: "Index",
        component: Layout,
        hidden: true
    },
    {
        //财务报表
        path: "/financeStatement",
        component: Layout,
        children: [
            {
                //财务报表-消费查询
                path: '/financeStatement/consume',
                name: 'Consume',
                component: Consume,
            },
            {
                //财务报表-公证保管账单-未结算完结账单
                path: '/financeStatement/custodyUnfinished',
                name: 'CustodyUnfinished',
                component: CustodyUnfinished,
            }, 
            {
                //财务报表-公证保管账单-未结算完结账单-详情
                path: '/financeStatement/custodyUnfinishedDetail/:monthTime',
                name: 'CustodyUnfinishedDetail',
                component: CustodyUnfinishedDetail,
            },
            {
                //财务报表-公证保管账单-未结算完结账单-提现申请
                path: '/financeStatement/custodyUnfinishedWithdraw',
                name: 'CustodyUnfinishedWithdraw',
                component: CustodyUnfinishedWithdraw,
            },
            {
                //财务报表-公证保管账单-结算成功账单
                path: '/financeStatement/custodyFinished',
                name: 'CustodyFinished',
                component: CustodyFinished,
            },
            {
                //财务报表-结算订单
                path: '/financeStatement/tallyOrder',
                name: 'TallyOrder',
                component: TallyOrder,
            }, {
                //财务报表-结算订单-详情
                path: '/financeStatement/tallyOrderDetail/:id',
                name: 'TallyOrderDetail',
                component: TallyOrderDetail,
            }, {
                //财务报表-结算订单-详情-订单详情
                path: '/financeStatement/tallyOrderDetailBillDetail',
                name: 'TallyOrderDetailBillDetail',
                component: TallyOrderDetailBillDetail,
            }
        ]
    }, {
        //系统信息设置
        path: "/sysInfoSetting",
        component: Layout,
        children: [
            {
                //系统信息设置-发票信息管理
                path: '/sysInfoSetting/billingMan',
                name: 'BillingMan',
                component: BillingMan,
            }
        ]
    }
];

const router = new Router({
    mode: 'history',
    // base: __dirname,
    // base: '/gzcstmfe/',//正式环境
    base: '/stmfe/',//测试环境
    scorllBehavior: () => ({y: 0}),
    routes: routerMap
});
export default router;

// 路由拦截
// router.beforeEach((to, from, next) => {
//     if (store.state.token) {
//         console.log(11111111111)
//         if (!store.state.userInfo) {
//             store.dispatch('getInfo').then(res => { // 拉取info
//                 console.log('to.path1" ' + to.path)
//                 next()
//             })
//         } else {
//             console.log('to.path2" ' + to.path)
//             next() 
//         }
//     } else {
//         console.log(222222222)

//         // let paramToken = window.location.search.substring(1) 
//         // console.log(paramToken)
//         // if(paramToken){     
//         //     store.dispatch('SetStoreToken',paramToken).then(() => {
//         //         next({name:"Index"});     
//         //     }) 
//         // }else{     
//         //     let basePath = store.state.basePath + 'alliance/logout.aspx'     
//         //     window.location.href = basePath 
//         // }

//         store.dispatch('Login', ['admin', '111111']).then((res) => {
//             if (res == true) {
//                 next({name: "Index"});
//             }
//         })
//     }
// });