<template>
    <div>
        <div class="fun-tool" style="padding-top:0">
            <p class="tip" style="color:red">请选择连续的自然月账单进行提现。</p>
        </div>
        <Table :columns="columns1" :data="tableData1" :loading="JSON.stringify(this.resData) == '{}'" @on-selection-change="selectionChange"></Table>
        <div class="btn-wrapper">
            <Button type="primary" @click="nextStep" :disabled="nextStepDisabled">下一步</Button>
            <Button type="primary" @click="cancel">取消</Button>
        </div>
        <Modal v-model="withdrawBox" title="提现申请" @on-cancel="withdrawBox_cancleTop">
            <div class="withdrawBox-ul">
                <ul>
                    <li><label>提现金额：</label>{{resDataPOPBOX.sumPercentMoney}}</li>
                    <li><label>账户名称：</label>{{resDataPOPBOX.accountName}}</li>
                    <li><label>银行账号：</label>{{resDataPOPBOX.bankAccount}}</li>
                    <li><label>所属银行：</label>{{resDataPOPBOX.affiliatedBank}}</li>
                    <li><label>开户银行：</label>{{resDataPOPBOX.bankName}}</li>
                </ul>
                <div class="tip">
                    提交成功后，可在结算订单列表中查看到所申请的订单。
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" @click="withdrawBox_ok">提交申请</Button>
                <Button type="primary" @click="withdrawBox_cancel">取消</Button>
            </div>
        </Modal>
        <Modal v-model="settingBillBox" title="提示" @on-cancel="settingBillBox_cancleTop">
            <div class="">
                您还未设置公证处的银行收款账户，请前往<b>“结算-银行账户设置”</b>中设置后再申请提现。
            </div>
            <div slot="footer">
                <Button type="primary" @click="settingBillBox_ok">立即设置</Button>
                <Button type="primary" @click="settingBillBox_cancel">稍后设置</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                settingBillBox:false,
                withdrawBox:false,
                nextStepDisabled:true,
                // 当前页码
                current: 1,
                resData:{},
                resDataPOPBOX:{},
                id:[],
                // 表格
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        key: 'seq',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '账单时间',
                        key: 'monthTime',
                        align: 'center',
                    },
                    {
                        title: '结算笔数',
                        key: 'orgPercentCount',
                        align: 'center',
                    },
                    {
                        title: '公证保管实收公证币（币）',
                        key: 'orgPercentToken',
                        align: 'center',
                    },
                    {
                        title: '公证保管费结算金额（元）',
                        key: 'orgPercentMoney',
                        align: 'center',
                    },
                    {
                        title: '结算状态',
                        key: 'settlementStatus',
                        align: 'center',
                        render: (h, params) => {
                            switch (params.row.settlementStatus) {
                                case '-1':
                                    return h('span', '审核不通过退回');break
                                case '-2':
                                    return h('span', '撤销提现');break
                                case '0':
                                    return h('span', '未提现申请');break
                                case '1':
                                    return h('span', '申请待受理');break
                                case '2':
                                    return h('span', '受理通过待开票');break
                                case '3':
                                    return h('span', '已开票邮寄待初审');break
                                case '4':
                                    return h('span', '初审通过待复核');break
                                case '5':
                                    return h('span', '结算成功');break
                                case '-':
                                    return h('span', '-');break
                            }
                        }
                    },
                ],
                tableData1: []
            }
        },
        methods: {
            // 下一步按钮
            nextStep(){
                console.log(String(this.id))
                this.$http.post('/settlementOrg/ajax/application.action', this.qs.stringify({
                    sysUserToken: this.$store.state.token,
                    id: String(this.id)
                })).then(response => {
                    if (response.data.code == 200) {
                        console.log(response)
                        this.withdrawBox = true
                        this.resDataPOPBOX =  response.data.data
                    }else if(response.data.code == 10002){
                        if(response.data.errorMsg == ' 您还未设置公证处的银行收款账户，请前往“财务管理-银行账户设置”中设置后再申请提现不能为空'){
                            this.settingBillBox = true
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            // 选中项变化
            selectionChange(selection){
                this.id = []
                for(let i = 0;i<selection.length;i++){
                    this.id.push(selection[i].id)
                }
                if(selection.length == 0){
                    this.nextStepDisabled = true
                }else{
                    this.nextStepDisabled = false
                }
                console.log(this.id)
            },
            // 提现申请-申请按钮
            withdrawBox_ok(){
                this.$http.post('/settlementOrg/ajax/generatingOrder.action', this.qs.stringify({
                    sysUserToken: this.$store.state.token,
                    summaryId: this.resDataPOPBOX.summaryId,
                    money: this.resDataPOPBOX.sumPercentMoney,
                    accountName: this.resDataPOPBOX.accountName,
                    bankAccount: this.resDataPOPBOX.bankAccount,
                    bankName: this.resDataPOPBOX.bankName,
                    affiliatedBank: this.resDataPOPBOX.affiliatedBank
                })).then(response => {
                    if (response.data.code == 200) {
                        console.log(response)
                        if($('.ivu-message-notice-content').length == 0){
                            this.$Message.success({
                                content: "提交成功",
                                duration: 1,
                                onClose: () => {
                                    this.nextStepDisabled = true
                                    this.withdrawBox = false
                                    this.getTableDate(1)
                                }
                            })
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            // 提现申请-取消按钮
            withdrawBox_cancel(){
                this.withdrawBox = false
            },
            // 提现申请-取消按钮X
            withdrawBox_cancleTop(){
                this.withdrawBox = false
            },
            // 设置 发票信息管理-确定按钮
            settingBillBox_ok(){
                this.$router.push({
                    name: 'BillingMan'
                })
            },
            // 设置 发票信息管理-取消按钮
            settingBillBox_cancel(){
                this.settingBillBox = false
            },
            // 设置 发票信息管理-取消按钮X
            settingBillBox_cancleTop(){
                this.settingBillBox = false
            },
            // 取消按钮
            cancel(){
                this.$router.push({
                    name: 'CustodyUnfinished'
                })
            },
            // 获取表格数据
            getTableDate() {
                this.$http.get('/orgMonthSummary/orgQueryNoSettlementOrder.action', {params:{
                    sysUserToken: this.$store.state.token,
                    // pageNo: '1',
                    // pageSize: '100',
                }}).then(response => {
                    if (response.data.code == 200) {
                        console.log(response)
                        this.resData =  response.data.data
                        this.tableData1 = response.data.data.list
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
        },
        mounted() {
            this.$store.commit('SET_POSITION', {
                primaryNavigation: '财务报表',
                subNavigation: '公证保管账单',
                thirdNavigation: '未结算完结账单',
                fourthNavigation: '批量申请',
                secondName: 'CustodyUnfinished',
                second: true,
                third: true,
                fourth: true,
            });
            // 表格初始化，显示第一页
            this.getTableDate()
        },
    }
</script>

<style>
</style>