<template class="container">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="row">
          <span>Name</span>
          <input v-model="name" placeholder="이름을 입력하세요."/>
        </div>
        <div class="row">
          <span>Korean</span>
          <input v-model="korean" type="number"/>
        </div>
        <div class="row">
          <span>English</span>
          <input v-model="english" type="number"/>
        </div>
        <div class="row">
          <span>Math</span>
          <input v-model="math" type="number"/>
        </div>
        <div class="row">
          <span>Social</span>
          <input v-model="social" type="number"/>
        </div>
        <div class="row">
          <span>Science</span>
          <input v-model="science" type="number"/>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-btn" @click="saveData(getFormObj())">
              Save
            </button>
            <button class="modal-btn" @click="$emit('close')">
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const name = ref('');
    const korean = ref(0);
    const english = ref(0);
    const math = ref(0);
    const social = ref(0);
    const science = ref(0);

    const resetValues = () => {
      name.value = '';
      korean.value = 0;
      english.value = 0;
      math.value = 0;
      social.value = 0;
      science.value = 0;
    }

    const getFormObj = () => {
      return {
        'name': name.value,
        'korean': korean.value,
        'english': english.value,
        'math': math.value,
        'social': social.value,
        'science': science.value
      }
    }

    // 반환된 변수들은 템플릿에서 사용 가능
    return {
      name,
      korean,
      english,
      math,
      social,
      science,
      resetValues,
      getFormObj
    };
  },

  methods: {
    saveData(formObj) {
      fetch(`http://localhost:8080/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObj)
      }).then(async res => {
        if(!res.ok) {
          const errorResponse = await res.json() // async - await가 없으면 errorResponse.message 가 undefined 된다.
          const errorMessage = errorResponse.message || '잘못된 입력값을 넣었습니다.'
          alert(errorMessage); // TODO: custom message alert
          throw new Error(`HTTP ERROR Status: ${res.status}`)
        }
        this.resetValues()
        location.reload()
      }).catch(error => {
        console.log('Error Adding Data: ', error)
        this.resetValues()
      })
    },
  }
}
</script>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.row span, .row input {
  padding-left: 0;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 30px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-btn {
  margin: 3px;
  background-color: #42b983;
  border-color: #42b983;
  color: #fff;
  border: 1px solid transparent;
}
.modal-btn:hover {
  background-color: #3ba374;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>