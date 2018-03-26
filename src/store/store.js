import Vue from 'vue'
import Vuex from 'vuex'
import router from "./../router/index"; // 路由列表
import axios from './../http'; // axios
import deepClone from 'lodash.clonedeep'; // 对象深拷贝
import {getQueryString} from './../assets/js/getQueryString'; // 获取url中的token

Vue.use(Vuex) 

const state = {
    // basePath配置
    // basePath : 'http://192.168.88.166:9984/',//开发环境
    basePath : 'http://192.168.88.222:9984/',//测试环境
    // basePath : 'https://admin.egongzheng.com/gzy/',//正式环境
    token: getQueryString('sysUserToken') ? getQueryString('sysUserToken'):'111111',
    // token: '',
    // 设置面包屑与菜单展开选中项
    position: {
        userId: "",
        primaryNavigation:'',               //1级显示文本
        second:false,           //二级显示隐藏
        name:'',//二级英文名字，跳转用
        subNavigation:'',                   //2级显示文本     
        secondName: "",//三级英文名字，跳转用
        thirdName:'',
        forthName:'',
        third:false,            //三级显示隐藏
        thirdNavigation:'',                 //3级显示文本 
        fourth:false,              //四级显示隐藏
        fourthNavigation: "",                //4级显示文本
        fifthNavigation:'',
        fifth:false,
        forthTab:''//4级路由tab切换
    },
    // 用户可访问路由表
    userInfo:'',
    limitList:[],
    addRouters: [],
    // 未读消息条数
    unReadMessage:'',
    // 右下角审批弹窗
    popMessage:[],
    
};


const getters = {
    // 获取导航
    getPosition(){
        var position = state.position;
        return position
    },
    getGeneratedRouters(state){
        return state.routers
    },
    // 获取用户信息
    getUserInfo(state){
        let userInfo = deepClone(state.userInfo);
        if (userInfo.status == '0') {
            userInfo.status = '冻结';
        } else if (userInfo.status == '1') {
            userInfo.status = '启用';
        } else if (userInfo.status == '2') {
            userInfo.status = '禁用';
        }
        return userInfo
    }
};

const mutations = {
    // 设置面包屑,和菜单active项
    SET_POSITION(state,payload){
        state.position = payload;
        state.activeMenuName = payload.primaryNavigation;
        state.activeMenuItemName = payload.name;
    },
    // 设置token
    SET_TOKEN(state,payload){
        sessionStorage.setItem('token',payload);
        state.token = payload
    },
    // 清空token
    REMOVE_TOKEN(state){
        sessionStorage.removeItem('token');
        state.token = '';
    },
    // 设置用户信息
    SET_USER_INFO(state, payload){
      state.userInfo = payload;
    },
    // 设置未读消息条数
    SET_UNREADMESSAGE(state, payload){
      state.unReadMessage = payload
    },
    // 设置右下角审批弹窗消息
    SET_POPMESSAGE(state, payload){
      state.popMessage = payload
    },
    // 删除最顶层弹窗消息
    DELETE_TOP_POPMESSAGE(state, payload){
        state.popMessage.splice(payload,1)
    }
};

const actions = {
    // 设置未读消息条数
    SetUnreadMessage({commit,state},unReadMessageCount){
        return new Promise((resolve, reject) => {
            axios.post('/message/v_messageList.action').then(response => {
                if(response.data.status == 0){
                    let _this = this
                    let message = []
                    $.each(response.data.data.allUnReadMessage, function(key, val) {
                        if (val.service == '0') {
                            val.service = '申请水晶币审批';
                            _this.hrefHead = 'FinanceApprovalCrystalDetail'
                        } else if (val.service == '1') {
                            val.service = '公证币退款审批';
                            _this.hrefHead = 'RefundApprovalDetail'
                        } else if (val.service == '2') {
                            val.service = '开具发票审批';
                            _this.hrefHead = 'financeBillingDetail'
                        }
                        message.push({
                            'title': val.service,
                            'text': val.applyDetail,
                            'name': _this.hrefHead,
                            'serviceId' : val.serviceId,
                            'messageId' : val.messageId
                        })
                    })
                    commit('SET_UNREADMESSAGE', response.data.data.unReadTotalCount)
                    commit('SET_POPMESSAGE', message)
                    resolve();
                }else{
                    resolve();
                }
            }).catch(function(error) {
                reject(error);
            });
            
        });
    },
    // 获取用户信息与权限
    getInfo({commit}){
        let _this = this;
        return new Promise((resolve, reject) => {
            axios.post('/user/ajax/getBaseInfo.action').then(response=>{

                console.log('-------------获取用户信息成功，打印用户信息：--------------------');
                console.log(response)
                console.log('-------------获取用户信息成功，打印用户信息：--------------------');

                commit('SET_USER_INFO', response.data.data);
                resolve()

            }).catch(error=>{
                reject(error)
            })          
        });     
    },
    // 登录
    Login({commit},[userAccount,userPassword]){
        return new Promise((resolve, reject) => {
            axios.get('/login/ajax/doLogin.action',{
                params:{
                    userAccount:userAccount,
                    userPassword:userPassword
                }
            }).then(response => {
                console.log(response)
                if(response.data.status == 0){
                    commit('SET_TOKEN',response.data.data.token);
                    resolve(true)
                }else{
                    // alert('帐号被冻结,无法使用')
                    alert(response.data.message)
                    resolve(false)
                }
                // let redirect = decodeURIComponent(this.$route.query.redirect || '/index');//对URI解码,跳转到原访问地址，如果没有则调到首页 
            }).catch(function(error) {
                alert(error)
                console.log(error);
            });
        });
    },
    // 主系统登录后这边只需要把sessionStorage中的token存到stroe里
    SetStoreToken({commit},paramToken){
        return new Promise((resolve, reject) => {
            if(paramToken){
                commit('SET_TOKEN',paramToken);
                resolve()
            }else{
                alert('没有token,无法跳转')        
            }
        });
    }
}

export default new Vuex.Store({
    strict: true, //应用了严格模式，就不可以在mutations外改变state中的值，否则会报错
    state,
    mutations,
    actions,
    getters
})
