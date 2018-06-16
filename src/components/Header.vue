<template>
    <div class="container">
            <el-menu :default-active="active" :router="true" class="el-menu-demo"   mode="horizontal" @select="handleSelect">
                <el-menu-item index="/" class="logo">房东的猫</el-menu-item>
                <el-menu-item index="/list"><i  class="fa fa-flag " aria-hidden="true"></i>探索</el-menu-item>
                <template v-if="user">
                   
                         <li class="el-menu-item right" @click="handleExit" ><i  class="fa fa-sign-out "   aria-hidden="true"></i>注销</li>
                         <el-submenu index="4" class="right">
                           <span slot="title">{{user.getUsername()}}</span>
                             <el-menu-item index="5-1">
                                 个人中心 
                             </el-menu-item>
                                <el-menu-item index="5-2">
                                发布文章
                             </el-menu-item>
                                <el-menu-item index="5-3">
                                消息
                             </el-menu-item>
                         </el-submenu>
                         
                </template>
                <template v-else>
                        <el-menu-item index="/signUp" class="right" ><i  class="fa fa-user-o " aria-hidden="true"></i>注册</el-menu-item>
                        <el-menu-item index="/signIn" class="right" ><i  class="fa fa-key " aria-hidden="true"></i>登录</el-menu-item> 
                </template>
                </el-menu>
    </div>
</template>
<script>
import { mapState ,mapActions } from "vuex"
export default {
  name: "Header",
  data() {
    return {
        active: '/',
    };
  },
  computed: mapState(["user"]),
  created() {
    this.active = this.$route.path;
    this.$router.afterEach((to, form) => {
      this.active = to.path;
    });
  },
  mounted() {
 
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    ...mapActions(['exit']),
    handleExit(){
        this.exit();
        this.$api.SDK.User.logOut()
        this.$message.success("成功退出")
    },
  }
};
</script>
<style scoped lang="css">
.container {
  padding: 0 10%;
  background: #eef1f6;
}
ul {
  background: #eef1f6;
}
.right {
  float: right;
}
.el-menu-item i {
  color: #909399;
  padding: 0 10%;
}
.el-menu-item {
  text-align: center;
}
.logo:first-child {
  margin-left: 0;
  font-size: 25px;
  font-weight: 100;
  background: #20a0ff;
  color: #fff;
}
.logo:first-child:hover {
  background: #20a0ff;
}
</style>

