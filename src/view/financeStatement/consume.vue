<template>
    <div>
        <form action="" method="post" id="form"></form>
        <div class="search-area clearfix">
            <Form ref="form" :model="form" :label-width="0">
                <input type='text' style='display:none'/>
                <ul class="ul">
                    <li class="li">
                        <label>时间：</label>
                        <FormItem class="formItem" prop="start">
                            <DatePicker type="date" placeholder="请选择日期" style="width: 200px" v-model="form.start" @on-change="dateChange" @on-clear="handleClearStart"></DatePicker>&nbsp;至&nbsp;
                        </FormItem>
                        <FormItem class="formItem" prop="end">
                            <DatePicker type="date" placeholder="请选择日期" style="width: 200px" v-model="form.end" @on-change="dateChange" @on-clear="handleClearEnd"></DatePicker>
                        </FormItem>
                        <Button class="chooseDate_a" @click="chooseDateHandle('today')" :type="btn_today">今日</Button>
                        <Button class="chooseDate_a" @click="chooseDateHandle('aWeek')" :type="btn_aWeek">最近7天</Button>
                        <Button class="chooseDate_a" @click="chooseDateHandle('aMonth')" :type="btn_aMonth">最近30天</Button>
                    </li>
                    <li class="li">
                        <label>关键字：</label>
                        <FormItem class="formItem" prop="keywords">
                            <Input v-model="form.keywords" placeholder="消费订单号/用户名" style="width: 200px" @keyup.native.13&&108="getTableData(1)"></Input>
                        </FormItem>
                    </li>            
                    <li class="li">
                        <label>用户类型：</label>
                        <FormItem class="formItem" prop="userTypeDefault"> 
                            <Select v-model="form.userTypeDefault" style="width:200px">
                                <Option v-for="item in form.userType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </li>
                    <li class="li">
                        <label>证据类型：</label>
                        <FormItem class="formItem" prop="storageTypeDefault"> 
                            <Select v-model="form.storageTypeDefault" style="width:200px;">
                                <Option v-for="item in form.storageType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </li>
                    <li class="li">
                        <Button type="primary" @click="getTableData(1)">查询</Button>
                        <Button type="primary" @click="searchArea_reset('form')">重置</Button>
                    </li>
                </ul>
            </Form>
        </div>
        <Table :columns="columns1" :data="tableData1" :loading="JSON.stringify(this.resData) == '{}'"></Table>
        <Page :total="Number(resData.totalCount)" :current="current" :page-size="pageSize" show-total @on-change="jumpToPage" show-sizer :page-size-opts="[10, 15, 20]" @on-page-size-change="getTableDataBypagesize" v-if="this.resData.totalCount"></Page>
    </div>
</template>

