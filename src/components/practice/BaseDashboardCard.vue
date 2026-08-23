<template>
  <el-card class="base-dashboard-card" shadow="never">
    <slot></slot>
  </el-card>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 15px;
}
.base-dashboard-card {
  background: var(--app-card-bg);
  border: 1px solid var(--app-border);
}
</style>
