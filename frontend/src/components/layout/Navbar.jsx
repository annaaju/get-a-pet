import {Link} from 'react-router-dom'
import Logo from '../../assets/logo.png'

import styles from'./Navbar.module.css'
import {Context} from '../../context/UserContext'
import { useContext } from 'react'

const Navbar = () => {

    const {authenticated, logout} = useContext(Context)

  return (
    
    <nav className={styles.navbar}>
        
        <div className={styles.navbar_logo}>
            <img src={Logo}/>
            <h2>Get A Pet</h2>
        </div>
        
        <ul>
            <li>
                <Link to= '/'>Adotar</Link>
            </li>
            
            {authenticated ? (
                <>
                    <li onClick={logout}>Sair</li>
                </>
            ) : (
                
                <>
                    <li>
                        <Link to= '/login'>Entrar</Link>
                    </li>
                    <li>
                        <Link to= '/register'>Cadastre-se</Link>
                    </li>               
                </>

            )}

        </ul>

    </nav>
  )
}

export default Navbar