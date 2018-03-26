<template>
    <div>
        <div class="fun-tool">
            <p class="tip">{{this.$route.params.monthTime}}  {{this.$route.params.orgName}}账单明细</p>
        </div>
        <Table :columns="columns1" :data="tableData1" :loading="JSON.stringify(this.resData) == '{}'"></Table>
        <Page :total="totalCount" :current="current" :page-size="pageSize" show-total @on-change="getTableDate" show-sizer :page-size-opts="[ 10, 15, 20]" @on-page-size-change="getTableDateBypagesize" v-if="this.resData.totalCount"></Page>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 是否显示分页，默认显示
                showPage: true,
                pageSize:10,
                // 总条数
                totalCount: 0,
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
                        key: 'seq',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '消费完成时间',
                        key: 'orderFinishedPayTime',
                        align: 'center',
                    },
                    {
                        title: '消费订单号',
                        key: 'orderSequence',
                        align: 'center',
                    },
                    {
                        title: '用户名',
                        key: 'orderAccount',
                        align: 'center',
                    },
                    {
                        title: '用户类型',
                        key: 'userType',
                        align: 'center',
                        render: (h, params) => {
                            switch (params.row.userType) {
                                case '2':
                                    return h('span', '个人用户');break
                                case '3':
                                    return h('span', '电子送达用户');break
                                case '4':
                                    return h('span', '机构用户');break
                                case '5':
                                    return h('span', '公证书查询用户');break
                                case '6':
                                    return h('span', '中介机构用户');break
                                case '15':
                                    return h('span', '第三方用户');break
                                case '-':
                                    return h('span', '-');break
                            }
                        }
                    },
                    {
                        title: '证据类型',
                        key: 'evidType',
                        align: 'center',
                        render: (h, params) => {
                            switch (params.row.evidType) {
                                case '1':
                                    return h('span', '网页取证');break
                                case '2':
                                    return h('span', '版权保护');break
                                case '4':
                                    return h('span', '电话录音');break
                                case '5':
                                    return h('span', '手机拍照');break
                                case '6':
                                    return h('span', '手机录像');break
                                case '7':
                                    return h('span', '邮件证据');break
                                case '8':
                                    return h('span', '现场录音');break
                                case '9':
                                    return h('span', '文档证据');break
                                case '10':
                                    return h('span', '电子签约');break
                                case '11':
                                    return h('span', '图片存证');break
                                case '12':
                                    return h('span', '知识产权');break
                                case '13':
                                    return h('span', '短信证据');break
                                case '14':
                                    return h('span', '直播录像');break
                                case '15':
                                    return h('span', '手机屏幕录像');break
                                case '20':
                                    return h('span', '见证实录');break
                                case '-':
                                    return h('span', '-');break
                            }
                        }
                    },
                    {
                        title: '单价（币）',
                        key: 'unitPrice',
                        align: 'center',
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center',
                    },
                    {
                        title: '数量',
                        key: 'number',
                        align: 'center',
                    },
                    {
                        title: '用户抵扣水晶币（币）',
                        key: 'crystalMoney',
                        align: 'center',
                    },
                    {
                        title: '用户消费公证币（币）',
                        key: 'orderToken',
                        align: 'center',
                    },
                    {
                        title: '公证处分成比例',
                        key: 'percent',
                        align: 'center',
                    },
                    {
                        title: '公证保管实收公证币数（币）',
                        key: 'orgPercentToken',
                        align: 'center',
                    },
                    {
                        title: '公证保管费（元）',
                        key: 'orgPercentTokenMoney',
                        align: 'center',
                    },
                    {
                        title: '法信分成金额（元）',
                        key: 'fxPercentTokenMoney',
                        align: 'center',
                    },
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
            // 获取表格数据
            getTableDate(page) {
                this.current = page
                this.$http.get('/orgMonthSummary/queryOrderDetail.action', {params:{
                    sysUserToken: this.$store.state.token,
                    monthTime: this.$route.params.monthTime,
                    orgName: this.$route.params.orgName,
                    pageNo: page,
                    pageSize: this.pageSize,
                }}).then(response => {
                    if (response.data.code == 200) {
                        if(response.data.data.totalCount == 0){
                            this.showPage = false
                        }else{
                            this.showPage = true
                        }
                        console.log(response)
                        this.resData =  response.data.data
                        this.tableData1 = response.data.data.list
                        this.totalCount = Number(response.data.data.totalCount)
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
                thirdNavigation: '详情',
                fourthNavigation: '账单明细',
                name: 'TallyOrder',
                secondName: 'TallyOrderDetail',
                second: true,
                third: true,
                fourth: true,
            });
            // 表格初始化，显示第一页
            this.getTableDate(1)
        },
    }
</script>

<style>
</style>