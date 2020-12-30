import React from 'react'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Routes from './Routes'
import {HashRouter} from 'react-router-dom'
import Logo from '../components/template/Logo'
import Footer from '../components/template/Footer'



// eslint-disable-next-line
export default props => 
    <HashRouter>
        <div className="app">
            <Logo />
            <Routes />
            <Footer />
        </div>
    </HashRouter>
