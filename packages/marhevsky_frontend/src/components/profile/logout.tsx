import React from "react";
import TokenUtilService from "../../utils/token-util";
import {Navigate} from "react-router-dom";

export default function Logout(){
    if(TokenUtilService.invalidateToken()){
        console.log("Token successfully invalidated.")
    }

    return(
        <Navigate to={{ pathname: '/login'}} />
    )
}
