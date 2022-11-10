import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  return (
    <div>
      <form >
        <Box 
          maxWidth={400}
          display='flex'
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          boxShadow='10px 10px 20px #ccc'
          padding={3}
          margin='auto'
          marginTop={1}  
          borderRadius={5}
        >
          <Typography variant='h5' padding={1} textAlign='center'>
            ADD BOOK
          </Typography>
          {/* //title,excerpt,ISBN,category,subcategory,bookCover,reviews,name */}
           
          <TextField size="small" name="title"  fullWidth label="Add Title" id="fullWidth1"  type={'text'}  />
          <TextField size="small"  name="excerpt"  fullWidth label="Add Excerpt" id="fullWidth1"  type={'text'} margin='normal' />
          <TextField size="small" name="category"  fullWidth label="Add category" id="fullWidth"  type={'text'} margin='normal' />
          <TextField size="small" name="subcategory"  fullWidth label="Add subcategory" id="fullWidth"  type={'text'} margin='normal' />
          <TextField size="small" shrink={true} name="bookCover"  fullWidth  id="fullWidth"  type={'file'} margin='normal' />
          <TextField size="small" name="ISBN"  fullWidth label="ISBN Number" id="fullWidth"  type={'number'} margin='normal' />
          <TextField size="small" inputProps={{min: 0, style: { textAlign: 'center' }}}  name="releasedAt"  fullWidth label="Released Date" id="fullWidth"  type={'date'} margin='normal' />

          <Button 
            type='submit'
            variant='contained' 
            sx={{borderRadius: 3, marginTop: 0.5}} 
            color='warning'
            >
              Submit
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default AddBlog



//title,excerpt,ISBN,category,subcategory,bookCover,reviews,name