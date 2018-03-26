<template>
    <div>
        <Menu mode="horizontal" :theme="theme1" :active-name="getPosition.secondName" @on-select="turnUrl">
            <template v-for="item in getGeneratedRouters" v-if="!item.hidden">
                <template v-for="child in item.children" v-if="!child.hidden">
                    <template v-for="child_child in child.children" v-if="!child_child.hidden">
                        <MenuItem :name="child_child.name">{{child_child.nameCN}}</MenuItem>
                    </template> 
                </template> 
            </template>
        </Menu>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                theme1: 'light'
            }
        },
        methods: {
            turnUrl(names) {
                // 在右侧显示相应页面
                this.$router.push({
                    name: names
                });
            },
        },
        computed:{
            ...mapGetters([
                'getPosition',
                'getGeneratedRouters'
             ]), 
        },
        mounted() {
        }
    }
</script>

<style scoped>
.ivu-menu-item-selected{
    background:#fff
}
.ivu-menu-item{border-right:0}
</style>