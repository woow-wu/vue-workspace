<template>
  <div>
    <div v-for="item in menuData" :key="item.name">
      <div v-if="item.children">
        <el-submenu :index="item.name">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.menuName}}</span>
          </template>
          <RecursionLeftMenu :menuData="item.children" />
        </el-submenu>
      </div>
      <div v-else>
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{item.menuName}}</span>
        </el-menu-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecursionLeftMenu",
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  }
};
</script>
