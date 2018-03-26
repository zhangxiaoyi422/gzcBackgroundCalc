<template>
    <div class="index">
        <div class="viewport">
            <div class="main-wrapper clearfix">
                <!--<MenuList></MenuList>-->
                <!--<BreadCrumb></BreadCrumb>-->
                <div class="main-right">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MenuList from "../components/menuList"
    import BreadCrumb from "../components/breadCrumb"
    export default {
        name: 'index',
        components: {
            MenuList,
            BreadCrumb
        },
    }
</script>

<style>
    .index {
        height: 100%
    }
</style>