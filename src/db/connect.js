const mongoose = require("mongoose")
mongoose.set('strictQuery', true);


mongoose.connect(process.env.MONGODB_CONNECTION,{
    // useCreateIndex: true,
    // useNewUrlParser: true,       // for localhost this are not require ...............
    // useUnifiedTopology: true,
}).then(()=>{
    console.log("database connection Active");
}).catch((error)=>{
    console.log("database connection faile");
})
