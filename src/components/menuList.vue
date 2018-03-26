<template>
    <div class="menuList">
        <Menu ref="menu" accordion :active-name="getPosition.name" width="auto" :open-names="[getPosition.primaryNavigation]" @on-select="turnUrl">
            <Submenu name="财务报表">
                <template slot="title">
                    <Icon type="ios-navigate"></Icon>
                    财务报表
                </template>
                <MenuItem name="Consume">消费查询</MenuItem>
                <MenuItem name="CustodyUnfinished">未结算完结账单</MenuItem>
                <MenuItem name="CustodyFinished">结算成功账单</MenuItem>
                <MenuItem name="TallyOrder">结算订单</MenuItem>
            </Submenu>
            <Submenu name="系统信息设置">
                <template slot="title">
                    <Icon type="ios-keypad"></Icon>
                    系统信息设置
                </template>
                <MenuItem name="BillingMan">银行账户设置</MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>
<script>    
import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                theme2: 'light',
            }
        },
        computed: {
            ...mapGetters([
                'getPosition',
                'getGeneratedRouters'
             ]),  
        },
        watch:{
            getPosition(){
                this.$nextTick(function(){
                    this.$refs.menu.updateOpened();
                    this.$refs.menu.updateActiveName();
                });
            }
        },
        methods: {
            turnUrl(names) {
                // 在右侧显示相应页面
                this.$router.push({
                    name: names
                });
            },
        }
    }
</script>

<style scoped>
    
</style>