<template>
    <div>
        <form action="" method="post" id="form"></form>
        <div class="search-area clearfix">
            <Form ref="form" :model="form" :label-width="0">
                <input type='text' style='display:none'/>
                <ul class="ul">
                    <li class="li">
                        <label>结算订单号：</label>
                        <FormItem class="formItem" prop="keywords">
                            <Input v-model="form.keywords" placeholder="结算订单号" style="width: 200px" @keyup.native.13&&108="getTableDate(1)"></Input>
                        </FormItem>
                    </li>       
                    <li class="li">
                        <label>结算状态：</label>
                        <FormItem class="formItem" prop="orderStatusDefault"> 
                            <Select v-model="form.orderStatusDefault" style="width:200px;">
                                <Option v-for="item in form.orderStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </li>
                    <li class="li">
                        <Button type="primary" @click="getTableDate(1)">查询</Button>
                        <Button type="primary" @click="searchArea_reset('form')">重置</Button>
                    </li>
                </ul>
            </Form>
        </div>
        <Table :columns="columns1" :data="tableData1" :loading="JSON.stringify(resData) == '{}'"></Table>
        <Page :total="resData.totalCount" :current="current" :page-size="pageSize" show-total @on-change="jumpToPage" show-sizer :page-size-opts="[10, 15, 20]" @on-page-size-change="getTableDateBypagesize" v-if="resData.totalCount"></Page>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageSize:10,
                // 当前页码
                current: 1,
                resData:{},
                form:{
                    keywords:'',
                    // 结算状态select
                    orderStatus: [
                        {
                            value: '99',
                            label: '全部'
                        },
                        {
                            value: '-1',
                            label: '拒绝受理'
                        },
                        {
                            value: '0',
                            label: '已撤销'
                        },
                        {
                            value: '1',
                            label: '申请提现'
                        },
                        {
                            value: '2',
                            label: '对账通过'
                        },
                        {
                            value: '3',
                            label: '完成开票'
                        },
                        {
                            value: '4',
                            label: '初审通过'
                        },
                        {
                            value: '5',
                            label: '结算成功'
                        },
                    ],
                    orderStatusDefault: '99',
                }, 
                // 表格
                columns1: [
                    {
                        title: '序号',
                        key: 'number',
                        width : 80,
                        align: 'center',
                    },
                    {
                        title: '提交时间',
                        key: 'createDate',
                        align: 'center',
                    },
                    {
                        title: '结算订单号',
                        key: 'settlementOrderNumbe',
                        align: 'center',
                    },
                    {
                        title: '公证保管实收公证币（币）',
                        key: 'orgPercentMoney',
                        align: 'center',
                    },
                    {
                        title: '公证保管费结算金额（元）',
                        key: 'money',
                        align: 'center',
                    },
                    {
                        title: '结算状态',
                        key: 'settlementStatus',
                        align: 'center',
                        render: (h, params) => {
                            switch (params.row.settlementStatus) {
                            case '-1':
                                return h('span', '拒绝受理');break
                            case '0':
                                return h('span', '已撤销');break
                            case '1':
                                return h('span', '申请提现');break
                            case '2':
                                return h('span', '对账通过');break
                            case '3':
                                return h('span', '完成开票');break
                            case '4':
                                return h('span', '初审通过');break
                            case '5':
                                return h('span', '结算成功');break
                            case '-':
                                return h('span', '-');break
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'handle',
                        width : 160,
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.settlementStatus == '2'){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: 'TallyOrderDetail',
                                                    params: {
                                                        id: params.row.id
                                                    }
                                                })
                                            }
                                        }
                                    }, '开票邮寄'),
                                ]);
                            }else{
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: 'TallyOrderDetail',
                                                    params: {
                                                        id: params.row.id
                                                    }
                                                })
                                            }
                                        }
                                    }, '详情'),
                                ]);
                            }
                        }
                    }
                ],
                tableData1: []
            }
        },
        methods: {
            // 修改每页显示条数
            getTableDateBypagesize(pagesize){
                this.pageSize = pagesize
                this.getTableDate(1)
            },
            // 重置
            searchArea_reset(name){
                this.$refs[name].resetFields()
            },
            // 分页跳转
            jumpToPage(page){
                this.getTableDate(page,this.order)
            },
            // 获取表格数据
            getTableDate(page,order) {
                this.current = page
                this.$http.get('/settlementOrg/ajax/queryOrgSettlement.action', {params:{
                    sysUserToken: this.$store.state.token,
                    settlementNumber: this.form.keywords,
                    settlementStatus: this.form.orderStatusDefault,
                    pageNo: page,
                    pageSize: this.pageSize,
                }}).then(response => {
                        console.log(response)
                    
                    if (response.data.code == 200) {
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
                subNavigation: '结算订单',
                name: 'TallyOrder',
                second: true,
            });
            // 表格初始化，显示第一页
            this.getTableDate(1)
        },
    }
</script>

<style scoped>

</style>

