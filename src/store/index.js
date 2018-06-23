/**
 *  Author: YangHQ
 *  Description:
 *  Created on 2018-06-16 11:57:46.
 *  By Visual Studio Code.
 */
/**
 * Created by Administrator on 2017/6/23.
 */
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user:null
    },
    getters:{
        uid({user}){
            
            if(user) return user.id
            return false
        }
    },
    mutations: {
        setUser (state, user) {
            state.user = user
        },
    },
    actions: {
        exit(context){
            context.commit('setUser', null);
        },
        login(context, user){
            context.commit('setUser', user);
        }
    }
})

export default store