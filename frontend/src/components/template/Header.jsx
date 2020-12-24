import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

export default props =>
    <header className="header d-none d-sm-flex flex-column">
        <h3>
            <Link to="/books">
                <i className="fa fa-book"></i> Referência de Livros
            </Link>
            <Link to="/magazine">
                <i className="fa fa-print ml-5"></i> Artigo de Revista
            </Link>
        </h3>

    </header>
