import React, { Component } from 'react'
import Main from '../../components/template/Main'
import axios from 'axios'
import './MagazineReferences.css'
import { Formik, Field, Form } from 'formik'
import * as yup from 'yup'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 

const baseUrl = 'http://localhost:3001/magazines'

const initialState = {
    magazines: { authorName: '', article: '', magazine:'', local: '', volOrYear: '', 
        edition: '', pages: '', date: '' },
    list: []
}

export default class MagazinesReferences extends Component {
    state = { ...initialState}

    constructor(props) {
        super(props)

        this.save = this.save.bind(this)
        this.saveAuthorName = this.saveAuthorName.bind(this)

    }
    

    componentDidMount() {
        axios(baseUrl).then(resp => {
            this.setState( { list: resp.data })
        })
    }

    save(magazine) {        
        const method = magazine.id ? 'put' : 'post'
        const url = magazine.id ? `${baseUrl}/${magazine.id}` : baseUrl

        axios[method](url, magazine)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ magazine: initialState.magazines, list })
            })
        
     }

    getUpdatedList(magazines) {
        const list = this.state.list.filter(magazine => magazine.id !== magazines.id)
        list.unshift(magazines)
        return list
    }

    saveAuthorName() {
        const magazine = this.state.magazines
        const name = magazine.authorName

        const arrayName = name.split(' ')
        const authorLastName = arrayName.pop().toUpperCase()
        const authorNewName = arrayName.slice([0, [arrayName.length - 1]]).join(' ')

        magazine.authorName = (authorLastName) + ', ' + (authorNewName)
        this.setState({ magazines: magazine })

        this.save(magazine)
    }

    load(magazine) {
        this.setState({ magazine })
        
    }

    remove(magazine) {
        axios.delete(`${baseUrl}/${magazine.id}`).then(resp => {
            const list = this.state.list.filter(b => b !== magazine)
            this.setState({ list })
        })
    }

    toastedSuccess = () => toast.success('Referência gerada com sucesso!')

    renderForm() {
        const magazineSchemas = yup.object().shape({
            authorName: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome do Autor obrigatório'),
            article: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome do Trabalho é obrigatório'),
            magazine: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome da Revista é obrigatório'),
            local: yup
                .string()
                .min(2)
                .max(50)
                .required('Nome do local é obrigatório'),
            volOrYear: yup
                .string()
                .min(2)
                .max(8)
                .required('Ano/volume é obrigatório'),
            edition: yup
                .string()
                .min(2)
                .max(5)
                .required('Nº de edição obrigatório'),
            pages: yup
                .string()
                .min(2)
                .max(13)
                .required('Nº de páginas obrigatório'),
            date: yup
                .string()
                .required('Data de publicação obrigatório')
                .min(8)
                .max(25)

        })
        return (
            <div>
                <Formik initialValues={initialState.magazines}
                    validationSchema={magazineSchemas}
                    onSubmit={(values, actions) => {
                        this.setState({ magazines: values })
                        this.saveAuthorName(values);
                        actions.resetForm();
                        this.toastedSuccess();
                    }}
                >
                    {props => (
                        <Form className="form-group mr-5"  >
                            <label className="mb-2"> <b> Nome do Autor</b> </label>
                            <Field type="text" className="form-control" name="authorName" placeholder="ex: Antonio Candido" required />
                            {props.errors.authorName && props.touched.authorName ? (
                                <div id="error" className="text-danger mt-1">{props.errors.authorName}</div>
                            ) : null}

                            <label className="mt-2"> <b> Nome do Artigo </b></label>
                            <Field type="text" className="form-control" name="article" placeholder="ex: Literatura e Subdesenvolvimento" required />
                            {props.errors.article && props.touched.article ? (
                                <div id="error" className="text-danger mt-1">{props.errors.article}</div>
                            ) : null}

                            <label className="mt-2"> <b> Nome da Revista </b></label>
                            <Field type="text" className="form-control" name="magazine" placeholder="ex: Lancet" required />
                            {props.errors.magazine && props.touched.magazine ? (
                                <div id="error" className="text-danger mt-1">{props.errors.magazine}</div>
                            ) : null}

                            <label className="mt-2"> <b> Local </b></label>
                            <Field type="text" className="form-control" name="local" placeholder="ex: Brasília" required />
                            {props.errors.local && props.touched.local ? (
                                <div id="error" className="text-danger mt-1">{props.errors.local}</div>
                            ) : null}

                            <label className="mt-2"> <b> Volume/Ano da Revista </b></label>
                            <Field type="text" className="form-control" name="volOrYear" placeholder="ex: v. 3" required />
                            {props.errors.volOrYear && props.touched.volOrYear ? (
                                <div id="error" className="text-danger mt-1">{props.errors.volOrYear}</div>
                            ) : null}

                            <label className="mt-2"> <b> Número da Edição </b></label>
                            <Field type="text" className="form-control" name="edition" placeholder="ex: n. 18" required />
                            {props.errors.edition && props.touched.edition ? (
                                <div id="error" className="text-danger mt-1">{props.errors.edition}</div>
                            ) : null}

                            <label className="mt-2"> <b> Páginas </b></label>
                            <Field type="text" className="form-control" name="pages" placeholder="ex: p. 25-28" required />
                            {props.errors.pages && props.touched.pages ? (
                                <div id="error" className="text-danger mt-1">{props.errors.pages}</div>
                            ) : null}

                            <label className="mt-2"> <b> Data da Publicação </b></label>
                            <Field type="text" className="form-control" name="date" placeholder="ex: 15 mar. 2010" required />
                            {props.errors.date && props.touched.date ? (
                                <div id="error" className="text-danger mt-1">{props.errors.date}</div>
                            ) : null}

                            <button type="submit" className="btn-primary mt-3 mb-3 ml-5">
                                Salvar
                            </button>
                            <button className="btn-danger mt-3 mb-3 ml-3 mr-5"
                                onClick={props.handleReset}>
                                Cancelar
                            </button>
                            <ToastContainer />
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

        return this.state.list.map(magazine => {
            return (
                <tr key={magazine.id}>
                    <td> {magazine.authorName}. {magazine.article}.
                    <span className="font-weight-bold"> {magazine.magazine}</span>, {magazine.local}, {magazine.volOrYear}, {magazine.edition}, {magazine.pages}, {magazine.date}.
                    </td>
                    <td>
                        <button className="bt btn-warning mr-1" onClick={() => this.load(magazine)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="bt btn-danger" onClick={() => this.remove(magazine)}>
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