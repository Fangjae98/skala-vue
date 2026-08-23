import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WeatherHomeView,
    },
    {
      path: '/weather/:cityId',
      name: 'city',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/sunmap',
      name: 'sunmap',
      component: () => import('../views/SunMap.vue'),
    },
    {
      path: '/learning',
      name: 'learning',
      component: () => import('../views/LearningLogView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
