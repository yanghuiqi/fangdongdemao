import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ArticleList from '@/pages/List'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'
import ArticleCreate from '@/pages/article/create'
import ArticleShow from '@/pages/article/index'
import ArticleEdit from '@/pages/article/edit'


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/signUp',
            name: 'signUp',
            component: signUp
        },
        {
            path: '/article',
            name: 'ArticleList',
            component: ArticleList
        },
        {
            path: '/signIn',
            name: 'signIn',
            component: signIn
        },
        {
            path: '/article/create',
            name: 'ArticleCreate',
            component: ArticleCreate,
            meta: {
                needLogin: true
            }
        },
        {
            path: '/article/:id',
            name: 'ArticleShow',
            component: ArticleShow,
           
        },
        {
            path: '/article/:id/edit',
            name: 'ArticleEdit',
            component: ArticleEdit,
            meta: {
                needLogin: true
            }
          },
      

    ]
})
