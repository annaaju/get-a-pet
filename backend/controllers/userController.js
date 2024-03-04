const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const user = require('../models/user')
const User = require('../models/user')

module.exports = class userController {
    
    static async register (req, res){
        
        const{ name, email, phone, password, confirmpassword } = req.body

        //validations
        if(!name){
            res.status(422).json({message: 'Nome obrigatório'})
            return
        }
        if(!email){
            res.status(422).json({message: 'Email obrigatório'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'Telefone obrigatório'})
            return
        }
        if(!password){
            res.status(422).json({message: 'Senha obrigatória'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'Confirmação de senha obrigatória'})
            return
        }
        if(password !== confirmpassword){
            res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais!'})
            return
        }

        //check if user exists; email as a kind of id
        const userExists = await User.findOne({email: email})
        if(userExists){
            res.status(422).json({message: 'Esse email já está cadastrado!'})
           return
        }

        // create a password
        const salt = await bcrypt.genSalt(15)
        const passwordHash = await bcrypt.hash(password, salt)

        //create user
        const newUser = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try{
            await newUser.save()
            await createUserToken(newUser, req, res)
        }catch(error){
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res){
    
        const {email, password} = req.body

        if(!email){
            res.status(422).json({message: 'Email obrigatório'})
            return
        }

        if(!password){
            res.status(422).json({message: 'Senha obrigatória'})
            return
        }

         //check if user exists; email as a kind of id
         const userExists = await User.findOne({email: email})
         if(!userExists){
             res.status(422).json({message: 'Não há usuário cadastrado com esse e-mail!'})
            return
         }

         //check if password match with db password
         const checkPassword = await bcrypt.compare(password, User.password)
         if(!checkPassword){
            res.status(422).json({message: 'Senha inválida!'})
           return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res){
        
        let currentUser

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){

        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(422).json({message: 'Usuário não encontrado!'})
           return
        }

        res.status(200).json({user})

    }

    static async editUser(req, res){
        
        const id = req.params.id

        //checking if user exists
        const token = getToken(req)
        const user =  await getUserByToken(token)

        const{name, email, phone, password, confirmpassword} = req.body

        if(req.file){
            user.image = req.file.filename
        }

        //validations
        if(!name){
            res.status(422).json({message: 'Nome obrigatório'})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message: 'Email obrigatório'})
            return
        }

        //checking if email has already taken
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists){
            res.status(422).json({message: 'Usuário não encontrado'})
            return 
        }

        user.email = email

        if(!phone){
            res.status(422).json({message: 'Telefone obrigatório'})
            return
        }

        user.phone = phone

        if(password !== confirmpassword){
            res.status(422).json({message: 'As senhas não conferem!'})
            return
        }else if(password === confirmpassword && password != null){
            //creating new password
            const salt = await bcrypt.genSalt(15)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try{

            //returns users uptade data
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                {new: true},
            )

            res.status(200).json({message: 'Dados atualizados com sucesso!'})

        }catch (err){

            res.status(500).json({message: err})
            return

        }

    }

}