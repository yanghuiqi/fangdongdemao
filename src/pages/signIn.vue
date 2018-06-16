<template>
   <div class="containers">
        <h1>登录</h1>
            <el-form :model="user"  :rules="rules" ref="form" label-width="80px" >
                <el-form-item label="用户名" prop="name">
                 <el-input v-model="user.name" ></el-input>
            </el-form-item>
          <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="user.pwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">登录</el-button>
          </el-form-item>
    </el-form>
   </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.user.cpwd !== "") {
          this.$refs.form.validateField("cpwd");
        }
        callback();
      }
    };

    return {
      user: {
        name: "",
        pwd: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 7,
            message: "长度在3到11个字符之间",
            trigger: "blur"
          }
        ],

        pwd: [
          {
            required: true,
            message: "必须填写",
            trigger: "blur"
          },
          {
            validate: validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        
            
         this.$api.SDK.User.logIn(this.user.name,this.user.pwd) .then(loginUser => {
              this.$store.dispatch("login", loginUser);
              this.$router.push({path:'/'})
              this.$message.success("登录成功");
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error.message);
            });
        } else {
          console.log("error submit!!");
          this.$message.error("错误了哦，请按正确规则填写");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.containers {
  padding: 100px 30%;
  min-height: calc(100vh-180px);
  text-align: center;
}
h1 {
  text-align: center;
  padding: 30px 0%;
  font-size: 40px;
  font-weight: 100;
  padding-left: 50px;
}
</style>
