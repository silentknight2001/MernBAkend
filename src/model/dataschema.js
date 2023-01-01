const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = mongoose.Schema({
    firstname:{
        type: String,
        unique: true,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        required: true,
        unique: true,
        type:String 
    },
    gender:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        unique: true,
        // required: true
    },
    age:{
        type: Number,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    confirmpassword:{
        type:String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
})



// generating jwt token...........

employeeSchema.methods.generateAuthToken = async function(){
    try {    
        
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token}) 
        await this.save();
        return token;

    } catch (error) {
       
        console.log(`the error is found ${error}`)

    }
}




// converting password into hash   :)--


employeeSchema.pre("save", async function(next) {

    if(this.isModified("password")){   
    this.password = await bcrypt.hash(this.password, 10)
    // console.log(`after hash password is ${this.password}`);

    // this.confirmpassword = undefined; 
    this.confirmpassword = await bcrypt.hash("this.password", 10)

    }
    next()
})



// create collection............
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
