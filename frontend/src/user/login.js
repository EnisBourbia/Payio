import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import background from '../assets/images/login-background.jpg'
import logo from '../assets/images/devlerLogo.png'

const Login = () => {
    const [login, setLogin] = useState({
        email: '',
        password: ''
    });

        const  submitLogin = async () => {
             fetch('http://localhost:8000/api/authenticate/',{
                 method: 'POST',
                 headers: {'Content-Type':'application/json'},
                 body: JSON.stringify(login)
             }).then(  response => {
                if (response.ok) {
                    response.json().then(json => {
                      window.localStorage.setItem('accessToken', json.access);
                      window.localStorage.setItem('refreshToken', json.refresh);
                      window.location.href = "/"
                    }
                )
             }
            })
        }
        
    return (
    <>
    <img id="background-image" src={background}/>
    <div className="background-image-container">
    <form>
        <img src={logo}/>
        <input type="text" placeholder="Email" onChange={e => setLogin({...login, email: e.target.value})}/><br/>
        <input type="password" placeholder="Lösenord" onChange={e => setLogin({...login, password: e.target.value})}/><br/>
        <button type="button" onClick={submitLogin}>LOGGA IN</button>
        <span>Glömt lösenord? <Link to="/registrera">klicka här</Link></span>
    </form>
    </div>
    </>
    );
    }

export default Login;