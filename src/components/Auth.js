import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    title:"",name:"",phone:"",email:"",password:"",
      street:"", city : "", pincode:""
   
  })
  const [isCreateAccount, setisCreateAccount] = useState(false)
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value,
    }));
  };

  const sendRequest = async (type = "login") => {
    const res = await axios
    .post(`http://localhost:3001/${type}`, {
      title : inputs.title,
      name : inputs.name, 
      phone : inputs.phone,
      email : inputs.email,
      password: inputs.password,
      
        street: inputs.street,
        city : inputs.city,
        pincode: inputs.pincode,
      
    }).catch(err => console.log(err));

    const data = await res.data;
    // console.log(data)
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if(isCreateAccount) {
      sendRequest("register") 
      .then((data)=>console.log(data))
      .then(() => dispatch(authActions.login()))
      .then(() => navigate("/book/userId"))
    } else {
      sendRequest()
      .then((data) => localStorage.setItem("Authorization", [data.data1.token,data.data1.userId])) 
      .then((data)=>console.log(data))
      .then(() => dispatch(authActions.login()))
      .then(() => navigate("/book/userId")) 
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box 
          maxWidth={400}
          display='flex'
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          boxShadow='10px 10px 20px #ccc'
          padding={3}
          margin='auto'
          marginTop={5}
          borderRadius={5}
        >
          <Typography variant='h3' padding={2} textAlign='center'>
            { isCreateAccount ? "Signup" : "Login" }
          </Typography>
            { isCreateAccount && <Grid container spacing={1} >
              <Grid container item xs={3} direction="column">
                <TextField size="small" name="title" onChange={handleChange} value={inputs.title} type={'text'} label='Title'   />
              </Grid>
              <Grid container item xs={9} direction="column" >
                <TextField size="small" name="name" onChange={handleChange} value={inputs.name} type={'text'} label='Name'  />
              </Grid>
            </Grid>}
          {isCreateAccount && <TextField size="small" name="phone" onChange={handleChange} value={inputs.phone} fullWidth label="Phone Number" id="fullWidth1"  type={'phone'} margin='normal' />}
          <TextField size="small" name="email" onChange={handleChange} value={inputs.email} fullWidth label="Email" id="fullWidth1"  type={'email'} margin='normal' />
          <TextField size="small" name="password" onChange={handleChange} value={inputs.password} fullWidth label="Password" id="fullWidth"  type={'password'} margin='normal' />
          
          { isCreateAccount && <Grid container spacing={1} >
              <Grid container item xs={4} direction="column">
                <TextField size="small" name="street" onChange={handleChange} value={inputs.street} type={'text'} label='Street' margin='normal'  />
              </Grid>
              <Grid container item xs={4} direction="column" >
                <TextField size="small" name="city" onChange={handleChange} value={inputs.city} type={'text'} label='City' margin='normal' />
              </Grid>
              <Grid container item xs={4} direction="column" >
              <TextField size="small" name="pincode" onChange={handleChange} value={inputs.pincode} type={'pincode'} label='Pincode' margin='normal' />
              </Grid>
            </Grid>}

          <Button 
            type='submit'
            variant='contained' 
            sx={{borderRadius: 3, marginTop: 1}} 
            color='warning'
            >
              Submit
          </Button>
          <Button 
            onClick={() => setisCreateAccount(!isCreateAccount)}
            sx={{borderRadius:3, marginTop: 1}} 
            >
              Change to { isCreateAccount ? "Login" : "Signup" }
          </Button>
        </Box>
      </form>
    </div>
  )
} 

export default Auth
