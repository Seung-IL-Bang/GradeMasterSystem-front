<template>
<h1>test</h1>
<div>{{ this.stub }}</div>
</template>

<script>

export default {

  /* hook 흐름도
    setup() => data() => created() => mounted()
  */

  setup() { 
    console.log('setup() !!!') // 1
    //this.test2() // computed 사용 불가; error 발생
  },

  props: {
    // => 사용 가능 영역: data(), created(), mounted()
    // => 사용 불가 영역: setup() undefined error
    stub: String
  },

  data() {
    console.log('data() !!!') // 2
    this.test('in data()') // 3
    //this.test2() // computed 사용 불가; undefined
    return {
      a: 1
    }
  },

  watch: {
    // => 데이터 변경 이후 발동
    // => 데이터가 변경이 일어나는 곳: computed, methods
    a(newVal, oldVal) {
      console.log('watch callback') // 13, 19
      console.log(oldVal, '->', newVal) // 14, 20
    }
  },

  computed: {
    // => 사용 가능 영역: created(), mounted()
    // => 사용 불가 영역: setup(), data()
    decorator: {
      get() {
        console.log('computed: get') // 6, 10
        return this.a + 1
      },
      set(v) {
        console.log('computed: set') // 9, 18 
        this.$data.a = v
      }
    }
  },

  created() { 
    console.log('created() !!!') // 4

    console.log('created: this.a', this.a) // 5
    console.log('created: this.decorator', this.decorator) // 7
    console.log('decorator set 2') // 8
    this.decorator = 2; 
    console.log('created: this.decorator', this.decorator) // 11

    this.test('in created()') // 12
  },

  mounted() {
    console.log('mounted() !!!') // 15

    this.test('in mounted()') // 16
    this.test2()
  },

  methods: { 
    // => 사용 가능 영역: data(), created(), mounted(), 
    // => 사용 불가 영역: setup(), 
    test(when) {
      console.log('methods !!!', when)
      console.log('props: ', this.stub)
    },
    test2() {
      console.log(this.decorator) // 17
      this.decorator = 3;
    }
  }
  

}


</script>

<style scoped>

</style>