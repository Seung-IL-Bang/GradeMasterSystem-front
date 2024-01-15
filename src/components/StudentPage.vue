<template>
  <div class="inner">
    <form @submit.prevent>
      <input
        v-model="studentId" 
        placeholder="학생 ID"/>
      <button 
        @click="fetchStudent(studentId)">Search</button>
    </form>
    <div v-if="studentData">
      <table class="list">
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Korean</th>
          <th>English</th>
          <th>Math</th>
          <th>Social</th>
          <th>Science</th>
          <th>Sum</th>
          <th>Avg</th>
        </tr>
        <tr>
          <td>{{ studentData.id }}</td>
          <td>{{ studentData.name }}</td>
          <td>{{ studentData.korean }}</td>
          <td>{{ studentData.english }}</td>
          <td>{{ studentData.math }}</td>
          <td>{{ studentData.social }}</td>
          <td>{{ studentData.science }}</td>
          <td>{{ studentData.sum }}</td>
          <td>{{ studentData.avg }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentId: null,
      studentData: null
    }
  },
  methods: {
    fetchStudent(studentId) {
      fetch(`http://localhost:8080/student/${studentId}`)
        .then(async res => {
          if(!res.ok) {
            const errorResponse = await res.json()
            const errorMessage = errorResponse.message || "해당 학생은 존재하지 않습니다."
            alert(errorMessage)
            throw new Error(`HTTP ERROR! Status: ${res.status}`)
          } else {
            return res.json()
          }
        })
        .then(data => {
          this.studentData = data
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.clear()
        });
    },

    clear() {
      this.studentId = null
    }
  }
}
</script>


<style scoped>
  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .inner form {
    margin: 10px;
  }

  .list {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  .list th, .list td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .list th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
  }
</style>