import React from 'react'
import classes from './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'
// controls type
const controls = [
    { label:'Salad', type:'salad' },
    { label:'Bacon', type:'bacon' },
    { label:'Cheese', type:'cheese' },
    { label:'Meat', type:'meat' }
]

const buildControls = (props)=>{
    return (
        <div className={classes.BuildControls}>
            <p>Current Price : <strong>{props.price.toFixed(2)}</strong></p>
            {controls.map(control=>{
              return <BuildControl 
                label={control.label} 
                key={control.label}
                added={props.ingredientAdded.bind(this,control.type)}
                remove={props.ingredientRemove.bind(this,control.type)}
                disabled={props.disabled[control.type]}/>
            })}
            <button 
                className={classes.OrderButton}
                disabled={!props.purchasable}
                onClick={props.ordered}>
                Order Now
            </button>
        </div>
    )
} //render controls

export default buildControls