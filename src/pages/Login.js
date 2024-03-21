import React from "react";
import logo from '../images/logo.png';
import { FONT_MONTSERATT, FONT_ROBOTO } from "../Fonts/Fonts.tsx";

const styles = {
    container: {
      display: 'flex',
      height: '100vh'
    },
    white: {
      flex: 1,
      backgroundColor: '#fff'
    },
    blue: {
      flex: 1,
      backgroundColor: '#86a7fc',
      width: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    logo: {
      width: '50%',
      height: '50%',
      position: 'absolute',
      top: '35%',
      right: '50%',
      bottom: '50%',
      transform: 'translate(50%, -40%)'
    },
    tag: {
      color: '#fff',
      fontFamily: FONT_MONTSERATT,
      position: 'absolute',
      top: '65%',
      right: '50%',
      transform: 'translate(50%, 10%)'
    },
    tag2: {
        color: '#ffffff',
        fontFamily: FONT_MONTSERATT,
        position: 'absolute',
        top: '73%',
        bottom: '20%',
        right: '50%',
        transform: 'translate(50%, 10%)',
    }
  };


function Login(){
    
    return(
        <>
            <div style={styles.container}>
                <div style={styles.blue} className="blue">
                    <img src={logo} alt="Logo" style={styles.logo} className="logo" />
                    <h1 className="tag" style={styles.tag}>Log in to your account.</h1>
                    <p className="tag2" style={styles.tag2}>Enter your credentials to access your account.</p>
                </div>

                <div style={styles.white} className="white">
                
                </div>
            </div>
        </>
       
    );
}

export default Login;