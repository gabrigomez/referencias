import React, { Component } from 'react'
import Main from '../../components/template/Main'
import axios from 'axios'
import './BooksReferences.css'
import { Formik, Field, Form } from 'formik'


const baseUrl = 'http://localhost:3001/referencias'

const initialState = {
    books: { authorName: '', book: '', publisher: '', local: '', year: '' },
    list: []
}

export default class BooksReferences extends Component {
    state = { ...initialState }

    constructor(props) {
        super(props)

        this.save = this.save.bind(this)
        this.saveAuthorName = this.saveAuthorName.bind(this)

    }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    save() {        
        
        const book = this.state.books
        const method = book.id ? 'put' : 'post'
        const url = book.id ? `${baseUrl}/${book.id}` : baseUrl

        axios[method](url, book)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ book: initialState.books, list })
            })
     }

    getUpdatedList(books) {
        const list = this.state.list.filter(book => book.id !== books.id)
        list.unshift(books)
        return list
    }

    saveAuthorName() {
        const book = this.state.books
        const name = book.authorName

        const arrayName = name.split(' ')
        const authorLastName = arrayName.pop().toUpperCase()
        const authorNewName = arrayName.slice([0, [arrayName.length - 1]]).join(' ')

        book.authorName = (authorLastName) + ', ' + (authorNewName)
        this.setState({ books: book.authorName })
        this.save()
        console.log(this.state.books)
        
    }

    load(book) {
        this.setState({ book })
    }



    remove(book) {
        axios.delete(`${baseUrl}/${book.id}`).then(resp => {
            const list = this.state.list.filter(b => b !== book)
            this.setState({ list })
        })
    }

    renderForm() {
        
        return (
            <div>
                <Formik initialValues={{ authorName: '', book: '', publisher: '', local: '', year: '' }}
                    onSubmit={(values, actions) => {
                        this.setState({books: values})
                        
                        //tentar passar os values gerados do formik para o state
                }}
                >
                    {props => (
                        <Form className="form-group mr-5"  >
                            <label> Nome do Autor</label>
                            <Field type="text" className="form-control" name="authorName" required/>
                            <label> Livro</label>
                            <Field type="text" className="form-control" name="book" required/>
                            <label> Editora</label>
                            <Field type="text" className="form-control" name="publisher" required />
                            <label> Local</label>
                            <Field type="text" className="form-control" name="local" required/>
                            <label> Ano</label>
                            <Field type="text" className="form-control" name="year" required/>

                            <button type="submit" className="btn-danger mt-3 mb-3 ml-3 mr-5"
                            onClick={this.saveAuthorName}>
                                Salvar
                        </button>
                            <button className="btn-danger mt-3 mb-3 ml-3 mr-5"
                                onClick={props.handleReset}>
                                Cancelar
                        </button>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }


    renderTable() {
        return (
            <table className="table mt-3" id="main">
                <thead>
                    <tr>
                        Referências geradas
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {

        return this.state.list.map(book => {
            return (
                <tr key={book.id}>
                    <td> <span className="font-weight-bold"> {book.authorName}. </span>
                        {book.book}. {book.publisher}: {book.local}, {book.year}.
                    </td>
                    <td>
                        <button className="bt btn-warning" onClick={() => this.load(book)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="bt btn-danger" onClick={() => this.remove(book)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }    

    render() {
        return (
            <Main>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
