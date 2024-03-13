/* eslint-disable react/prop-types */
import styles from './Select.module.css';

const Select = ({ text, name, options, handleOnChange, value }) => {
  
    return ( 
    
    <div className={styles.form_control}>
        <label htmlFor={name}>{text}:</label>
        <select name={name} id={name} onChange={handleOnChange} value={value || ''}>
            <option>Selecione uma opção</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>

  )
}

export default Select;
