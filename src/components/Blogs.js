import React from 'react';
import {
  Avatar,
  Box,
  CardContent,
  CardMedia, 
  Typography, 
  Card, 
  IconButton,
  CardHeader 
} from '@mui/material';



const Blogs = ({title,excerpt,ISBN,category,subcategory,bookCover,reviews,userName}) => {
  return (
    <div>
      <Card sx={{ 
          width: "45%",
          margin: "auto",
          mt: 2,
          padding: 2,
          boxShadow: "5px 5px 10px #ccc",
          ":hover": {
            boxShadow: "10px 10px 20px #ccc",}
            }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
            {userName}
          </Avatar>
        }
        
        title={title.toUpperCase()}
        subheader={<div>
              Category : {category} <br/>
              Subcategory : {subcategory} <br/>
        </div>}
        
      />
      <CardMedia
        component="img"
        height="194"
        image="https://picsum.photos/600/600"
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Excerpt : {excerpt}<br/>
          ISBN : {ISBN} <br/>
          Reviews : {reviews}
        </Typography>
      </CardContent>
      
    </Card>
    </div>
  )
}

export default Blogs