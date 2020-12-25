<template>
    <div>
        <a-breadcrumb>
            /<a-breadcrumb-item v-bind:key='path.path' v-for="path in paths">{{path.name}}</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>
<script>
    export default{
        name:'CommonBreadcrumb',
        //此fullPath变量只为了刺激本组建进行渲染
        props:['fullPath'],
        data(){
            return {}
        },
        methods: {
            getPathsObjects(paths){
                let result = [];
                let routes = this.$router.options.routes;
                //todo
                return result;
            }
        },
        computed:{
            paths : function(){
                let currentPath = this.fullPath;
                if(currentPath == '/'){
                    return [{path:'/' , name:'Home'}]
                }else {
                    let paths = currentPath.split('/');
                    let result = this.getPathsObjects(paths);
                    return result;
                }
                
            }
        }
    }
</script>