<template>
    <div>
        <Poptip placement="right" trigger="hover" content="次月5日00:00开始统计上个月消费状态为“正常”的消费订单。当月状态为“异常”的消费订单在用户补缴正常后所归属的月份进行结算。">
            <Icon type="information-circled" style="margin-right:10px;"></Icon>
        </Poptip>
        <form action="" method="post" id="form"></form>
        <Table :columns="columns1" :data="tableData1" :loading="JSON.stringify(this.resData) == '{}'"></Table>
        <Page :total="resData.totalCount" :current="current" :page-size="pageSize" show-total @on-change="getTableDate" show-sizer :page-size-opts="[ 10, 15, 20]" @on-page-size-change="getTableDateBypagesize" v-if="this.resData.totalCount"></Page>
    </div>
</template>

<script>
    export default {
        computed: {
            basePath(){
                return this.$store.state.basePath + 'orgConsumption/exportOrder.action'
            },
        },
        data() {
            return {
                url:'',
                pageSize:10,
                // 当前页码
                current: 1,
                resData:{},
                form:{
                    keywords:'',
                },
                // 表格
                columns1: [
                    {
                        title: '序号',
                        key:'seq',
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
                                return h('span', '拒绝受理');break
                            case '-2':
                                return h('span', '已撤销');break
                            case '0':
                                return h('span', '未提现');break
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
                        align: 'center',
                        width : 250,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
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
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.exportBilling(params.row.monthTime)
                                        }
                                    }
                                }, '导出账单'),
                            ]);
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
            // 导出Excel弹窗-确定
            exportBilling(monthTime){
                this.$http.post('/orgConsumption/exportOrder.action', this.qs.stringify({
                    sysUserToken: this.$store.state.token,
                    monthTime: monthTime
                })).then(response => {
                    console.log(response)
                    if (response.status == 200) { 
                        this.url =  this.basePath + '?sysUserToken=' + this.$store.state.token + '&monthTime=' + monthTime
                        $('#form').attr({'action':this.url})
                        $('#form').submit()          
                    }
                }).catch(error => {
                    console.log(error);
                }) 
            },
            // 获取表格数据
            getTableDate(page) {
                this.current = page
                this.$http.get('/orgMonthSummary/orgQueryOrder.action', {params:{
                    sysUserToken: this.$store.state.token,
                    settlementStatus: '1',
                    pageNo: page,
                    pageSize: this.pageSize,
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
                thirdNavigation: '结算完成账单',
                secondName: 'CustodyFinished',
                second: true,
                third: true,
            });
            // 表格初始化，显示第一页
            this.getTableDate(1)
        },
    }
</script>

<style>
</style>