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
        data(){
            return {}
        },
        methods: {
            getPathsObjects(paths){
                let result = [];
                let routes = this.$router.options.routes;
                //paths的第一个元素肯定是 空字符串 所以从 index=1 的位置开始迭代
                let currRoute = null;
                for(let i = 1; i < paths.length ; i++){
                    let singleLevelPath = paths[i];
                    let bingo = this.findFromCurrentRoute(singleLevelPath,routes);
                    if(bingo){
                        result.push(bingo);
                        routes = bingo.children;
                    }
                }
                return result;
            },
            findFromCurrentRoute(path,routes){
                for(let i = 0; i < routes.length; i++){
                    let route = routes[i];
                    if(route.path == path || route.path == '/' + path){
                        return route;
                    }
                }
            }
        },
        computed:{
            paths : function(){
                let currentPath = this.$store.state.currentRoute;
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