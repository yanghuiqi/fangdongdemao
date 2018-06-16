import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import List from '@/pages/List'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'

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
        path: '/list',
        name: 'List',
        component: List
      },
      {
          path: '/signIn',
          name: 'signIn',
          component: signIn
        }
  ]
})
