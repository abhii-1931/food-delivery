import React, { useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const PlaceOrder = () => {
  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext)
  const navigate = useNavigate()
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData(data=>({...data, [name]:value}))
  }


  const placeOrder = async (e) => {
    e.preventDefault()
    let orderItems = []
    food_list.map((item)=>{
      
      if(cartItems[item._id]>0){
          let itemInfo = item
          itemInfo['quantity'] = cartItems[item._id]
          orderItems.push(itemInfo)
        }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()>0?getTotalCartAmount()+2:0
    }
    let response = await axios.post(`${url}/api/order/place`, orderData, {headers:{token}})
    if(response.data.success){
        const {session_url} = response.data
        window.location.replace(session_url)
      } else {
        alert('Order failed')
      }      
  }
  
  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} action="" className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-feilds">
          <input required name='firstName' value={data.firstName} onChange={onChangeHandler} type="text" placeholder='First name'/>
          <input required name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" placeholder='Last name'/>
        </div>
        <input required name='email' value={data.email} onChange={onChangeHandler} type="email" placeholder='Email address'/>
        <input required name='street' value={data.street} onChange={onChangeHandler} type="string" placeholder='Street'/>
        <div className="multi-feilds">
          <input required name='city' value={data.city} onChange={onChangeHandler} type="text" placeholder='City'/>
          <input required name='state' value={data.state} onChange={onChangeHandler} type="text" placeholder='State'/>
        </div>
        <div className="multi-feilds">
          <input required name='zip' value={data.zip} onChange={onChangeHandler} type="number" placeholder='Zip code'/>
          <input required name='country' value={data.country} onChange={onChangeHandler} type="text" placeholder='Country'/>
        </div>
        <input required name='phone' value={data.phone} onChange={onChangeHandler} type="number" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        
      <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}.00</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <b>${getTotalCartAmount()>0?2:0}.00</b>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>total</b>
              <b>${getTotalCartAmount()>0?getTotalCartAmount()+2:0}.00</b>
            </div>
          </div>
            <button type='submit'>PROCEED TO PAYMENT</button>
        </div>

      </div>
    </form>
  )
}

export default PlaceOrder
