require('dotenv').config()   // for use .env 
const express = require("express")
const app = express();
const path = require("path")
require("./db/connect")
const hbs = require("hbs")
const Register = require("./model/dataschema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// ---------------------------------------------------------------
const auth = require("./middleware/auth")
//----------------------------------------------------------------


const port = process.env.PORT || 8000


console.log(process.env.SECRET_KEY);  // just checking .env file working or not


// now its now time to add our static file path registration from............. 
const static_path = path.join(__dirname, "../public")  
const template_path = path.join(__dirname, "../tampletes/views")    //templates file path
const partial_path = path.join(__dirname, "../tampletes/partials") // partials file path


app.use(express.json()); 
app.use(express.urlencoded({extended:false})); 
app.use(express.static(static_path));  


app.set("view engine", "hbs");   // here we register hbs (handel bars)
app.set("views", template_path); // here we just tellig to expres now our file we make views to... template_pat
hbs.registerPartials(partial_path);

app.get("/", (req,res)=>{
    res.render("index")  
})

app.get("/register", (req,res)=>{
    res.render("register") 
})


// -----------------------------------------------------------------------------------------

app.get("/secret",auth,(req, res)=>{
res.render("secret")
})

// --------------------------------------------------------------------------------------------


app.post("/register", async(req,res)=>{
    try {
        const password = req.body.password;    // condition if password are matching than save our date either throw error :)
        const cpassword = req.body.confirmpassword;
        if(password == cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body. age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            })

          // generating JWT token....... aftetr register here we have to implement in model and its always before saving our data or password........................... 
          

          const token = await registerEmployee.generateAuthToken();


        //-------------------------------------------------------------------------------------------
          res.cookie("jwt", token, {   // sending cookie to user and with expirey date 3secend
            expires:new Date(Date() + 80000 ), httpOnly:true,
          });
        //--------------------------------------------------------------------------------------------

        
          const savingData = await registerEmployee.save();

          console.log(`the token part ${token}`);
          
          const status = await savingData ? 201 : 400
          
          res.status(status).render("login")
        }else{
            res.send("password are not match")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get("/login", (req,res)=>{
    res.render("login") 
})

// Login validation.......

app.post("/login", async(req,res)=>{
    try {
        const Uemail = req.body.email;
        const password = req.body.password;

        const userEmail = await Register.findOne({email:Uemail});
        console.log(`userEmail retun this :- ${userEmail}`);
        const match = await bcrypt.compare(password,  userEmail.password); // here bcrupt will compair both of them pass word is same or not.... if not than not allow to login 

        //Jwt token generate while login ..we just call it here bcz...we alredy creted function on mondel file
          const token = await userEmail.generateAuthToken();
          console.log(token);



        // -------------------------------------------------------------------------------------------

          res.cookie("jwt", token, {   // sending cookie to user and with expirey date 3secend
            expires:new Date(Date() + 80000 ), httpOnly:true,
          });

         //--------------------------------------------------------------------------------------------


        if(match){   
            res.status(201).render("index")
        }else{
            res.send("wrong password just for check dot write this")
        }
    } catch (error) {
        res.status(400).send("invalid email")
    }
})





app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
})


