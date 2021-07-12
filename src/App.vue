<template>
  <div>
    <form>
      <multiselect v-model="stateValue" track-by="name" label="name" :options="states" @select="getCity" placeholder="select states"></multiselect>
      <multiselect v-model="cityValue" :options="cities" placeholder="select cities"></multiselect>
      <multiselect v-model="productValue" track-by="product" label="product" :options="products" @select="getCost" :searchable="false" placeholder="select products"></multiselect>
    </form>
    <div>quantity: <input @input="getQuantity">/{{maxQuantity}} cost: {{cost}}</div>
    <div>total cost: {{cost*customerQuantity}}</div>
  </div>
</template>

<script>
import axios from 'axios'
//import HelloWorld from './components/HelloWorld.vue'
import Multiselect from 'vue-multiselect'

export default {
  name: 'App',
  data(){
    return {
      stateValue:null,
      cityValue:'',
      productValue:'',
      states: [],
      cities: [],
      products: [],
      cost: 0,
      customerQuantity: 0,
      maxQuantity: 100,
    }
  },
  components: {
    Multiselect
  },
  beforeMount() {
    const headers = new Headers();
    headers.append("X-CSCAPI-KEY", "YXFqZEJsWWpEbFFzSFNBb0ZKNkhTRVZ2SEhlc1dxUTBsOEd3dlhERA==");
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    
    fetch("https://api.countrystatecity.in/v1/countries/IN/states", requestOptions)
      .then(response => response.json())
      .then(result => {
        result.forEach(state => {
          this.states.push({name: state.name, abb: state.iso2})
        })
      })
      .catch(error => console.log('error', error));
    
    axios.get("http://localhost:3000")
    .then(response=>{
      this.products=response.data
    })
  },
  methods: {
    getCity (stateName) {
      const stateAbbr = stateName.abb

      var headers = new Headers();
      headers.append("X-CSCAPI-KEY", "YXFqZEJsWWpEbFFzSFNBb0ZKNkhTRVZ2SEhlc1dxUTBsOEd3dlhERA==");

      var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      };

      fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateAbbr}/cities`, requestOptions)
        .then(response => response.json())
        .then(result => result.forEach(city => {
          this.cities.push(city.name)
        }))
        .catch(error => console.log('error', error));
    },
    getCost (productName) {
      this.cost = productName.cost
      this.maxQuantity = productName.max_quantity
    },
    getQuantity(e){
      if(parseInt(e.target.value)>this.maxQuantity){
        alert("that much quantity we don't have, so we will replace that with the maximum we have")
        this.customerQuantity=this.maxQuantity
      } else {
      this.customerQuantity=e.target.value
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>