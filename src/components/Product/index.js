import React, {Component} from 'react';
//import PubSub from 'pubsub-js'
import {
    Table,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap'

class FormProduct extends Component {

    state = {model: {
                id:0,
                description: '',
                price: 0,
                quantity: 0
            }
        }

        setValues = (e, field) => {
            const {model} = this.state;
            model[field] = e.target.value
            this.setState({model});
            console.log(this.state.model)
        }

        create = () => {
            this.setState({model: {id:0, description:'', price:0, quantity:0}})
            this.props.productCreate(this.state.model)
        }

        componentWillMount() {
            PubSub.subscribe('edit-product', (topic, product) => {
                this.setState({model: product})
            });
        }

     render() {

         return (
             <Form>
                 <FormGroup>
                     <Label for="description"> Descrição</Label>
                     <Input id="description" type="text" value={this.state.model.description} placeholder="Descrição do Produto..."
                        onChange={e => this.setValues(e, 'description')}
                     />
                 </FormGroup>
                 <FormGroup>
                     <div className="form-row">
                         <div className="col-md-6">
                             <Label for="price">Preço</Label>
                             <Input id="price" type="text" value={this.state.model.price} placeholder="R$ "
                                onChange={e => this.setValues(e, 'price')}
                             />
                         </div>
                         <div className="col-md-6">
                             <Label for="quantity">Quantidade</Label>
                             <Input id="quantity" type="text" value={this.state.model.quantity} placeholder="Quantidade de produtos"
                                onChange={e => this.setValues(e, 'quantity')}
                             />
                         </div>
                     </div>
                 </FormGroup>
                 <Button color="info" block onClick={this.create}>Gravar</Button>
             </Form>
         )
     }
}

class ListProduct extends Component {

    delete = (id) => {
        this.props.deleteProduct(id)
    }

    onEdit = (product) => {
        
    }

    render() {
        const {products} = this.props;
        return (
           <Table className="table-bordered text-center">
               <thead className="thead-dark">
                   <tr>
                       <th>Descrição</th>
                       <th>Preço</th>
                       <th>Qtde.</th>
                       <th>Actions</th>
                   </tr>
               </thead>
               <tbody>
                   {
                       products.map(product => (
                            <tr key={product.id}>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <Button color="info" size="sm" onClick={e => this.onEdit(product)}>Editar</Button>
                                    <Button color="danger" onClick={e => this.delete(product.id)} size="sm">Deletar</Button>
                                </td>
                            </tr>
                       ))
                   }
               </tbody>
           </Table>
        )
    }
}

export default class ProductBox extends Component {

    Url = "http://localhost:9000/products"

    state = {
        products: [],

    }

    componentDidMount() {
        fetch(this.Url)
            .then(response => response.json())
            .then(products => this.setState({products: [{"id": 1, "description": "Novo Produto", "price": 10, "quantity": 10, "status": 1}]}))
            .catch(e => console.log(e))
            this.setState({products: [{"id": 1, "description": "Novo Produto", "price": 10, "quantity": 10, "status": 1}]})
        
    }

    save = (product) => {
        let data = {
            id: parseInt(product.id),
            description: product.description,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity),
        }
        console.log(data)

        const requestInfo = {
            method: data.id !== 0? 'PUT':'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        if(data.id === 0) {
            // CREATE NEW PRODUCT
            fetch(this.Url, requestInfo)
            .then(response => response.json())
            .then(newProduct => {
                let {products} = this.state;
                products.push(newProduct);
                this.setState({products});
            })
            .catch(e => console.log(e))
        }
        else {
            // EDIT PRODUCT
            fetch(`${this.Url}/${data.id}`, requestInfo)
            .then(response => response.json())
            .then(updatedProduct => {
                let {products} = this.state;
                let position = product.findIndex(product => product.id == data.id);
                products[position] = updatedProduct;
                this.setState({products});
            })
            .catch(e => console.log(e))
        }

    }

    delete = (id) => {
        fetch(`${this.Url}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(rows => {
            const products = this.state.products.filter(product => product.id !== id);
            this.setState({products})
        })
        .catch(e => console.log(e))
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6 my-3">
                    <h2 className="font-weight-bold text-center">Cadastro de Produtos </h2>
                    <FormProduct productCreate={this.save} />
                </div>
                <div className="col-md-6 my-3">
                    <h2 className="font-weight-bold text-center">Lista de Produtos </h2>
                    <ListProduct products={this.state.products} deleteProduct={this.delete} />
                </div>
            </div>
        );
    }
}