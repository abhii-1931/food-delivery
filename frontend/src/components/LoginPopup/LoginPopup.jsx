import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import {toast} from 'react-toastify'



const LoginPopup = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState('Login')
  const {url, token, setToken} = useContext(StoreContext)

  const [data, setData] = useState({
    name:'',
    email:'',
    password:''
  })

  const onChangeHandler = (e) => {
    setData(data=>({...data, [e.target.name]:e.target.value}))
  }
  

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    let newUrl = url
    if (currentState === 'Login') {
      newUrl += `/api/user/login`
    } else {
       newUrl += `/api/user/register`
    }
    const response = await axios.post(newUrl, data)
    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem('token', response.data.token)
      setShowLogin(false)
    } else {
      toast.error(response.data.message)
    }
  }
  


  return (
    <div className='login-popup'>
      <form onSubmit={onSubmitHandler} className='login-popup-container' >
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-input">
          {currentState === 'Login' ? <></> : <input onChange={onChangeHandler} name='name' value={data.name} type="text" placeholder='Your name' required />}
          <input onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email address' required />
          <input onChange={onChangeHandler} name='password' value={data.password} type="password" placeholder='Enter password' required />
        </div>
        <button type='submit' >{currentState === 'Sign Up' ? 'Create account' : 'Login'}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === 'Login' ?
          <p onClick={()=>setCurrentState('Sign Up')}>Create a new account? <span>Click here</span></p> :
          <p onClick={()=>setCurrentState('Login')}>already have an account? <span>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
