import React, { SetStateAction, useEffect, useState } from 'react'
import '../styles/MyCartPage.css'
import { useCookies } from 'react-cookie'
import CartItem from '../components/CartItem'

interface MyCartPageProps {
  cartItems : Array<ProductAndQuantity>,
  removeCartItems : React.Dispatch<ProductAndQuantity[]>
  setIsLoading : React.Dispatch<SetStateAction<boolean>>
}

const MyCartPage : React.FC<MyCartPageProps> = ({cartItems, removeCartItems, setIsLoading}) => {
  let [cookies, setCookie] = useCookies(['cart'])
  let [totalPrice, setTotalPrice] = useState(0)

  useEffect(()=>{
    if (cartItems != null && cartItems.length !== 0) {
      updateTotalPrice()
    }
    if (cartItems.length === 0) {
      setTotalPrice(0)
    }
},[cartItems])

  let updateTotalPrice = () => {
    var currTotal = 0
    console.log('cart', cartItems)
    cartItems.forEach((item) => { currTotal += item.product.product_price * item.quantity})
    setTotalPrice(currTotal)
  }

  let removeItem = (id : number) => {
    console.log("id")
    let currCart = cartItems.filter((cartItem) => cartItem.product.id !== id)
    removeCartItems(currCart)
    setCookie('cart', currCart)
    updateTotalPrice()
  }

  let handleCheckout = async () => {
    if (cartItems.length === 0) return
    let itemsString = JSON.stringify(cartItems)
    setIsLoading(true)
    let response = await fetch('/api/store/checkout/', {
      method: 'PUT',
      body: itemsString
    })
    let data = await response.json()
    clearCart()
    setIsLoading(false)
    removeCartItems([])
    setCookie('cart', [])
    updateTotalPrice()
    alert(data)
  }

  let clearCart = () => {
    
  }

  return (
    <div className='myCartPage'>
        <h2>Your Cart: ({cartItems.length} items)</h2>
        <div className='cartInfoBox'>
          <div className='cartBox'>
              {cartItems.map((cartItem) => (
                <CartItem key={cartItem.product.id} item={cartItem.product} quantity={cartItem.quantity} onClick={() => removeItem(cartItem.product.id)}/>
              ))}
          </div>
          <div className='subtotalBox'>
            <h3>Summary</h3>
            {cartItems.map((cartItem) => (
              <div key={cartItem.product.id}>
                <p>{cartItem.product.product_title} x{cartItem.quantity}  {cartItem.product.product_price * cartItem.quantity}</p>
              </div>
            ))}
            <div className='horizontalLine'></div>
            <p>Total {totalPrice === 0 ? "" : totalPrice}</p>
            <div className='horizontalLine'></div>
            <button className='positiveButton' onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
    </div>
  )
}

export default MyCartPage