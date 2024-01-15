<template>
  <div class="overflow-auto">
    <b-pagination
      class="my-page"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      @click="$emit('fetchPaging', currentPage, size)"
    ></b-pagination>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    },

    data() {
      return {
        perPage: 5,
        size: 5,
        currentPage: 1,
        list: this.items
      }
    },
    computed: {
      rows() {
        return this.total
      }
    },
    method: {

    }
  }
</script>

<style scoped lang="css">

.my-page::v-deep .page-link {
  color: #77ae77;
}

.my-page::v-deep .page-link:focus {
  background-color: #04AA6D;
}


.my-page::v-deep .page-link.active,
.my-page::v-deep .page-item.active > .page-link {
  color: white; /* 변경하고자 하는 활성화된 페이지 번호의 텍스트 색상 */
  background-color: #04AA6D; /* 변경하고자 하는 활성화된 페이지 번호의 배경색 */
  border-color: #04AA6D; /* 변경하고자 하는 활성화된 페이지 번호의 테두리 색상 */
}

/* https://github.com/bootstrap-vue/bootstrap-vue/issues/4597 */


</style>