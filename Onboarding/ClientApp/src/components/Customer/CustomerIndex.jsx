import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Pagination } from 'semantic-ui-react';
import AddNewCustomer from './AddNewCustomer';
import EditCustomer from './EditCustomer';
import DeleteCustomer from './DeleteCustomer';

export default class CustomerIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      openAddModal: false,
      openDeleteModal: false,
      openEditModal: false,
      customer: {},
      totalItem: 0,
      currentPage: 1,
      totalPages: 1
    };
    this.fetchCustomer = this.fetchCustomer.bind(this);
  }

  componentDidMount() {
    this.fetchCustomer();
  }

  //Fetch the Customer Data

  fetchCustomer() {
    axios.get('https://ReactOnboarding.azurewebsites.net/Customers/GetCustomer') 
    //axios.get('/Customers/GetCustomer')
      .then((res) => {
        console.log(res.data);
        this.setState({
          customers: res.data,
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

 // Trigger open and close of Add Customer Model
  addModal = () => {
    this.setState({ openAddModal: !this.state.openAddModal })
    // console.log("Customers:addModal")
  }

  // Trigger open and close of Delete Customer Model
  deleteModal = () => {
    this.setState({
      openDeleteModal: !this.state.openDeleteModal
    })
  }

   // Trigger open and close of Edit Customer Model
   editModal = () => {
    this.setState({
      openEditModal: !this.state.openEditModal
    })
  }

 // Passing and setting Customer details needs to be deleted
  setDeleteModal = (customer) => {
    this.setState({ customer: customer })
   // console.log("Customers:setDeleteModal:Name: " + customer.name + " address: " + customer.address);
    this.deleteModal();
  }

 // Passing and setting Customer details needs to be edited
  setEditModal = (customer) => {
    this.setState({ customer: customer })
   // console.log("Customers:setEditModal:Name: " + customer.name + " address: " + customer.address);
    this.editModal();
  }

  // Page Changing function for Pagination
  pageChange = (item, current) => {
    this.setState({
      currentPage: current.activePage,
      totalPages: current.totalPages
    })
  }

  // Semantic UI Form for Customer CURD
  render() {
    console.log("Customers:render");
    const customers = this.state.customers;
    const openAddModal = this.state.openAddModal;
    const openDeleteModal = this.state.openDeleteModal;
    const openEditModal = this.state.openEditModal;
    const customer = this.state.customer;
    const totalItem = this.state.totalItem;
    const currentPage = this.state.currentPage;
    return (
      <div>
        <AddNewCustomer
          open={openAddModal}
          addModal={() => this.addModal()} />

        <DeleteCustomer
          open={openDeleteModal}
          deleteModal={() => this.deleteModal()}
          customer={customer} />

        <EditCustomer
          open={openEditModal}
          editModal={() => this.editModal()}
          customer={customer} />
        <Button color='blue' content='Create Customer' onClick={this.addModal} />
        <Table celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {customers.map((c, index) => {
              if ((index >= ((currentPage * 5) - 5)) && (index < (currentPage * 5))) {
                return (
                  <Table.Row key={c.id}>
                    <Table.Cell>{c.name}</Table.Cell>
                    <Table.Cell>{c.address}</Table.Cell>
                    <Table.Cell>
                      <Button color='yellow' icon='edit' content='Edit' onClick={() => this.setEditModal(c)} />
                    </Table.Cell>
                    <Table.Cell><Button color='red' icon='trash' content='Delete' onClick={() => this.setDeleteModal(c)} />
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
