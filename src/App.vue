<template>
    <div>
      <survey  v-if="survey" :survey="survey" ></survey>
    </div>
</template>

<script>
import * as SurveyVue from 'survey-vue'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'

const Survey = SurveyVue.Survey

export default {
  name: 'App',
  data(){
    return {
      states: [],
      cities: [],
      products: [],
      price:0,
      customQuantity:0,
      survey:null
    }
  },
  
  components: {
    Survey
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
          this.states.push({text:state.name, value:state.iso2})
        })
      })
      .then(()=>{
        const surveyValueChanged=(sender,options)=>{
          let max,customer

          if(options.value===model.getValue('quantity')){
            options.value = parseInt(options.value)
          }
          
          if(model.getValue('products')){
            max = parseInt(model.getValue('products').maximum)
            this.price=parseInt(model.getValue('products').cost)
            // console.log(max,this.price,"products value")
          }
          if(model.getValue('quantity')){
            customer = parseInt(model.getValue('quantity'))
            if(customer>max){
              alert("We do not have that much in stock. Replacing your quantity with the maximum we have")
              model.setValue('quantity',max)
              
            }
            model.setValue('calculatedCost',customer*this.price)
            // console.log(customer,"quantity")
          }

          if(!Number.isInteger(options.value)&&options.value.length<=2){
            this.getCity(options.value, json)
          }
        }
        let json = {
          questions: [
            {
                type: "dropdown",
                name: "state",
                title: "select state",
                isRequired: true,
                colCount: 0,
                choices:this.states
            },
            {
              type: "dropdown",
                name: "cities",
                title: "select city",
                isRequired: true,
                colCount: 0,
                choices: this.cities
            },
            {
              type: "dropdown",
              name: "products",
              title: "select product",
              isRequired: true,
              colCount: 0,
              choices: this.products
            },
            {
              type: "text",
              name: "quantity",
              title: "how much?",
              isRequired: true,
              colCount: 0,
              // inputType:"int",
              validators: [
                {
                    type: "numeric",
                }
              ],
            },
            {
              type: "text",
              mode: "display",
              readOnly: true,
              name: "calculatedCost",
              title: "total cost",
              colCount: 0,
            }
          ]
        } 

        const model = new SurveyVue.Model(json)
        this.survey = model
        
        model
        .onValueChanged
        .add(surveyValueChanged)
      })
      .catch(error => console.log('error', error));
    
    axios.get("http://localhost:3000")
    .then(response=>{
      let prod = []
      prod=response.data
      prod.forEach(item=>{
        this.products.push({text: item.product, cost:parseInt(item.cost), maximum:parseInt(item.max_quantity)})
      })
    })    
  },

  methods: {
    getCity (stateName) {
      let stateAbbr = stateName
      
      let headers = new Headers();
      headers.append("X-CSCAPI-KEY", "YXFqZEJsWWpEbFFzSFNBb0ZKNkhTRVZ2SEhlc1dxUTBsOEd3dlhERA==");
      const  requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      };

      fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateAbbr}/cities`, requestOptions)
        .then(response =>response.json())
        .then(result=>this.cities=result)
        .then(()=>{
          let cityNames = []
          this.cities.forEach(city=>{
            cityNames.push(city.name)
          })
          // console.log(cityNames,'cityNames')
          let q = this.survey.getQuestionByName('cities')
          q.choices=cityNames
          q
            .choicesByUrl
            .run()
        })
        .catch(error => console.log('error', error));
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>