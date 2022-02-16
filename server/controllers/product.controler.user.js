var db = require("../database_mysql");
const bcrypt = require("bcrypt");
const nodemailer=require("nodemailer")
var signUpUser = function (req, res) {
  console.log(req.body)
  db.query(
    `SELECT * From user where email = "${req.body.email}" `,
    (err, result) => {
      console.log(result)
      if (err) {
        res.status(500).send(err);
      } else if (result.length === 0) {
        if (
          req.body.password.length > 8 &&
          req.body.password.length < 25 &&
          req.body.password.match(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/
          )
        ) {
          const salt = bcrypt.genSaltSync();
          const hashedPaswword = bcrypt.hashSync(req.body.password, salt);
          db.query(
            `INSERT INTO user (firstName,lastName ,email,password,phoneNumber,ip,device) Values ("${req.body.firstName}","${req.body.lastName}","${req.body.email}","${hashedPaswword}","${req.body.phone}", '${req.body.ip}' , '${req.body.device}')`,
            (err1, result) => {
              if (err1) {
                throw err1;
              } else {
                res.send("nice");
                //sendconfirmation(req.body.email,req.body.firstName,req.body.lastName)
              }
            }
          );
        } else {
          res.send("please enter a strong password");
        }
      }
    }
  );
};
var getData=(req,res)=> { 
var ip=req.body.ip
db.query(`SELECT * FROM user where ip=${ip}`,(err,rez)=> {
if(err)
res.send("Err Hapaned")
else 
res.send(rez)
})
}
var getAllFood = (req,res)=> { 
db.query("SELECT * FROM menu" , (err,rez)=> {
if(err)
res.send(err) 
else 
res.send(rez) ;  
})
}
var loginUser = (req, res) => {
  esm = req.body.loginNameUser;
console.log(req.body)
   db.query(
    `SELECT * FROM user WHERE email = '${req.body.loginEmail}';`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
if(result.length==0)
res.send("Account Not Found")
console.log(result.length)
        var pass = result[0];
        console.log(pass)
        if(pass=="undefined"){
        return res.send("Account Not Found")
        }
        if ( result.length>0&&bcrypt.compareSync(req.body.loginPassword, pass.password)) {
           db.query(`SELECT * FROM user where email =='${req.body.loginEmail}' AND  ip =='${req.body.ip}' AND device =='${req.body.device}' `, (err,rez)=> {
                  if(err){
                    return res.send("2facter")                      
                  }else {
                  return   res.send(res.id)
                  }    
                  })
        } else {
        return   res.send("incorrect");
        }
      }
    }
  );
};
var getALLRestaurant=function(req,res){
    db.query("SELECT name,picture,description FROM restaurant ",(err,result)=>{
    err?res.status(500).send(err):res.status(200).send(result)
    })
}
var getOneRestaurant = (req,res)=>{
    db.query(`SELECT * FROM menu where restaurant_id = (SELECT restaurant_id from restaurant where name = "${req.params.name}" )`,(err,result)=>{
        err?res.status(500).send(err):res.status(200).send(result)
    })
}
var putInCart = (req,res)=>{ 
  db.query(`SELECT food_name , price  FROM menu WHERE food_name = '${req.params.foodName}' AND restaurant_id = (SELECT restaurant_id FROM  restaurant WHERE name = '${req.params.restaurantName}') `,(err,result)=>{
    err?res.status(500).send(err):res.send(result)
  })
}
const transporter=nodemailer.createTransport({
    service:"Outlook365",
    host:"smtp.office365.com",
    port:"587",
    tls:{
        ciphers:"SSLv3",
        rejectUnauthorized:false,
    },
    auth:{
        user:"mortadha125@outlook.fr",
        pass:"123456mortadha"
    },
});

///////////////////// used nodemailer to send email to user when he signup using outlook/ ///
const sendconfirmation=async(
    email,
    firstName,
    lastName
)=>{
    const mailOptions={
        from:"mortadha125@outlook.fr",
        to:email,
        subject:"Hello : user",
        text:"Hello"+" " +firstName+" "+lastName+" "+ "welcome to delevery food"
    };
    try{
        await transporter.sendMail(mailOptions,function(err,info){
            console.log(err);
            if(err){
                throw err
            }
        })
    }catch(err){
        throw err
    }
}
    
    module.exports={getALLRestaurant,getOneRestaurant,signUpUser, loginUser,putInCart,getAllFood,getData}
