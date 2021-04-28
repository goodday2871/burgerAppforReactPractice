import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/input'
class ContactData extends Component{
    state = {
        orderForm:{
            name:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your name'
                },
                value:'',
                validation:{
                    required : true
                },
                valid:false,
                touch:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Street'
                },
                value:'',
                validation:{
                    required : true
                },
                valid:false,
                touch:false
            },
            zipCode:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'ZIP CODE'
                },
                value:'',
                validation:{
                    required : true,
                    minLength:5,
                    maxLength:5
                },
                valid:false,
                touch:false
            },
            country:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required : true
                },
                valid:false,
                touch:false
            },
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your Mail'
                },
                value:'',
                validation:{
                    required : true
                },
                valid:false,
                touch:false
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[
                        {value:'fastest', displayValue: 'Fastest'},
                        {value:'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value:'fastest',
                validation:{
                    required : false
                },
                valid:true,
                touch:false
            },
        },
        formIsValid:false,
        loading:false
    }
    orderHandler = (e)=>{
        e.preventDefault();
         this.setState({loading:true});
            const formData = {};
            for(let formElementIdentifier in this.state.orderForm){
                formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value; 
            }
            const order = {
                ingredients:this.props.ingredients,
                price:this.props.totalPrice,
                orderData:formData
            }
            axios.post('orders.json', order)
                .then(res=>{
                    this.setState({loading:false});
                    this.props.history.push('/')
                })
                .catch(err=>{
                    this.setState({loading:false});
                    console.log(err);
                })
    }
    checkValidity(value, rules) {
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !=='' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength&& isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength&& isValid;
        }
        return isValid
    }

    inputChangedHandler = (inputIdentifier,event)=>{
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touch = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
            console.log(formIsValid)
        }
        this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid})
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            })
        }
        let form = ( <form onSubmit={this.orderHandler}>
            {formElementsArray.map(formElement=>(
                <Input
                    key={formElement.id} 
                    touch={formElement.config.touch}
                    shouldValidate={formElement.config.validation.required}
                    invalid={!formElement.config.valid}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    changed={this.inputChangedHandler.bind(this,formElement.id)}/>
            ))}
            <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
        </form>);
        if(this.state.loading){
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contract Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData