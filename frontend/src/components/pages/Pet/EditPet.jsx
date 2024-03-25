/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './AddPet.module.css'
import PetForm from '../../form/PetForm'
const API_URL = import.meta.env.VITE_REACT_APP_API

const EditPet = () => {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await api.get(`/pets/${id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`
                    }
                })
                setPet(response?.data?.pet)
            } catch (error) {
                console.error('Erro ao buscar pet:', error)
            }
        }

        fetchPet()
    }, [token, id])

    async function updatePet(pet){
        
        let msgType = 'sucess'

        const formData = new FormData()

        await Object.keys(pet).forEach((key) => {
            if(key === 'images'){
                for (let i =0; i < pet[key].length; i++){
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        const data = await api.patch(`pets/${pet._id}`, formData, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        })
        .catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)

    }
    

    return (
        <section>
            <div className={styles.addpet_header}>
                {pet.name && (
                    <>
                        <h1>Editando o Pet: {pet.name}</h1>
                        <p>Após a edição, os dados serão atualizados no sistema</p>
                    </>
                )}
            </div>
            {pet.name && (
                <PetForm 
                handleSubmit={updatePet}
                btnText="Atualizar"
                petData={pet}
                apiUrl={API_URL}/>
            )}
        </section>
    )

}

export default EditPet
