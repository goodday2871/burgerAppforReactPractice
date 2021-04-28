import React, { Component } from 'react'
import Aux from '../../../hoc/AuxiliaryEl/Auxiliary'
import Button from '../../UI/Button/Button'



class OrderSummary extends Component{
  componentDidUpdate(){
    
  }
  render(){
    const ingredientSummary = Object.keys(this.props.ingredients)
    .map(igKey=>{
        return (
        <li key={igKey}><span style={{textTransform:'capitalize'}}>{igKey}</span> : {this.props.ingredients[igKey]}</li>
        )
    })
    return(
      <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with following ingredients ! </p>
            <ul>
              {ingredientSummary}
            </ul>
            <p><strong>Total Price : {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout ? </p>
            <Button btnType={'Danger'} clicked={this.props.cancel}>CANCEL</Button>
            <Button btnType={'Success'} clicked={this.props.continued}>Continue</Button>
        </Aux>
    )
}
}

export default OrderSummary