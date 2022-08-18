const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    t: {
        type:String,
        require: true,
        unique:true
    }
})


const TokenModel = mongoose.model('Token', TokenSchema);
module.exports = TokenModel;