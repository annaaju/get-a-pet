const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId
const Pet = require('../models/pet')

module.exports = class PetController{

    //create a pet
    static async create(req, res){
        const {name, age, weight, color } = req.body

        const images = req.files

        const available = true

        //images upload

        //validation
        if(!name){
            res.status(422).json({message: 'Nome obrigatório'})
            return
        }
        if(!age){
            res.status(422).json({message: 'Idade obrigatória'})
            return
        }
        if(!weight){
            res.status(422).json({message: 'Peso obrigatório'})
            return
        }
        if(!color){
            res.status(422).json({message: 'Cor obrigatória'})
            return
        }

        if(images.length === 0){
            res.status(422).json({message: 'Imagem obrigatória'})
            return
        }

        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images:[],
            user:{
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image) =>{
            pet.images.push(image.filename)
        })

        try {

            const newPet = await pet.save()
            res.status(201).json({message: 'Pet cadastrado com sucesso!', newPet})
            
        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getAll(req, res){

        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({pets: pets})
    }

    static async getAllUserPets(req, res){
        
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async getAllUserAdoptions(req, res){
        
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async getPetById(req, res){

        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'ID Inválido'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        res.status(200).json({pet: pet})
    }

    static async removePetById(req, res){

        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'ID Inválido'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        //checked if logged user is the one who registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: 'Solitação Inválida'})
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({message: 'Pet removido com sucesso!'})
    }

    static async updatePet(req, res){

        const id = req.params.id
        
        const {name, age, weight, color, available } = req.body

        const images = req.files

        const uptadedData = {}

        //vallidations
        if(!pet){
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        //checked if logged user is the one who registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: 'Solitação Inválida'})
            return
        }

        //more validations
        if(!name){
            res.status(422).json({message: 'Nome obrigatório'})
            return
        } else{
            uptadedData.name = name
        }

        if(!age){
            res.status(422).json({message: 'Idade obrigatória'})
            return
        }else{
            uptadedData.age = age
        }

        if(!weight){
            res.status(422).json({message: 'Peso obrigatório'})
            return
        }else{
            uptadedData.weight = weight
        }

        if(!color){
            res.status(422).json({message: 'Cor obrigatória'})
            return
        }else{
            uptadedData.color = color
        }

        if(images.length === 0){
            res.status(422).json({message: 'Imagem obrigatória'})
            return
        }else{
            uptadedData.images = []
            images.map((image) =>{
                uptadedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, uptadedData)

        res.status(200).json({message: 'Pet atualizado com sucesso!'})
      
    }

    static async schedule(req, res){

        const id = req.params.id

        //checking if pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        //checking if user had registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)){
            res.status(422).json({message: 'Você não pode agendar uma visita com o seu próprio pet!'})
            return
        }

        //checking if this user has already scheduled a visit
        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({message: 'Você já agendou uma visita para este pet!'})
                return
            }
        }

        //add user to pet
        pet.adopter ={
            _id: user._id,
            name: user.name,
            image: user.image,
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefne ${pet.user.phone}`
        })

    }

    static async concludeAdoption(req, res){

        const id = req.params.id


        //checking if pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        pet.available = false

        //checking if user had registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)){
            res.status(422).json({message: 'Você não pode agendar uma visita com o seu próprio pet!'})
            return
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Parabéns! O ciclo de adoção foi finalizado!'
        })

    }

}