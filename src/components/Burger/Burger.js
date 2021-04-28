import React from 'react'

import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
const burger = (props)=>{
    //change props.ingredients from obj to arr for render burgerIngredients
    let ingredientsArr = Object.keys(props.ingredients)
    .map(igKey =>{
        return [...Array(props.ingredients[igKey])].map((_,idx)=>{ //take key and value from obj
            return <BurgerIngredient key={igKey + idx} type={igKey}/> //render the burgerIngredients
        })
    })
    .reduce((arr,el)=>{
        return arr.concat(el)
    },[]); //reduce to an single array from arrays in array
    
    if(ingredientsArr.length === 0){
        ingredientsArr = <p>Please Add Ingredient(s) For Your Unique Burger</p>
    }

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {ingredientsArr}
            <BurgerIngredient type="bread-bottom" />
        </div>
    )
}

export default burger