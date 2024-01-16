<template>

  <h1>Exam Page</h1>
  <div>채점 대상자: {{ this.$data.examParticipants }}</div>
  <button @click="processSubjectsSequentially('korean')">
    채점하기
  </button>

  <div>
    <div>subject 진행중</div>
    <b-progress :value="value" :max="max" show-progress animated></b-progress>
  </div>

<!-- processOMR 진행 시 스피너 표시 -->

</template>

<script>


export default {

  data() {
    return {
      examParticipants: null, // 채점 대상자(이름, 학번) 목록을 응답을 받기
      subjects: ['korean', 'english', 'math', 'social', 'science'],
      value: 0,
      max:100,
    }
  },

  mounted() {
    this.fetchParticipants();
  },

  methods: {
    async processSubjectsSequentially() { // TODO: findAll이 아닌 참여한 participants 로 쿼리 수정
      for (const subject of this.subjects) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.processSubject(subject);
        this.value += 20
      }
    },

    processSubject(subject) {
      return fetch(`http://localhost:8080/omr/process?subject=${subject}`, {
          method: 'POST'
      })
      .then(res => {
          console.log(`Subject ${subject} complete!`);
          console.log(res);
      })
    },

    fetchParticipants() {
      fetch('http://localhost:8080/student/exam/list')
        .then(res => {
          if(!res.ok) {
            throw new Error(`HTTP ERROR Status: ${res.status}`)
          }
          return res.json()
        }).then(data => {
          this.examParticipants = data;
        }).catch(error => {
          console.error('Error updating data:', error);
        })
    },
  }

}

</script>

<style scoped>

</style>