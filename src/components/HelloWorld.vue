<template>
    <div class="container">
       welcome 房东的猫
    </div>
</template>
<script>
    export default {
        name :'Header',
        data(){
            return{
                active: '0'
            }
        },
        methods:{
            handleSelect(key,keyPath){
                console.log(key,keyPath)
            }
        }
    }
</script>
<style scoped lang="css">
   .container{
       text-align: center;
       line-height: 50px;
   }
</style>

