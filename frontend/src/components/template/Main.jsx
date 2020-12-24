import './Main.css'
import React, { Children } from 'react'
import Header from './Header'


export default props => 
    <React.Fragment>
        <Header {...props} />
        <main className="content">
            <div className="p-3 mt-3" id="main">
                {props.children}
            </div>        
        </main>
    </React.Fragment>
