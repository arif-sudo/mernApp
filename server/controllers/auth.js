import bcyrpt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

//REGISTER USERR
export const register = async(req, res) => {

    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcyrpt.genSalt()
        // console.log('salt', salt)
        const passwordHash = await bcyrpt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)

        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)

    }catch(err){
        res.status(500).json({error: err.message})
    }

}

//LOGIN IN

export const login = async(req, res) => {
    try{

        const {email, password} = req.body;
        const user = await User.findOne({email: email})

        if(!user){
            res.status(400).json({msg: "User does not exsists"});
        }
        const isMatch = await bcyrpt.compare(password, user.password);

        if(!isMatch){
            res.status(400).json({msg: "Invalid credentails"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET)
        delete user.password;
        res.status(200).json({token, user})

    }catch(err){
        res.status(500).json({error: err.message})
    }
}