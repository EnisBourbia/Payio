import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './login.css';
import background from '../assets/images/login-background.jpg'
import logo from '../assets/images/devlerLogo.png'
import { Api } from '../Api'

const Login = (props) => {
    const history = useHistory();

    const [login, setLogin] = useState({
        email: '',
        password: ''
    });

        const  submitLogin = async () => {
            Api.post('/user/token/',
            login
            ).then(response => {
                window.localStorage.setItem('accessToken', response.data.access);
                window.localStorage.setItem('refreshToken', response.data.refresh);
                history.push('/')
              }).catch((error) => {
                console.error("Error", error)
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