<template>
    <div>
        <div v-if="showSettingBtn">
            <Button type="primary" @click="setting">立即设置</Button>
        </div>
        <div v-if="showSettingPage">
            <Form ref="form" :model="form" :rules="ruleCustom" label-position="right" :label-width="120">
                <FormItem label="账户名称：" prop="input1">
                    <Input v-model="form.input1" style="width:260px" placeholder="不支持空格，不超过60个字符" :maxlength="60"></Input>
                </FormItem>
                <FormItem label="银行账号：" prop="input2">
                    <Input v-model="form.input2" style="width:260px" placeholder="请输入银行卡账号" :maxlength="30"></Input>
                </FormItem>
                <FormItem label="所属银行：" prop="bankDefault">
                    <Select v-model="form.bankDefault" filterable style="width:260px">
                            <Option v-for="item in form.bank" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                </FormItem>
                <FormItem label="开户银行：" prop="input4">
                    <Input v-model="form.input4" style="width:260px" placeholder="请输入开户银行，具体到支行名称" :maxlength="60"></Input>
                </FormItem>
            </Form>
            <div class="tip">银行账户用来收款公证云平台的公证保管费，请认真核对银行账户信息。</div>
            <div class="btn-wrapper">
                <Button type="primary" @click="save('form')">保存</Button>
                <Button type="primary" @click="cancel">返回</Button>
            </div>
        </div>
        <div v-if="showDetailPage">
            <ul>
                <li><label>账户名称：</label>{{resData.accountName}}</li>
                <li><label>银行账号：</label>{{resData.bankAccount}}</li>
                <li><label>所属银行：</label>{{resData.affiliatedBank}}</li>
                <li><label>开户银行：</label>{{resData.bankName}}</li>
            </ul>
            <div class="btn-wrapper">
                <Button type="primary" @click="edit">编辑</Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            const validateInput1 = (rule, value, callback) => {
                if (this.form.input1.replace(/ /g, "") == '') {
                    callback(new Error('请输入'))
                }
                if (this.form.input1.indexOf(' ') >= 0) {
                    callback(new Error('格式错误'));
                }
                callback()
            };
            const validateInput2 = (rule, value, callback) => {
                if (this.form.input2.replace(/ /g, "") == '') {
                    callback(new Error('请输入'))
                }
                let reg = /^[0-9]+$/
                if (reg.test(this.form.input2) == false) {
                    callback(new Error('格式错误'));
                }
                callback()
            };
            const validateBankDefault = (rule, value, callback) => {
                if (this.form.bankDefault == '99' || this.form.bankDefault == '') {
                    callback(new Error('请选择'))
                }
                callback()
            };
            const validateInput4 = (rule, value, callback) => {
                if (this.form.input4.replace(/ /g, "") == '') {
                    callback(new Error('请输入'))
                }
                if (this.form.input4.indexOf(' ') >= 0) {
                    callback(new Error('格式错误'));
                }
                callback()
            };
            return {
                ruleCustom: {
                    input1: [{
                        required: true,
                        validator: validateInput1,
                        trigger: 'blur'
                    }],
                    input2: [{
                        required: true,
                        validator: validateInput2,
                        trigger: 'blur'
                    }],
                    bankDefault: [{
                        required: true,
                        validator: validateBankDefault,
                        trigger: 'change'
                    }],
                    input4: [{
                        required: true,
                        validator: validateInput4,
                        trigger: 'blur'
                    }],
                },
                resData: {},
                showSettingBtn: false,
                showSettingPage: false,
                showDetailPage: false,
                form: {
                    input1: '',
                    input2: '',
                    bank: [{
                        value: '99',
                        label: '选择银行'
                    }, ],
                    bankDefault: '99',
                    input4: '',
                    accountId: ''
                },
            }
        },
        methods: {
            // 立即设置按钮
            setting() {
                this.showSettingBtn = false
                this.showSettingPage = true
            },
            save(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // console.log(this.form.accountId)
                        // console.log(this.form.input1)
                        // console.log(this.form.input2)
                        // console.log(this.form.input4)
                        // console.log('开户行联行号' + this.resData.openingBankCode)
                        // console.log('所属银行' + this.form.bankDefault)
                        let affiliatedBank = ''
                        let _this = this
                        $.each(this.form.bank, function(key, val) {
                            if (_this.form.bankDefault == val.value) {
                                affiliatedBank = val.label
                            }
                        })
                        this.$http.get('/bank/ajax/saveOrUpdateAccountInfo.action', {
                            params: {
                                sysUserToken: this.$store.state.token,
                                accountId: this.form.accountId,
                                accountName: this.form.input1,
                                bankAccount: this.form.input2,
                                bankName: this.form.input4,
                                openingBankCode: this.form.bankDefault,
                                affiliatedBank: affiliatedBank
                            }
                        }).then(response => {
                            console.log(response)
                            if (response.data.code == 200) {
                                if ($('.ivu-message-notice-content').length == 0) {
                                    this.$Message.success({
                                        content: "保存成功",
                                        duration: 1,
                                        onClose: () => {
                                            this.getTableDate()
                                        }
                                    });
                                }
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                })
            },
            cancel() {
                if (this.resData == null) {
                    this.showSettingBtn = true
                    this.showSettingPage = false
                    this.showDetailPage = false
                    this.form.input1 = ''
                    this.form.input2 = ''
                    this.form.bankDefault = '99'
                    this.form.input4 = ''
                } else {
                    this.showSettingBtn = false
                    this.showSettingPage = false
                    this.showDetailPage = true
                }
            },
            // 编辑
            edit() {
                this.showSettingPage = true
                this.showDetailPage = false
                this.form.input1 = this.resData.accountName
                this.form.input2 = this.resData.bankAccount
                this.form.bankDefault = this.resData.openingBankCode
                this.form.input4 = this.resData.bankName
                this.form.accountId = this.resData.accountId
            },
            // 获取银行账户信息
            getTableDate() {
                this.$http.get('/bank/ajax/getAccountInfo.action', {
                    params: {
                        sysUserToken: this.$store.state.token,
                    }
                }).then(response => {
                    console.log(response)
                    if (response.data.code == 200) {
                        this.resData = response.data.data
                        if (this.resData == null) {
                            this.showSettingBtn = true
                            this.showSettingPage = false
                            this.showDetailPage = false
                        } else {
                            this.showSettingBtn = false
                            this.showSettingPage = false
                            this.showDetailPage = true
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            // 获取银行行联号
            getBankInfo() {
                this.$http.get('/bank/ajax/bankInfoList.action', {
                    params: {
                        sysUserToken: this.$store.state.token
                    }
                }).then(response => {
                    console.log(response)
                    if (response.data.code == 200) {
                        this.form.bank = response.data.data
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        },
        mounted() {
            this.$store.commit('SET_POSITION', {
                primaryNavigation: '财务报表',
                subNavigation: '系统信息设置',
                thirdNavigation: '银行账户设置',
                secondName: 'BillingMan',
                second: true,
                third: true,
            });
            this.getTableDate()
            this.getBankInfo()
        },
    }
</script>

<style scoped>
    ul {
        margin: 20px 30px 0 30px
    }
    ul li {
        margin-bottom: 10px
    }
</style>