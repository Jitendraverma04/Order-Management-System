import mongoose from "mongoose";

const BlogUSerRegisterSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
})

const userData = mongoose.model('userData', BlogUSerRegisterSchema);

export default userData;