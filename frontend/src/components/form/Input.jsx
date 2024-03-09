import styles from './input.module.css'


// eslint-disable-next-line react/prop-types
const Input = ({type, text, name, placeholder, handleOnChange, value, multiple}) => {
  return (
    
    <div className={styles.form_control}>
        <label htmlFor={name}>{text}:</label>
        <input type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? {multiple} : '')}
        >
            
        </input>
    </div>

  )
}

export default Input