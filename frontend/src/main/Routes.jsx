import React from 'react'
import {Switch, Route, Redirect} from 'react-router'
import Home from '../components/home/Home'
import BooksReferences from '../components/references/BooksReferences'
import MagazinesReferences from '../components/references/MagazineReferences'

// eslint-disable-next-line
export default props =>
    <Switch>
        <Route exact path='/' component={Home}  /> 
        <Route path='/books' component={BooksReferences}  />
        <Route path='/magazine' component={MagazinesReferences} />
        <Redirect from='*' to='/' /> 
    </Switch>