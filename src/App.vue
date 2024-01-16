<template>

  <div class="inner">
    <Header></Header> <!--배너-->

    <nav>
      <RouterLink to="/student">Student</RouterLink> <!--학생 조회 페이지-->
      <RouterLink to="/exam">Exam</RouterLink>
      <RouterLink to="/professor">Professor</RouterLink> <!--교수 조회 페이지-->
      <RouterLink to="/test">Test</RouterLink>
    </nav>
  </div>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

import Header from './components/Header.vue'


</script>

<style scoped>
  .inner {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  nav a{
    margin: 0 10px;
    border: 2px solid #ddd;
    text-decoration-line: none;
    color: black;
    padding: 5px;
    background-color: #04AA6D;
    color: white;
  }
  nav a:hover {
    background-color: #038757;
  }

</style>
