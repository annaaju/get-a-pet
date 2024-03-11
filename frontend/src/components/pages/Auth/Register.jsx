/* eslint-disable no-unused-vars */
import Input from '../../form/Input'
import styles from '../../form/Form.module.css'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { Context, UserProvider } from '../../../context/UserContext'


const Register = () => {

  const[user, setUser] = useState({})
  const {register} = useContext(Context)
    
  function handleChange(e){
    setUser({...user, [e.target.name]: e.target.value})
  }

  function handleSubmit(e){
    e.preventDefault()
    //send user
    register(user)
  }
  
  return (
      
      <section className={styles.form_container}>
          <h1>Cadastre-se</h1>
          <form onSubmit={handleSubmit}>
            
            <Input
              text='Nome'
              type='text'
              name='name'
              placeholder='Digite seu nome'
              handleOnChange={handleChange}
            ></Input>
            
            <Input
              text='Telefone'
              type='text'
              name='phone'
              placeholder='Digite seu telefone'
              handleOnChange={handleChange}
            ></Input>

            <Input
              text='E-mail'
              type='email'
              name='email'
              placeholder='Digite seu e-mail'
              handleOnChange={handleChange}
            ></Input>

            <Input
              text='Senha'
              type='password'
              name='password'
              placeholder='Crie sua senha'
              handleOnChange={handleChange}
            ></Input>

            <Input
              text='Confirme a senha'
              type='password'
              name='confirmpassword'
              placeholder='Digite sua senha'
              handleOnChange={handleChange}
            ></Input>

            <input type='submit'value='Cadastrar'></input>

          </form>

          <p>
            Já tem uma conta? <Link to='/login'>Entre aqui!</Link>
          </p>
      </section>
  
    )
  }
  
  export default Register