const createUserToken = require('../helpers/create-user-token')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

        await createUserToken(newUser, req, res)

    }

}