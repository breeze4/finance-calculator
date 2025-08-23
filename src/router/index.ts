import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/coast-fire',
    name: 'CoastFIRE',
    component: () => import('../views/CoastFireCalculator.vue')
  },
  {
    path: '/mortgage-payoff',
    name: 'MortgagePayoff',
    component: () => import('../views/MortgagePayoffCalculator.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router