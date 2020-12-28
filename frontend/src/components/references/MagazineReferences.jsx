import React, { Component } from 'react'
import Main from '../../components/template/Main'
import axios from 'axios'
import './MagazineReferences.css'
import { Formik, Field, Form } from 'formik'

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

    renderForm() {
        
        return (
            <div>
                <Formik initialValues={initialState.magazines}
                    onSubmit={(values, actions) => {
                        this.setState({ magazines: values })
                        this.saveAuthorName(values);
                        actions.resetForm();                        
                        //tentar passar os values gerados do formik para o state
                }}
                >
                    {props => (
                        <Form className="form-group mr-5"  >
                            <label> Nome do Autor</label>
                            <Field type="text" className="form-control" name="authorName" required/>
                            <label> Nome do Artigo</label>
                            <Field type="text" className="form-control" name="article" required/>
                            <label> Nome da Revista</label>
                            <Field type="text" className="form-control" name="magazine" required />
                            <label> Local</label>
                            <Field type="text" className="form-control" name="local" required/>
                            <label> Volume/Ano da Revista</label>
                            <Field type="text" className="form-control" name="volOrYear" required/>
                            <label> Número da Edição</label>
                            <Field type="text" className="form-control" name="edition" required/>
                            <label> Páginas</label>
                            <Field type="text" className="form-control" name="pages" required/>
                            <label> Data da Publicação</label>
                            <Field type="text" className="form-control" name="date" required/>

                            <button type="submit" className="btn-danger mt-3 mb-3 ml-5">
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