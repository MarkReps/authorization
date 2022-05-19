const bcrypt = require("bcrypt")
const uuid = require("uuid")

const User = require("../models/user-model.js")
const mailService = require("./mailService.js")
const tokenService = require("./tokenService.js")
const UserDto = require("../dtos/userDto.js")

const apiError = require("../exceptions/apiError.js")
const ApiError = require("../exceptions/apiError.js")

class UserService {

    async registration (email,password){
        const candidate = await User.findOne({email})
        if(candidate){
            throw apiError.BadRequest("Пользователь уже создан.");
        }

        const hashedPassword = await bcrypt.hash(password,3)
        const activationLink = uuid.v4() // rfg23-asdgaas-123dgs-fd-h3g

        const user = await User.create({email,password:hashedPassword, activationLink})
        await mailService.sendActivationLink(email,`${process.env.API_URL}api/activate/${activationLink}`);
        
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id,tokens.refreshToken)
    
        return {
            ...tokens,
            user:userDto
        }
    }

    async login (email,password){
    
        const user = await User.findOne({email})
        if(!user){
            throw ApiError.BadRequest("Пользователь не наиден!")
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest("Введен неправильнии пароль!")
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id,tokens.refreshToken)
        return {
            ...tokens,
            user:userDto}
    }

    async logout (refreshToken){
 
        const token = await tokenService.removeToken(refreshToken)
        return token;

    }

    async activate (activationLink){
        const user = await User.findOne({activationLink})

        if(!user){
            throw apiError.BadRequest("Некоректная ссилка активации")
        }
    
        user.isActivated = true;
        await user.save();
    }

    async refresh (refreshToken){
        
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb){
            throw apiError.UnauthorizedError();
        }
        const user = await User.findById(userData.id)
        
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id,tokens.refreshToken)
        return {
            ...tokens,
            user:userDto}
    }

    async getUsers (){
        const users = await User.find()
        return users;
    }
}



module.exports = new UserService();