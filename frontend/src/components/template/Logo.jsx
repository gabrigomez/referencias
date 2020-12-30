import React from 'react'
import './Logo.css'
import { Link } from 'react-router-dom'

// eslint-disable-next-line
export default props =>
    <aside className="logo">
        <Link to="/home">
            <h1 className="home">
                 Gerador de Referências 
            </h1>
        </Link>
    </aside>
