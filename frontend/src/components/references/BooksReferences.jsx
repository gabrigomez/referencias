import React, { Component } from 'react'
import Main from '../../components/template/Main'
import axios from 'axios'
import './BooksReferences.css'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'


const baseUrl = 'http://localhost:3001/books'

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

    componentDidMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    save(book) {
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

    saveAuthorName(book) {
        const name = book.authorName

        const arrayName = name.split(' ')
        const authorLastName = arrayName.pop().toUpperCase()
        const authorNewName = arrayName.slice([0, [arrayName.length - 1]]).join(' ')

        book.authorName = (authorLastName) + ', ' + (authorNewName);
        this.setState({ books: book.authorName });
        this.save(book);
    }

    load(book) {
        this.setState({ books: book })
        console.log(book)
        console.log(this.state)        
              
    }

    remove(book) {
        axios.delete(`${baseUrl}/${book.id}`).then(resp => {
            const list = this.state.list.filter(b => b !== book)
            this.setState({ list })
        })
    }

    renderForm() {
        const booksSchemas = yup.object().shape({
            authorName: yup
                .string()
                .min(2)
                .required('Required')
        })
        
        return (
            <div>
                <Formik initialValues={initialState.books}
                    validationSchema={booksSchemas}
                    onSubmit={(values, actions) => {
                        this.setState({ books: values })
                        this.saveAuthorName(values);
                        actions.resetForm();
                        console.log(actions)                                              
                        //tentar passar os values gerados do formik para o state
                }}
                >
                    {props =>
                        <Form className="form-group mr-5"  >
                            <label> Nome do Autor</label>
                            <Field type="text" className="form-control" name="authorName" />
                            {props.errors.authorName && props.touched.authorName ? (
                                <div>{props.errors.authorName}</div>
                            ):null }
                            <label> Livro</label>
                            <Field type="text" className="form-control" name="book" required/>
                            <label> Editora</label>
                            <Field type="text" className="form-control" name="publisher" required />
                            <label> Local</label>
                            <Field type="text" className="form-control" name="local" required/>
                            <label> Ano</label>
                            <Field type="text" className="form-control" name="year" required/>

                            <button type="submit" className="btn-primary mt-3 mb-3 ml-5">
                                Salvar
                            </button>
                            <button className="btn-danger mt-3 mb-3 ml-3 mr-5"
                                onClick={props.handleReset}>
                                Cancelar
                        </button>
                        </Form>
                        
                    }
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
                <Formik>
                    <tr key={book.id}>
                        <td> {book.authorName}. <span className="font-weight-bold">{book.book}</span>. {book.publisher}: {book.local}, {book.year}.
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

                </Formik>
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
