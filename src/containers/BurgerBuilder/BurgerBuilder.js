import React, { Component } from 'react'

import Aux from '../../hoc/AuxiliaryEl/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';

//global var for price
const INGREDIENTS_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat:1.3,
    bacon:0.7
}

class BurgerBuilder extends Component{

    state = {
        ingredients:null,
        totalPrice:4,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    }
    // fetch data or side effect at this life-cycle
    componentDidMount(){
        axios.get('https://burger-builder-eb32e-default-rtdb.firebaseio.com/ingredients.json')
        .then(res=>{
            this.setState({ingredients: res.data})
        })
        .catch(err =>{
            this.setState({error: true})
        })
    }
    //control Modal that showing ingredients for purchasing burger
    purchaseHandler=()=>{
        this.setState({purchasing:true})
    }

    //check the burger purchaseable
    updatePurchaseState =(ingredients)=>{
        const sum = Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey]
        })
        .reduce((sum, el)=>sum + el,0);
        this.setState({purchasable: sum > 0})   
    }

    // for controls add ingredient
    addIngredientHandler =(type)=>{ 
        // add count
        const updatedCounted = this.state.ingredients[type] + 1;
        //deep copy prevent store pointer to state obj
        const updatedIngredient = {
            ...this.state.ingredients
        }
        //update value
        updatedIngredient[type] = updatedCounted
        //update total price 
        const newPrice = this.state.totalPrice + INGREDIENTS_PRICES[type]
        //set state
        this.setState({
            totalPrice:newPrice,
            ingredients:updatedIngredient
        })
        this.updatePurchaseState(updatedIngredient)
    }
    //for controls remove ingredient
    removeIngredientHandler = (type)=>{
         // minus count
         const updatedCounted = this.state.ingredients[type] - 1;
         //prevent negative number
         if(updatedCounted<0){
             return 
         }
         //deep copy prevent store pointer to state obj
         const updatedIngredient = {
             ...this.state.ingredients
         }
         //update value
         updatedIngredient[type] = updatedCounted
         //update total price 
         const newPrice = this.state.totalPrice - INGREDIENTS_PRICES[type]
         //set state
         this.setState({
             totalPrice:newPrice,
             ingredients:updatedIngredient
         })
         this.updatePurchaseState(updatedIngredient)
    }
        purchaseCancelHandler = ()=>{
            this.setState({purchasing:false})
        }
        purchaseContinueHandler = ()=>{
            const queryParams = [];
            for (let i in this.state.ingredients){
                queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
            }
            queryParams.push(`price=${this.state.totalPrice}`);
            const queryString = queryParams.join('&');
            this.props.history.push({
                pathname: '/checkout',
                search:'?' + queryString
            });
        }

    render(){
        const disabledInfo={
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0
        }
        let burger = this.state.error ? <p>Something get wrong</p> : <Spinner />;
        let orderSummary = null
        if(this.state.ingredients){
            burger =  (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemove={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}/>
                </Aux>);
                orderSummary = <OrderSummary 
                ingredients={this.state.ingredients} 
                continued={this.purchaseContinueHandler} 
                cancel={this.purchaseCancelHandler}
                price={this.state.totalPrice}/> 
        }
       
        
        if (this.state.loading){
            orderSummary = <Spinner />
        }
        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing} 
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios)