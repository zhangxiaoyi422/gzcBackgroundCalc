<template>
    <Breadcrumb separator="<b class='demo-breadcrumb-separator'>></b>">
        <BreadcrumbItem>{{getPosition.primaryNavigation}}</BreadcrumbItem>
        <BreadcrumbItem v-if="getPosition.second" @click.native='jumpTo(getPosition.name)' style="cursor:pointer">{{getPosition.subNavigation}}</BreadcrumbItem>
        <BreadcrumbItem v-if="getPosition.third" @click.native='jumpToThird(getPosition.secondName)' style="cursor:pointer"> {{getPosition.thirdNavigation}}</BreadcrumbItem>
        <BreadcrumbItem v-if="getPosition.fourth" @click.native='jumpToForth(getPosition.thirdName)' style="cursor:pointer">{{getPosition.fourthNavigation}}</BreadcrumbItem>
        <BreadcrumbItem v-if="getPosition.fifth" style="cursor:pointer">{{getPosition.fifthNavigation}}</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fourth: false
    };
  },
  computed: {
    ...mapGetters(["getPosition"])
  },
  methods: {
    jumpTo(names) {
      this.$router.push({ name: names });
    },
    jumpToThird(names) {
      if (this.getPosition.fourth == true) {
        this.$router.push({
          name: names,
          params: {
            userId: this.getPosition.userId
          }
        });
      }
    },
    jumpToForth(names) {

        this.$router.push({
          name: names,
        });

    },
  }
};
</script>
<style>
.demo-breadcrumb-separator {
  color: #898989;
  padding: 0 5px;
}
</style>