<script>
    import {today,sevenDays,thirtyDays} from './../../assets/js/getDate.js'
    export default {
        data() {
            return {
                btn_today:'ghost',
                btn_aWeek:'ghost',
                btn_aMonth:'ghost',
                pageSize:10,
                // 当前页码
                current: 1,
                resData:{},
                form:{
                    // 开始日期
                    start: '',
                    // 结束日期
                    end: '',
                    keywords:'',
                    // 用户类型select
                    userType: [{
                            value: '99',
                            label: '全部'
                        },
                        {
                            value: '2',
                            label: '个人用户'
                        },
                        {
                            value: '3',
                            label: '电子送达用户'
                        },
                        {
                            value: '4',
                            label: '机构用户'
                        },
                        {
                            value: '5',
                            label: '公证书查询用户'
                        },
                        {
                            value: '6',
                            label: '中介机构用户'
                        },
                        {
                            value: '15',
                            label: '第三方用户'
                        },
                    ],
                    userTypeDefault: '99',
                    // 证据类型
                    storageType: [{
                            value: '99',
                            label: '全部'
                        },
                        {
                            value: '1',
                            label: '网页取证'
                        },
                        {
                            value: '2',
                            label: '版权保护'
                        },
                        {
                            value: '4',
                            label: '电话录音'
                        },
                        {
                            value: '5',
                            label: '手机拍照'
                        },
                        {
                            value: '6',
                            label: '手机录像'
                        },
                        {
                            value: '7',
                            label: '邮件证据'
                        },
                        {
                            value: '8',
                            label: '现场录音'
                        },
                        {
                            value: '9',
                            label: '文档证据'
                        },
                        {
                            value: '10',
                            label: '电子签约'
                        },
                        {
                            value: '11',
                            label: '图片存证'
                        },
                        {
                            value: '12',
                            label: '知识产权'
                        },
                        {
                            value: '13',
                            label: '短信证据'
                        },
                        {
                            value: '14',
                            label: '直播录像'
                        },
                        {
                            value: '15',
                            label: '手机屏幕录像'
                        },
                        {
                            value: '20',
                            label: '见证实录'
                        },
                    ],
                    storageTypeDefault: '99',
                },
                // 表格
                columns1: [
                    {
                        title: '序号',
                        key: 'seq',
                        width : 80,
                        align: 'center',
                    },
                    {
                        title: '消费时间',
                        key: 'createDate',
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
                        title: '公证保管费单价（元）',
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
                        title: '抵扣水晶币（币）',
                        key: 'crystalMoney',
                        align: 'center',
                    },
                    {
                        title: '公证保管实收公证币（币）',
                        key: 'orgPercentToken',
                        align: 'center',
                    },
                    {
                        title: '公证保管费（元）',
                        key: 'orgPercentTokenMoney',
                        align: 'center',
                    },
                ],
                tableData1: []
            }
        },
        methods: {
            // 修改每页显示条数
            getTableDataBypagesize(pagesize){
                this.pageSize = pagesize
                this.getTableData(1)
            },
            // 选择时间段 今天 昨天 前7天 前30天
            chooseDateHandle(timeSlot){
                let dateObj = {}
                switch (timeSlot) {
                    case 'today':
                        this.btn_today = 'primary'
                        this.btn_aWeek = 'ghost'
                        this.btn_aMonth = 'ghost'
                        dateObj = today()
                        this.form.start = dateObj.t1
                        this.form.end = dateObj.t2
                        break
                    case 'aWeek':
                        this.btn_today = 'ghost'
                        this.btn_aWeek = 'primary'
                        this.btn_aMonth = 'ghost'
                        dateObj = sevenDays()
                        this.form.start = dateObj.t1
                        this.form.end = dateObj.t2
                        break
                    case 'aMonth':
                        this.btn_today = 'ghost'
                        this.btn_aWeek = 'ghost'
                        this.btn_aMonth = 'primary'
                        dateObj = thirtyDays()
                        this.form.start = dateObj.t1
                        this.form.end = dateObj.t2
                        break
                }
            },
            // 日期改变            
            dateChange(){
                this.btn_today = 'ghost'
                this.btn_aWeek = 'ghost'
                this.btn_aMonth = 'ghost'
            },
            // 清空日期
            handleClearStart(){
                this.form.start = thirtyDays().t1
                this.btn_today = 'ghost'
                this.btn_aWeek = 'ghost'
                this.btn_aMonth = 'ghost'
            },
            // 清空日期
            handleClearEnd(){
                this.form.end = thirtyDays().t2
                this.btn_today = 'ghost'
                this.btn_aWeek = 'ghost'
                this.btn_aMonth = 'ghost'
            },
            // 重置
            searchArea_reset(name){
                this.$refs[name].resetFields();
                this.form.start = thirtyDays().t1
                this.form.end = thirtyDays().t2
                this.btn_today = 'ghost'
                this.btn_aWeek = 'ghost'
                this.btn_aMonth = 'primary'
            },
            // 分页跳转
            jumpToPage(page){
                this.getTableData(page,this.order)
            },
            // 获取表格数据
            getTableData(page,order) {
                console.log(this.form.start)
                console.log(this.form.end)
                console.log(this.form.keywords)
                console.log(this.form.storageTypeDefault)
                console.log(this.form.userTypeDefault)
                this.current = page
                this.$http.get('/orgConsumption/order/queryOrder.action', {params:{
                    sysUserToken: this.$store.state.token,
                    beginTime: this.form.start,
                    endTime: this.form.end,
                    keywords:this.form.keywords,
                    storageType:this.form.storageTypeDefault,
                    // orgId: this.form.orgId,
                    userType: this.form.userTypeDefault,
                    pageNo: page,
                    pageSize: this.pageSize,
                }}).then(response => {
                    if (response.data.code == 200) {
                        console.log(response)
                        console.log(response)
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
                subNavigation: '消费查询',
                name: 'Consume',
                second: true,
            });
            // 默认显示最近30天
            this.chooseDateHandle('aMonth')
            // 表格初始化，显示第一页
            this.getTableData(1)
        },
    }
</script>

<style scoped>

</style>