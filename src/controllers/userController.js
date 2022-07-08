const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

//<--------------------Registering User-------------------------->//

const userRegistration = async (req, res) => {
  try {
    let userData = req.body;

    let {name, phone, address} = req.body
    let {street, city, pincode} = address
    //console.log(pincode)

    ///<--------------req validation-------------------------------------------->
    if (Object.keys(userData).length == 0)
      return res.status(400).send({ status: false, msg: " data is empty" })

    ///<------------------------- req.body key empty validation ------------------------>
  
    if (!isValid(userData.title))
      return res.status(400).send({ status: false, msg: "title is required" });
    if (!isValid(userData.name))
      return res.status(400).send({ status: false, msg: "name is required" });
    if (!isValid(userData.phone))
      return res.status(400).send({ status: false, msg: "phone is required" });
    if (!isValid(userData.email))
      return res.status(400).send({ status: false, msg: "email is required" });
    if (!isValid(userData.password))
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    if (!isValid(userData.address))
      return res
        .status(400)
        .send({ status: false, msg: "address is required" });

    ////<----------------------- title enum validation ------------------------------->
    let enu = ["Mr", "Mrs", "Miss"];
    if (!enu.includes(userData.title))
      return res
        .status(400)
        .send({ status: false, msg: `please provide one of them + ${enu}` });

     ////<----------------------- name validation ------------------------------->
     if(!(/^[A-Z a-z]+$/.test(name))){
        return res.status(400).send({status:false, message: "Use Alphabets in Name !!"})
     }

    ///<------------------------ Email validation ---------------------------------------->

    const validateEmail = function (mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
      }
    };
    if (!validateEmail(userData.email))
      return res
        .status(400)
        .send({ status: false, msg: "this Email format is incorrect" });
    const emailChecking = await userModel.findOne({ email: userData.email });
    if (emailChecking)
      return res
        .status(400)
        .send({ status: false, msg: "this Email already exist !!" });

    ///<-----------------------------mobile number checking ---------------------------->
    if(!(/^[6-9]\d{10}$/.test(phone))){
        return res
        .status(400)
        .send({ status: false, msg: "Phone Number Should be start with (6-9) !!" });
    }
    let phoneNumChecking = await userModel.findOne({ phone: userData.phone });
    if (phoneNumChecking) {
      return res
        .status(400)
        .send({ status: false, msg: "this phone number is already exist !!" });
    }

    ////<----------------------- Password validation ------------------------------->
    const validatePassword = function (password) {
      if (/^[A-Za-z\W0-9]{8,15}$/.test(password)) {
        return true;
      }
    };
    if (!validatePassword(userData.password))
      return res
        .status(400)
        .send({ status: false, msg: "this password format is incorrect" });

    ////<----------------------- Address validation ------------------------------->
    
    if(!(/^[A-Za-z0-9]+$/.test(street))){
      return res
      .status(400)
      .send({ status: false, msg: "Street Should contain Alphaneumeric Only !!!" });
  }


    if(!(/^[A-Za-z]+$/.test(city))){
        return res
        .status(400)
        .send({ status: false, msg: "City Should be Alphabet !!!" });
    }


    if(!(/^[0-9]{6}$/.test(pincode))){
        return res
        .status(400)
        .send({ status: false, msg: "Pincode Should be 6-Digit Number !!!" });
    }
    ///<-----------------------------created part ---------------------------------->
    const userCreated = await userModel.create(userData);
    return res.status(201).send({ status: true, userdata: userCreated });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//<------------------User Logging in------------------------------>//
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (Object.keys(req.body).length == 0)
    res
      .status(400)
      .send({ status: false, message: "Enter Login Credentials." });
  if (!email) res.status(400).send({ status: false, msg: "Enter email." });
  if (!password)
    res.status(400).send({ status: false, msg: "Enter password." });

  const validateEmail = function (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
  };
  if (!validateEmail(email))
    return res
      .status(400)
      .send({ status: false, msg: "this Email format is incorrect" });

  const validatePassword = function (password) {
    if (/^[A-Za-z\W0-9]{8,15}$/.test(password)) {
      return true;
    }
  };
  if (!validatePassword(password))
    return res
      .status(400)
      .send({ status: false, msg: "this password format is incorrect" });

  let user = await userModel
    .findOne({ email: email, password: password })
    .select({ _id: 1 });
  if (!user)
    return res.status(400).send({
      status: false,
      msg: "Email or the password is not correct",
    });

  console.log(user);
  let token = jwt.sign(
    {
      userId: user._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 60,
    },
    "Room 1"
  );
  return res
    .status(201)
    .send({ status: true, msg: "login Successfully", token: token });
};

module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin;
