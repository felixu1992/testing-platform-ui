<template>
    <div v-if="!this.isHomeRoute" class="common-breadcrum">
        <a-breadcrumb separator=">">
            >&nbsp; <a-breadcrumb-item v-bind:key='path.path' v-for="path in paths">
                <span>
                    <a @click="routeTo(path.completePath)">{{path.name}}</a>
                </span>
            </a-breadcrumb-item>
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
                let currRoute = '';
                for(let i = 1; i < paths.length ; i++){
                    let singleLevelPath = paths[i];
                    let bingo = this.findFromCurrentRoute(singleLevelPath,routes);
                    if(bingo){
                        currRoute += bingo.path[0] === '/' ? bingo.path : '/' + bingo.path;
                        bingo.completePath = currRoute;
                        result.push(bingo);
                        routes = bingo.children;
                    }

                }
                return result;
            },
            findFromCurrentRoute(path,routes){
                for(let i = 0; i < routes.length; i++){
                    let route = routes[i];
                    if(route.path === path || route.path === '/' + path){
                        return route;
                    }
                }
            }
        },
        computed:{
            paths : function(){
                let currentPath = this.$store.state.currentRoute;
                if(currentPath === '/'){
                    return [{path:'/' , name:'Home'}]
                }else {
                  let paths = currentPath.split('/');
                  return this.getPathsObjects(paths);
                }

            },

            isHomeRoute : function(){
                let currentRoute = this.$store.state.currentRoute;
                return currentRoute === '/'
            }
        }
    }
</script>
<style scoped>
@import "common-breadcrumb.css";
</style>
