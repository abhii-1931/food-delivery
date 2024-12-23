import './MyOrders.css';
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { StoreContext } from '../../context/storeContext';
import { assets } from '../../assets/assets';
import axios from 'axios';


const MyOrders = () => {

    const {url, token} = useContext(StoreContext)
    const [data, setData] = useState([])

    const fetchOrders = async () => {
        const response = await axios.post(`${url}/api/order/userorder`, {}, {headers:{token}})
        setData(response.data.data)
    }

    useEffect(() => {
        if(token){
            fetchOrders()
        }
    }, [token])

  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {
                data.map((order, index) =>{
                    return (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item, index)=>{
                                if (index === order.items.length - 1) {
                                    return <span key={index}>{item.name} x {item.quantity}</span>
                                } else {
                                    return <span key={index}>{item.name} x {item.quantity}, </span>
                                    }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span className='colordiff'>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    )
                })
            }
        </div>

    </div>
  )
}

export default MyOrders
