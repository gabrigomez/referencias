import React, { Component } from 'react'
import Main from '../../components/template/Main'
import axios from 'axios'
import './BooksReferences.css'
import { Formik, Field, Form} from 'formik'
import * as yup from 'yup'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 

import Button from '@material-ui/core/Button';


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

    // load(book) {
    //     this.setState({ books: book })            
    // }

    remove(book) {
        axios.delete(`${baseUrl}/${book.id}`).then(resp => {
            const list = this.state.list.filter(b => b !== book)
            this.setState({ list })
        })
    }
    
    toastedSuccess = () => toast.success('Referência gerada com sucesso!')
    

    renderForm() {
        const booksSchemas = yup.object().shape({
            authorName: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome do Autor obrigatório'),
            book: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome da Obra obrigatório'),
            publisher: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome da Editora obrigatório'),
            local: yup
                .string()
                .min(3)
                .max(50)
                .required('Local da publicação obrigatório'),
            year: yup
                .string()
                .length(4, 'O ano deve conter 4 dígitos')
                .required('Ano de publicação obrigatório')
                .min(4)
                .max(5)
        })
        
        return (
            <div>
                <Formik initialValues={initialState.books}
                    validationSchema={booksSchemas}
                    onSubmit={(values, actions) => {
                        this.setState({ books: values })
                        this.saveAuthorName(values);
                        this.toastedSuccess();
                        actions.resetForm();                                                                    
                        
                }}
                >
                    {props =>
                        <Form className="form-group mr-5"  >
                            <label className="mt-2"><b> Nome do Autor </b></label>
                            <Field type="text" className="form-control" name="authorName" placeholder="ex: Paulo Freire" required/>
                            {props.errors.authorName && props.touched.authorName ? (
                                <div id="error" className="text-danger mt-1">{props.errors.authorName}</div>
                            ) : null}

                            <label className="mt-2"><b> Livro </b></label>
                            <Field type="text" className="form-control" name="book" placeholder="ex: Pedagogia do Oprimido" required />
                            {props.errors.book && props.touched.book ? (
                                <div id="error" className="text-danger mb-2">{props.errors.book}</div>
                            ) : null}

                            <label className="mt-2"><b> Editora </b></label>
                            <Field type="text" className="form-control" name="publisher" placeholder="ex: Companhia das Letras" required />
                            {props.errors.publisher && props.touched.publisher ? (
                                <div id="error" className="text-danger mb-2">{props.errors.publisher}</div>
                            ) : null}

                            <label className="mt-2"><b> Local </b></label>
                            <Field type="text" className="form-control" name="local" placeholder="ex: São Paulo" required />
                            {props.errors.local && props.touched.local ? (
                                <div id="error" className="text-danger mb-2">{props.errors.local}</div>
                            ) : null}

                            <label className="mt-2"><b> Ano </b></label>
                            <Field type="text" className="form-control" name="year" placeholder="ex: 1998" required />
                            {props.errors.year && props.touched.year ? (
                                <div id="error" className="text-danger mb-2">{props.errors.year}</div>
                            ) : null}

                            <Button variant="contained" type="submit" color="primary">
                                Salvar
                            </Button>
                            <Button variant="contained" color="secondary"
                                onClick={props.handleReset}>
                                Cancelar
                            </Button>
                            
                        <ToastContainer />
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
                            {/* <button className="bt btn-warning mr-1" onClick={() => this.load(book)}>
                                <i className="fa fa-pencil"></i>
                            </button> */}
                            <Button variant="contained" color="secondary" onClick={() => this.remove(book)}>
                                <i className="fa fa-trash"></i>
                            </Button>
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
