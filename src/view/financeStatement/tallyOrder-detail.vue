<template>
    <div class="detail-page">
        <div class="order-info" v-if="resData.settlementStatus == '-1'">
            <ul>
                <li class="li1">
                    <Icon type="information-circled" style="margin-right:10px;"></Icon>订单状态：拒绝受理</li>
                <li>订单类型：订单关闭 <span style="color:#ccc;margin-left:20px">关闭时间：{{resData.settlementCloseTime}}</span></li>
                <li>原因：{{resData.remark}}</li>
                <li>订单号：{{resData.settlementOrderNumber}}<span style="color:#ccc;margin-left:20px">创建时间：{{resData.createDateTime}}</span></li>
            </ul>
        </div>
        <div class="order-info" v-if="resData.settlementStatus == '0'">
            <ul>
                <li class="li1">
                    <Icon type="information-circled"></Icon>订单状态：撤销提现</li>
                <li>订单类型：订单关闭 <span style="color:#ccc;margin-left:20px">关闭时间：{{resData.settlementCloseTime}}</span></li>
                <li>订单号：{{resData.settlementOrderNumber}}<span style="color:#ccc;margin-left:20px">创建时间：{{resData.createDateTime}}</span></li>
            </ul>
        </div>
        <div class="order-info" v-if="resData.settlementStatus == '5'">
            <ul>
                <li class="li1">
                    <Icon type="information-circled"></Icon>订单状态：结算成功</li>
                <li>订单类型：交易成功 <span style="color:#ccc;margin-left:20px">关闭时间：{{resData.settlementCloseTime}}</span></li>
                <li>订单号：{{resData.settlementOrderNumber}}<span style="color:#ccc;margin-left:20px">创建时间：{{resData.createDateTime}}</span></li>
            </ul>
        </div>
        <div class="process-bar clearfix" v-if="resData.settlementStatus != '-1' && resData.settlementStatus != '0' && resData.settlementStatus != '5'">
            <div class="process-bar-1">
                <span style="margin-right:20px">订单号：{{resData.settlementOrderNumber}}</span>
                <span>创建时间：{{resData.createDateTime}}</span>
            </div>
            <div class="process-bar-2">
                <Steps :current="currentStep">
                    <Step title="申请提现" :content="resData.createDateTime"></Step>
                    <Step title="对账通过" :content="resData.applicationPassTime"></Step>
                    <Step title="完成开票" :content="resData.invoicedTime"></Step>
                    <Step title="初审通过" :content="resData.firstTrialTime"></Step>
                    <Step title="结算成功" :content="resData.settlementCloseTime"></Step>
                </Steps>
            </div>
        </div>
        <div class="panel-title">
            账单信息
        </div>
        <div class="panel-word">
            <Table :columns="columns1" :data="tableData1" :loading="JSON.stringify(this.resData) == '{}'"></Table>
        </div>
        <div class="panel-title">
            提现信息
        </div>
        <div class="panel-word">
            <table>
                <tr>
                    <td width="10%">账户名称：</td>
                    <td width="30%">{{resData.accountName}}</td>
                    <td width="10%">开户银行：</td>
                    <td width="30%">{{resData.bankName}}</td>
                </tr>
                <tr>
                    <td>银行账号：</td>
                    <td>{{resData.bankAccount}}</td>
                    <td>付款交易流水号：</td>
                    <td>{{resData.paymentTransactionNumber}}</td>
                </tr>
                <tr>
                    <td>所属银行：</td>
                    <td>{{resData.affiliatedBank}}</td>
                </tr>
            </table>
        </div>
        <div class="panel-title" v-if="resData.settlementStatus != '-1' && resData.settlementStatus != '0' && resData.settlementStatus != '1'">
            发票信息
        </div>
        <div class="panel-word" v-if="resData.settlementStatus != '-1' && resData.settlementStatus != '0' && resData.settlementStatus != '1'">
        <Form ref="form" :model="form" :rules="ruleCustom" :label-width="0">
            <table>
                <tr>
                    <td width="10%">纳税人识别号：</td>
                    <td width="30%">{{resData.taxpayerIdentifyNumber}}</td>
                    <td>电话号码：</td>
                    <td>{{resData.contactMobile}}</td>
                </tr>
                <tr>
                    <td>名称：</td>
                    <td>{{resData.invoiceName}}</td>
                    <td width="10%">货物名称：</td>
                    <td width="30%">{{resData.productName}}</td>
                </tr>
                <tr>
                    <td>开户银行：</td>
                    <td>{{resData.invoiceBankName}}</td>
                    <td>发票类型：</td>
                    <td v-if="resData.settlementStatus == '2'">
                        <FormItem class="formItem" prop="invoiceTypeDefault"> 
                            <Select v-model="form.invoiceTypeDefault" style="width:200px;" @on-change="invoiceTypeSelectChange">
                                <Option v-for="item in form.invoiceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </td>
                    <td v-if="resData.settlementStatus != '2'">
                        <span v-if="resData.invoiceType == '1'">增值税普通发票</span>
                        <span v-if="resData.invoiceType == '2'">增值税专用发票</span>
                        <span v-if="resData.invoiceType == '-'">-</span>
                    </td>
                </tr>
                <tr>
                    <td>银行账户：</td>
                    <td>{{resData.invoiceBankAccount}}</td>
                    <td>* 发票号码：</td>
                    <td v-if="resData.settlementStatus == '2'">
                        <FormItem class="formItem" prop="invoiceNumber">                     
                            <Input v-model="form.invoiceNumber" style="width: 200px" :maxlength="20"></Input>
                        </FormItem>
                    </td>
                    <td v-if="resData.settlementStatus != '2'">
                        {{resData.invoiceNumber}}
                    </td>
                </tr>
                <tr>
                    <td>单位地址：</td>
                    <td>{{resData.unitAddress}}</td>
                </tr>
            </table>
        </Form>
        </div>
        <div class="panel-title" v-if="resData.settlementStatus != '-1' && resData.settlementStatus != '0' && resData.settlementStatus != '1'">
            邮寄信息
        </div>
        <div class="panel-word" v-if="resData.settlementStatus != '-1' && resData.settlementStatus != '0' && resData.settlementStatus != '1'">
            <table>
                <tr>
                    <td width="10%">收件人：</td>
                    <td width="30%">{{resData.postalName}}</td>
                    <td width="10%">邮政编码：</td>
                    <td width="30%">{{resData.zipCode}}</td>
                </tr>
                <tr>
                    <td>邮寄地址：</td>
                    <td>{{resData.postalAddress}}</td>
                    <td>联系电话：</td>
                    <td>{{resData.phone}}</td>
                </tr>
            </table>
        </div>
        <div class="btn-wrapper" v-if="resData.settlementStatus == '1'">
            <Button type="primary" @click="step1_ok">撤销订单</Button>
            <Button type="primary" @click="returnToList">返回</Button>
        </div>
        <div class="btn-wrapper" v-if="resData.settlementStatus == '2'">
            <Button type="primary" @click="step2_ok('form')">开票邮寄</Button>
            <Button type="primary" @click="returnToList">返回</Button>
        </div>
        <div class="btn-wrapper" v-if="resData.settlementStatus != '1' && resData.settlementStatus != '2'">
            <Button type="primary" @click="returnToList">返回</Button>
        </div>
        <div>
            <div class="panel-title">
                日志
            </div>
            <div class="panel-word">
                <ul v-for="item in resData.operationDetails">
                    <li>{{item.operation}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            const validateInvoiceNumber = (rule, value, callback) => {
                if (this.form.invoiceNumber.replace(/ /g, "") == '') {
                    callback(new Error('请输入'))
                }
                let reg = /^[0-9a-zA-Z]+$/
                if (reg.test(this.form.invoiceNumber) == false) {
                    callback(new Error('格式错误'));
                }
                callback()                                  
            }
            return {
                ruleCustom: {
                    invoiceNumber: [
                        { required: true, validator: validateInvoiceNumber, trigger: 'blur' }
                    ],
                },
                currentStep:0,
                resData:{},
                form:{
                    invoiceNumber:'',
                    invoiceType: [
                        {
                            value: '1',
                            label: '增值税普通发票'
                        },
                        {
                            value: '2',
                            label: '增值税专用发票'
                        },
                    ],
                    invoiceTypeDefault: '2',
                },
                // 表格
                columns1: [
                    {
                        title: '序号',
                        key: 'number',
                        align: 'center',
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
                        title: '公证保管实收公证币数（币）',
                        key: 'orgPercentToken',
                        align: 'center',
                    },
                    {
                        title: '公证保管费结算金额（元）',
                        key: 'orgPercentMoney',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'handle',
                        width : 160,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'CustodyUnfinishedDetail',
                                                params: {
                                                    monthTime: params.row.monthTime,
                                                }
                                            })
                                        }
                                    }
                                }, '账单明细'),
                            ]);
                        }
                    }
                ],
                tableData1: []
            }
        },
        methods: {
            // 获取表格数据
            getData() {
                this.$http.get('/settlementOrg/ajax/applicationDetail.action', {params:{
                    sysUserToken: this.$store.state.token,
                    id: this.$route.params.id,
                }}).then(response => {
                    if (response.data.code == 200) {
                        console.log(response)
                        this.resData =  response.data.data
                        if(this.resData.settlementStatus == '-1'){
                            // this.currentStep = Number(resData.settlementStatus)
                        }else if(this.resData.settlementStatus == '0'){
                                                        
                        }else if(this.resData.settlementStatus == '1'){
                            // 申请待受理
                            this.currentStep = 0
                        }else if(this.resData.settlementStatus == '2'){
                            this.currentStep = 1
                        }else if(this.resData.settlementStatus == '3'){
                            this.currentStep = 2
                        }else if(this.resData.settlementStatus == '4'){
                            this.currentStep = 3
                        }else if(this.resData.settlementStatus == '5'){
                            // this.currentStep = 4
                        }
                        this.tableData1 = response.data.data.list 
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            // 通过按钮
            step1_ok(){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定撤销此结算订单？</p>',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.$http.post('/settlementOrg/ajax/firstTrialCancel.action', this.qs.stringify({
                            sysUserToken: this.$store.state.token,
                            id: this.resData.id,
                        })).then(response => {
                            console.log(response)
                            if (response.data.code == 200) {
                                if($('.ivu-message-notice-content').length == 0){
                                    this.$Message.success({
                                        content: "撤销成功",
                                        duration: 1,
                                        onClose: () => {
                                            this.getData()
                                        }
                                    })
                                }
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    },
                    onCancel: () => {}
                })
            },
            // 开票邮寄
            step2_ok(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '<p>确定填写的发票信息无误？</p>',
                            okText: '确定',
                            cancelText: '取消',
                            onOk: () => {
                                console.log(this.resData.id)
                                console.log(this.form.invoiceTypeDefault)
                                console.log(this.form.invoiceNumber)
                                this.$http.post('/settlementOrg/ajax/firstTrial.action', this.qs.stringify({
                                    sysUserToken: this.$store.state.token,
                                    id: this.resData.id,
                                    invoiceType : this.form.invoiceTypeDefault,
                                    invoiceNumber: this.form.invoiceNumber
                                })).then(response => {
                                    console.log(response)
                                    if (response.data.code == 200) {
                                        if($('.ivu-message-notice-content').length == 0){
                                            this.$Message.success({
                                                content: "提交成功",
                                                duration: 1,
                                                onClose: () => {
                                                    this.getData()
                                                }
                                            })
                                        }
                                    }
                                }).catch(error => {
                                    console.log(error)
                                })
                            },
                            onCancel: () => {}
                        })
                    }
                })
            },
            // 发票类型select改变
            invoiceTypeSelectChange(value){
                if(value == '1'){
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>法信公证云是一般纳税人，请尽量开<b>增值税专用发票</b></p>',
                        okText: '我知道了',
                        onOk: () => {},
                        onCancel: () => {}
                    })
                }
            },
            // 初审确认-确定按钮
            step3_ok(){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定已收到发票，且所有信息无误？</p>',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.$http.post('/settlement/ajax/firstTrial.action', this.qs.stringify({
                            id: this.resData.id,
                        })).then(response => {
                            console.log(response)
                            if (response.data.code == 200) {
                                if($('.ivu-message-notice-content').length == 0){
                                    this.$Message.success({
                                        content: "提交成功",
                                        duration: 1,
                                        onClose: () => {
                                            this.getData()
                                        }
                                    })
                                }
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    },
                    onCancel: () => {}
                })
            },
            // 已线下汇款-确定按钮
            step4_ok_offline(){
                this.offlineMoney = true
            },
            // 返回列表
            returnToList() {
                this.$router.push({
                    name: 'TallyOrder'
                })
            }
        },
        mounted() {
            this.$store.commit('SET_POSITION', {
                primaryNavigation: '财务报表',
                subNavigation: '结算订单',
                thirdNavigation: '详情',
                name: 'TallyOrder',
                second: true,
                third: true,
            });
            this.getData()
        },
    }
</script>

<style scoped>

</style>

