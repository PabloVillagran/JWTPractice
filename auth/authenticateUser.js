const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../schemas/userSchema')
const bcrypt = require('bcrypt')

passport.use('signup', new localStrategy(//configuración de estrategia local para registro
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done)=>{
        try{
            password = await bcrypt.hash(password, 10);//realiza hash de password
            const user = await UserModel.create({email, password});//almacena usuario en BD
            return done(null, user);
        } catch (error){
            done(error);
        }
    }
));

passport.use('login', new localStrategy(//configuración de estrategía local para ingreso
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) =>{
        try{
            const user = await UserModel.findOne({email});//busca usuario en base de datos
            if(!user){//si no existe usuario en BD
                return done(null, false, {message: 'Incorrect user or password'});
            }
            if(!(await bcrypt.compare(password, user.password))){//compara hash con password entrante
                return done(null, false, {message: 'Incorrect user or password'});
            }
            user.password = null;
            return done(null, user, {message: 'Logged in successfully'});
        }catch(error){
            return done(error);
        }
    }
));

passport.use('changePassword', new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
   },
    async(req, email, password, done)=>{
        try{
            const user = await UserModel.findOne({email});
            const newPassword = req.body.new_password;
            if(!user)
                return done(null, false, {message:'Incorrect user or password'});
            if(!(await bcrypt.compare(password, user.password)))
                return done(null, false, {message:'Incorrect user or password'});
            if((await bcrypt.compare(newPassword, user.password)))
                return done(null, user, {message:'New password cannot be de same as old password'});
            const newHash = await bcrypt.hash(newPassword, 10);
            await UserModel.updateOne({_id: user._id}, {password: newHash});
            return done(null, user, {message:'Password has changed!'});
        }catch(error){
            console.log(error);
            return done(null, error, {message:'Error! ' + error});
        }
    }
));
