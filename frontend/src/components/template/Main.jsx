import './Main.css'
import React from 'react'
import Header from './Header'

// eslint-disable-next-line
export default props => 
    <React.Fragment>
        <Header />
        <main className="content">
            <div className="p-3 mt-3" id="main">
                {props.children}
            </div>        
        </main>
    </React.Fragment>
