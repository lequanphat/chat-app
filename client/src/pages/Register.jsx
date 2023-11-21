import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { registerRoute } from '../utils/ApiRoutes';

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('submit');
        const { username, email, password } = values;
        const { data } = await axios.post(registerRoute, {
            username,
            email,
            password,
        });
        if (data.status === false) {
            alert(data.msg);
            return;
        }
        localStorage.setItem('chat-app-user', JSON.stringify(data.newUser));
        navigate('/');
    };
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    return (
        <div>
            
            <FormContainer>
                <img className="robot" src='/robot.gif' alt='' />
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="header">
                        <h1>Register</h1>
                    </div>
                    <input type="text" placeholder="Username" name="username" onChange={(e) => handleChange(e)} />
                    <input type="text" placeholder="Email" name="email" onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                    />

                    <button type="submit">Join now</button>
                    <span>
                        You already have an account?<Link to="/login">Login</Link>
                    </span>
                </form>
            </FormContainer>
        </div>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #40407a;
    .robot{
        width: 40%;

    }
    .header h1 {
        color: white;
        text-transform: uppercase;
        font-size: 1.8rem;
    }
    form {
        display: flex;
        background-color: #2c2c54;
        flex-direction: column;
        gap: 2rem;
        border-radius: 0.8rem;
        padding: 2.4rem 3.2rem;
    }
    input {
        min-width: 18rem;
        background-color: transparent;
        padding: 0.8rem;
        border: 0.1rem solid #1abc9c;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1.2rem;
        &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
        }
    }
    button {
        background-color: #1abc9c;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
        text-transform: uppercase;
        border-radius: 0.4rem;
        &:hover {
            background-color: #16a085;
        }
    }
    span {
        color: white;
        a {
            margin-left: 0.2rem;
            color: #1abc9c;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }
`;

export default Register;