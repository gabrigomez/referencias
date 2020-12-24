import React from 'react'
import {Switch, Route, Redirect} from 'react-router'
import Home from '../components/home/Home'
import BooksReferences from '../components/books/BooksReferences'
import MagazinesReferences from '../components/books/MagazineReferences'

export default props =>
    <Switch>
        <Route exact path='/' component={Home}  /> 
        <Route path='/books' component={BooksReferences}  />
        <Route path='/magazine' component={MagazinesReferences} />
        <Redirect from='*' to='/' /> 
    </Switch>