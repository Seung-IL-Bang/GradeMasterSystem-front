import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('../components/StudentPage.vue')
    },
    {
      path: '/exam',
      name: 'exam',
      component: () => import('../components/Exam.vue')
    },
    {
      path: '/professor',
      name: 'professor',
      component: () => import('../components/ProfessorPage.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../components/Test.vue')
    }
  ]
})

export default router