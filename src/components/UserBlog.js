import React, { useEffect, useState } from "react";
import axios from 'axios';
import Blogs from "./Blogs";



const UserBlog = () => {
  const [books, setBooks] = useState({});
  const needit  = (localStorage.getItem("Authorization"))
  const sendRequest = async () => {
    const res = await axios
    .get(`http://localhost:3001/book/${needit.split(",")[1]}`,{
        headers: {
            authorization: (needit.split(","))[0],
            Accept: 'application/json',
          },
    })
    .catch(err => console.log(err));
    const data = await res.data;
    if(data.data.length===0) return ""
    return data;
  };

  useEffect(() => {
    sendRequest().then((data) => setBooks(data));
},[]);

console.log(books);  

return (
    <div > 
      <div>
        {!books && <h3>NO BOOK AVAILABLE PLEASE ADD NEW BOOK</h3>}
      </div>
    <div margin="auto">
      {books.data && <h3>Welcome {books.data[0].userId.name}</h3>}
    </div>
      {books.data &&
        (books.data).map((book, index) => (
      <Blogs 
      title={book.title}
      excerpt={book.excerpt}
      bookCover={book.bookCover}
      category={book.category} 
      subcategory={book.subcategory}
      ISBN={book.ISBN}
      reviews={book.reviews}
      userName={book.userId.name}
      /> 
      ))}
      </div>
  )
}
//title,excerpt,ISBN,category,subcategory,bookCover,reviews,name
export default UserBlog

