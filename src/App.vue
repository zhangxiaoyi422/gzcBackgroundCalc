<template>
    <div id="app">
        <router-view></router-view>
        <!--右下角消息弹窗-->
        <div class="ivu-notice" v-if="showNotice">
            <template v-for="(item,i) in message">
                <div class="ivu-notice-notice ivu-notice-notice-closable ivu-notice-notice-with-desc">
                    <div class="ivu-notice-notice-content">
                        <div class="ivu-notice-custom-content ivu-notice-with-normal ivu-notice-with-desc">
                            <div class="ivu-notice-title">{{item.title}}</div>
                            <div class="ivu-notice-desc">{{item.text}}</div>
                            <div class="btn-wrapper">
                                <Button type="primary" @click="jumpToDetail(item.name,item.serviceId,item.messageId)">前往查看</Button>
                                <Button type="primary" @click="closeAllNotice">关闭全部</Button>
                            </div>
                        </div>
                    </div> <a class="ivu-notice-notice-close"  @click="closeThisBox(i)"><i class="ivu-icon ivu-icon-ios-close-empty"></i></a>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                showNotice: true,
                // message: [
                //     {
                //         title:'',
                //         text:'',
                //         name:'',
                //         serviceId:'',
                //         messageId:'',
                //     }
                // ]
            }
        },
        computed: {
            message(){
                return this.$store.state.popMessage                
            },
        },
        methods: {
            // 关闭当前弹窗
             closeThisBox(i){
                this.$store.commit('DELETE_TOP_POPMESSAGE',i)
                // this.message.splice(i,1);   
            },
            // 关闭全部消息弹窗
            closeAllNotice(){
                this.showNotice = false;
            },
            // 跳转到审批详情页
            jumpToDetail(name,serviceId,messageId) {
                this.showNotice = false
                this.$router.push({
                    name: name,
                    params:{
                        userId:serviceId
                    }
                })
                // 更改消息状态
                this.$http.post('/message/v_updateState.action', this.qs.stringify({
                    id: messageId
                })).then(response => {
                    if (response.data.status == 0) {
                        this.$store.dispatch('SetUnreadMessage')
                    }else{
                        this.$Message.error({
                            content: response.data.message,
                            duration: 1,
                        });
                    }
                }).catch(error => {
                    this.$Message.error({
                        content: '操作失败',
                        duration: 1,
                    });
                    console.log(error);
                }) 
            },
            // 获取表格数据
            // getTableDate(page) {
            //     this.$http.post('/message/v_messageList.action', this.qs.stringify({
            //         pageNo: page,
            //         pageSize: 10,
            //         state: this.state,
            //         service: this.service
            //     })).then(response => {
            //         if (response.data.status == 0) {
            //             console.log(response)
            //             let _this = this
            //             $.each(response.data.data.allUnReadMessage, function(key, val) {
            //                 if (val.service == '0') {
            //                     val.service = '申请水晶币审批';
            //                     _this.hrefHead = 'FinanceApprovalCrystalDetail'
            //                 } else if (val.service == '1') {
            //                     val.service = '公证币退款审批';
            //                     _this.hrefHead = 'RefundApprovalDetail'
            //                 } else if (val.service == '2') {
            //                     val.service = '开具发票审批';
            //                     _this.hrefHead = 'FinanceBillingDetail'
            //                 }
            //                 _this.message.push({
            //                     'title': val.service,
            //                     'text': val.applyDetail,
            //                     'name': _this.hrefHead,
            //                     'serviceId' : val.serviceId,
            //                     'messageId' : val.messageId
            //                 })
            //             })
            //             this.showNotice = true;
            //         } else {
            //             console.log(response)
            //         }
            //     }).catch(error => {
            //         console.log(error);
            //     })
            // },
            // 审批消息通知
            // notice(title, desc) {
            //     this.$Notice.open({
            //         title: `<div onclick="aaa">${title}</div>`,
            //         desc: `<a href ="${this.hrefHead}ff808081600ad03601600ba017ae0021">${desc}</a>`,
            //         duration: 0,
            //         onClose: () => {}
            //     });
            // },
            
        },
        // mounted() {
        //     this.getTableDate()
        // }
    };

</script>

<style scoped>
    #app {
        height: 100%
    }
    .ivu-notice {
        bottom: 5px;
        right: 5px;
        margin-right:0;
    }
    .ivu-notice-notice {
        position: absolute;
        overflow: hidden;
        bottom: 0;
        width: 290px;
        height: 175px;
        right: 0;
        color: #333;
        box-shadow: none;
        border: 1px solid #ccc
    }
    .ivu-notice-notice a {
        color: #333
    }
    .btn-wrapper{position:absolute;bottom:0;left:0;width:100%}
</style>
