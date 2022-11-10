import React, {useState} from 'react'
import { Link } from "react-router-dom";
import {AppBar, Typography, Toolbar, Box, Button, Tabs, Tab} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store";

const Header = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const [value, setValue] = useState(0);
    return (
        <AppBar
            position = "sticky"
            sx={{background:"linear-gradient(90deg, rgba(58,75,180,1) 2%, rgba(116,49,110,1) 36%, rgba(2,0,161,1) 73%, rgba(69,92,252,1) 100%)"
        }}>
            <Toolbar>
                <Typography variant="h4">BookPost</Typography>
                { isLoggedIn && (
                <>
                <Box display="flex" marginLeft="auto" marginRight="auto">
                    <Tabs 
                        textColor="inherit" 
                        value={value} 
                        onChange={(e,val)=>setValue(val)}
                        >
                        <Tab LinkComponent={Link} to="/book/userId" label="My Book" />
                        <Tab LinkComponent={Link} to="/books/add" label="Add Book" />
                        <Tab LinkComponent={Link} to="/books" label="All Book" />
                    </Tabs>
                </Box>
                </>
                )} 
                <Box display="flex" marginLeft="auto">
                    { !isLoggedIn &&  (
                        <>
                            <Button 
                                LinkComponent={Link} to="/auth"
                                variant="contained" 
                                sx={{margin:1, borderRadius:10}} color="warning"
                                >
                                Login
                            </Button>
                    </>
                    )}
                    { !isLoggedIn && (
                        <>
                            <Button 
                                LinkComponent={Link} to="/auth"
                                variant="contained" 
                                sx={{margin:1, borderRadius:10}} color="warning"
                                >
                                    Signup
                            </Button>
                    </>
                    )}
                    {isLoggedIn && (
                        <>
                            <Button onClick = {() => dispatch(authActions.logout())}
                                LinkComponent={Link} to="/auth"
                                variant="contained" 
                                sx={{margin:1, borderRadius:10}} color="warning"
                                >
                                    Logout 
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
    }

    export default Header
