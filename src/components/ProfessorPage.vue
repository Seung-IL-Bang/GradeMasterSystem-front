<template>
  <div class="inner">
    <Loading v-if="!this.studentListData"></Loading>
    <table v-else class="list">
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
        <th></th>
        <th></th>
      </tr>
      <tr v-for="(studentData, index) in studentListData" :key="index">
        <td>
          <span>{{ studentData.id }}</span>
        </td>
        <td>
          <span>{{ studentData.name }}</span>
        </td>
        <td>
          <span v-if="!editing[index]">{{ studentData.korean }}</span>
          <input v-else v-model="studentData.korean" type="number"/>
        </td>
        <td>
          <span v-if="!editing[index]">{{ studentData.english }}</span>
          <input v-else v-model="studentData.english" type="number"/>
        </td>
        <td>
          <span v-if="!editing[index]">{{ studentData.math }}</span>
          <input v-else v-model="studentData.math" type="number"/>
        </td>
        <td>
          <span v-if="!editing[index]">{{ studentData.social }}</span>
          <input v-else v-model="studentData.social" type="number"/>
        </td>
        <td>
          <span v-if="!editing[index]">{{ studentData.science }}</span>
          <input v-else v-model="studentData.science" type="number"/>
        </td>
        <td>
          <span>{{ studentData.sum }}</span>
        </td>
        <td>
          <span>{{ studentData.avg }}</span>
        </td>
        <td>
          <button class="btn-cud" v-if="!editing[index]" @click="editData(index)">
            Edit
          </button>
          <button class="btn-cud" v-else @click="updateData(index, studentData)">
            Update
          </button>
        </td>
        <td>
          <button class="btn-cud" @click="isShow(studentData, index)">
            Remove
          </button>
        </td>
      </tr>
    </table>
    <button class="btn-cud" @click="isForm()">
      <span>Add</span>
    </button>
    <Pagination v-if="studentListData" :items="studentListData" :total="totalRows"
                @fetchPaging="fetchStudentList">
    </Pagination>
  </div>
  
  <!--Modal-->
  <Transition name="modal">
    <PostModal v-if="showForm" @close="closeFormCallback()"> 
    </PostModal>
  </Transition>
  <Transition name="modal">
    <DeleteModal v-if="showModal" @close="closeModalCallback()" @remove="removeCallback()">
      <template #header>
        <span>Warning !!!</span>
      </template>
      <template #body>
        <span>{{ modalData.name }}의 정보를 삭제하시겠습니까?</span>
      </template>
    </DeleteModal>
  </Transition>
</template>

<script>
import DeleteModal from './modal/DeleteModal.vue';
import PostModal from './modal/PostModal.vue';
import Loading from './Loading.vue'
import Pagination from './pagination/Pagination.vue'
import { Transition } from 'vue'

export default {
  data() {
        return {
            originListData: null,
            studentListData: null,
            editing: null,
            showModal: false,
            modalData: null,
            modalIndex: null,
            showForm: false,
            totalRows: null,
        };
    },
    mounted() {
      this.fetchStudentList(1, 5);
    },
    methods: {
        fetchStudentList(page, size) {
            fetch(`http://localhost:8080/student/list?page=${page}&size=${size}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP ERROR! Status: ${res.status}`);
              }
              return res.json();
            })
            .then(data => {
              this.studentListData = data.dtoList;
              this.totalRows = data.total;
              this.originListData = JSON.parse(JSON.stringify(data)); // 깊은 복사를 통한 참조 끊기
              this.editing = Array(this.studentListData.length).fill(false);
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        },
        editData(index) {
            this.editing[index] = !this.editing[index];
        },
        updateData(index, studentData) {
            this.editing[index] = !this.editing[index];
            const isDataChanged = this.isStudentDataChanged(studentData, this.originListData[index]);
            if (isDataChanged) { // 데이터의 변경이 존재하는 경우에만 UPDATE
                fetch(`http://localhost:8080/student/${studentData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                })
                    .then(async res => {
                    if (!res.ok) {
                        const errorResponse = await res.json() // async - await가 없으면 errorResponse.message 가 undefined 된다.
                        const errorMessage = errorResponse.message || '잘못된 입력값을 넣었습니다.'
                        alert(errorMessage);
                        // this.studentListData = this.originListData // 해당 구문이 Vue 인스턴스를 불능으로 만듦
                        throw new Error(`HTTP ERROR Status: ${res.status}`);
                    }
                    else {
                        return res.json();
                    }
                })
                  .then(updatedStudentData => {
                    this.studentListData[index] = updatedStudentData;
                    this.originListData = JSON.parse(JSON.stringify(this.studentListData));
                })
                    .catch(error => {
                    console.error('Error updating data:', error);
                    this.reloadPage(index); // TODO: 개별 row 만 원상 복구 하도록
                });
            }
        },
        isShow(studentData, index) {
          this.showModal = true
          this.modalData = studentData
          this.modalIndex = index
        },
        isForm() {
          this.showForm = true;
        },
        isStudentDataChanged(newData, oldData) {
          if(!oldData) { // ISSUE: 첫 mount 시 oldData undefined
            return true;
          }
          return (newData.korean !== oldData.korean ||
              newData.english !== oldData.english ||
              newData.math !== oldData.math ||
              newData.social !== oldData.social ||
              newData.science !== oldData.science);
        },
        reloadPage(index) {
            location.reload(); // TODO: 개별 row 만 원상 복구 하도록
        },
        closeModalCallback() {
          this.showModal = false;
        },
        closeFormCallback() {
          this.showForm = false;
        },
        removeCallback() {
          fetch(`http://localhost:8080/student/${this.modalData.id}`, {
            method: 'DELETE'
          }).then(res => {
            if(!res.ok){
              throw new Error(`HTTP ERROR Status: ${res.status}`)
            } else {
              this.studentListData.splice(this.modalIndex, 1)
            }
          })
          .catch(error => {
            console.log('Error Removing data: ', error)
          })
          this.showModal = false;
          location.reload();
        },
    },
    components: { DeleteModal, PostModal, Loading, Pagination }
}
</script>

<style scoped>
  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .list {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    margin: 10px;
  }

  .list th, .list td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  input {
      width: 35px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .list th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
  }

  /*
 * The following styles are auto-applied to elements with
 * <Transition name="modal"> when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-leave-active {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  transition: all 0.3s ease;
}

.btn-cud {
  margin: 3px;
  background-color: #42b983;
  border-color: #42b983;
  color: #fff;
  border: 1px solid transparent;
}
.btn-cud:hover {
  background-color: #3ba374;
}
</style>