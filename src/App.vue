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
      products: [],
      survey:null,
    }
  },
  
  components: {
    Survey
  },
  
  beforeMount() {
    axios.get("http://localhost:3000")
    .then(response=>{
      let prod = []
      prod=response.data
      prod.forEach(item=>{
        this.products.push({text: item.product, cost:parseInt(item.cost), maximum:parseInt(item.max_quantity)})
      })
    })
      .then(()=>{
        let json = {
          showQuestionNumbers: "off",
          elements: [
            {
              type: "paneldynamic",
              name: "items",
              title: "Items",
              keyName: "name",
              showQuestionNumbers: "off",
              templateTitle: "item #{panelIndex}",
              templateElements: [
                  {
                      type: "dropdown",
                      name: "state",
                      title: "select state",
                      isRequired: true,
                      colCount: 0,
                      choicesByUrl: {
                        url: "https://api.countrystatecity.in/v1/countries/IN/states",
                        titleName: "name",
                        valueName: "iso2"
                      }
                  },
                  {
                    type: "dropdown",
                      name: "cities",
                      title: "select city",
                      isRequired: true,
                      colCount: 0,
                      choicesByUrl: {
                        url: 'https://api.countrystatecity.in/v1/countries/IN/states/{panel.state}/cities',
                        valueName: 'name'
                      }
                  },{
                      type: "dropdown",
                      name: "products",
                      title: "select product",
                      isRequired: true,
                      colCount: 0,
                      choices: this.products
                    }, {
                      type: "text",
                      name: "quantity",
                      inputType: "number",
                      title: "Quantity:",
                      isRequired: true,
                      startWithNewLine: false,
                      validators: [
                        {
                          type:"expression",
                          // minValue: 0,
                          expression: '{panel.quantity}<={panel.products.maximum}',
                          text: "Please correct the quantity. The value exceeds our stock."
                        }
                      ]
                  }, {type: "expression",
                      name: "cost",
                      title: "Item Cost:",
                      expression: '{panel.products.cost}',
                      displayStyle: "currency",
                      currency: "INR",
                      startWithNewLine: false
                  },{type: "expression",
                      name: "total",
                      title: "Total Item Cost:",
                      expression: '{panel.quantity}*{panel.cost}',
                      displayStyle: "currency",
                      currency: "EUR",
                      startWithNewLine: false
                  }
              ],
              minPanelCount: 1,
              panelAddText: "Add another  item",
              panelRemoveText: "Remove item"
          }, {
              type: "panel",
              title: "Totals",
              elements: [
                  {
                      type: "expression",
                      name: "totalQuantity",
                      title: "Total  Quantity:",
                      expression: "sumInArray({items}, 'quantity')"
                  }, {
                      type: "expression",
                      name: "totalCost",
                      title: "Total Cost:",
                      expression: "sumInArray({items}, 'total')",
                      displayStyle: "currency",
                      currency: "INR",
                      startWithNewLine: false
                  }
              ]
            }
          ]
        };

        SurveyVue.ChoicesRestfull.onBeforeSendRequest = function(sender, options) {
          options.request.setRequestHeader("X-CSCAPI-KEY","YXFqZEJsWWpEbFFzSFNBb0ZKNkhTRVZ2SEhlc1dxUTBsOEd3dlhERA==");
        };

        const model = new SurveyVue.Model(json)
        this.survey = model
      })
      .catch(error => console.log('error', error));
    },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>