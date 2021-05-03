import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Pagination } from 'semantic-ui-react';
import AddNewProduct from './AddNewProduct';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';

export default class ProductIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      openAddModal: false,
      openDeleteModal: false,
      openEditModal: false,
      product: {},
      totalItem: 0,
      currentPage: 1,
      totalPages: 1
    };
    this.fetchProduct = this.fetchProduct.bind(this);
  }

  componentDidMount() {
    this.fetchProduct();
  }

  //Fetch the Products Data
  fetchProduct() {
    axios.get('https://onboardingtalent.azurewebsites.net/Products/GetProduct') 
    //axios.get('/Products/GetProduct')
      .then((res) => {
        console.log(res.data);
        this.setState({
          products: res.data,
          totalItem: res.data.length,
          totalPages: Math.ceil(res.data.length / 5)
        })
        if (((res.data.length % 5) == 0) && (this.state.currentPage > Math.ceil(res.data.length / 5))) {
          this.setState({
            currentPage: (this.state.currentPage == 1) ? 1 : this.state.currentPage - 1
          })
        }
      })
  }

 // Trigger open and close of Add Products Model
  addModal = () => {
    this.setState({ openAddModal: !this.state.openAddModal })
  }

  // Trigger open and close of Delete Product Model
  deleteModal = () => {
    this.setState({
      openDeleteModal: !this.state.openDeleteModal
    })
  }

   // Trigger open and close of Edit Product Model
   editModal = () => {
    this.setState({
      openEditModal: !this.state.openEditModal
    })
  }

 // Passing and setting Product details needs to be deleted
  setDeleteModal = (product) => {
    this.setState({ product: product })
    this.deleteModal();
  }

 // Passing and setting Product details needs to be edited
  setEditModal = (product) => {
    this.setState({ product: product })
    this.editModal();
  }

  // Page Changing function for Pagination
  pageChange = (item, current) => {
    this.setState({
      currentPage: current.activePage,
      totalPages: current.totalPages
    })
  }

  // Semantic UI Form for Product CURD
  render() {
    const products = this.state.products;
    const openAddModal = this.state.openAddModal;
    const openDeleteModal = this.state.openDeleteModal;
    const openEditModal = this.state.openEditModal;
    const product = this.state.product;
    const totalItem = this.state.totalItem;
    const currentPage = this.state.currentPage;
    return (
      <div>
        <AddNewProduct
          open={openAddModal}
          addModal={() => this.addModal()} />

        <DeleteProduct
          open={openDeleteModal}
          deleteModal={() => this.deleteModal()}
          product={product} />

        <EditProduct
          open={openEditModal}
          editModal={() => this.editModal()}
          product={product} />
        <Button color='blue' content='Create Product' onClick={this.addModal} />
        <Table celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {products.map((p, index) => {
              if ((index >= ((currentPage * 5) - 5)) && (index < (currentPage * 5))) {
                return (
                  <Table.Row key={p.id}>
                    <Table.Cell>{p.name}</Table.Cell>
                    <Table.Cell>{p.price}</Table.Cell>
                    <Table.Cell>
                      <Button color='yellow' icon='edit' content='Edit' onClick={() => this.setEditModal(p)} />
                    </Table.Cell>
                    <Table.Cell><Button color='red' icon='trash' content='Delete' onClick={() => this.setDeleteModal(p)} />
                    </Table.Cell>
                  </Table.Row>
                )
              }
            })}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="2"></Table.HeaderCell>
              <Table.HeaderCell colSpan="2">
                <Pagination
                  boundaryRange={0}
                  activePage={currentPage}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={Math.ceil(totalItem / 5)}
                  onPageChange={(item, current) => this.pageChange(item, current)}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );

  }
}
