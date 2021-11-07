import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.css';



const Register = () => {
    
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        org_nummer: '',
        name: ''        
    });

    const  submitForm = async () => {
           const response = await fetch('http://localhost:8000/api/register/',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(form)
            })
            console.log(JSON.stringify(form))
        }
        
    return (
    <>
    <div className="register-container">
    <form>
        <input type="text" placeholder="namn" onChange={e => setForm({...form, first_name: e.target.value})}/>
        <input type="text" placeholder="efternamn" onChange={e => setForm({...form, last_name: e.target.value})}/>
        <input type="text" placeholder="email" onChange={e => setForm({...form, email: e.target.value})}/>
        <input type="text" name="password" placeholder="password" onChange={e => setForm({...form, password: e.target.value})}/>
        <input type="text" placeholder="företagsnamn" onChange={e => setForm({...form, name: e.target.value})}/>
        <input type="text" placeholder="organisationsnummer" onChange={e => setForm({...form, org_nummer: e.target.value})}/>

        <button type="button" onClick={submitForm}>Skapa konto</button>
    </form>
    </div>
    </>
    );
    }

export default Register;