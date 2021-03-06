import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Dropdown, Grid } from 'semantic-ui-react';
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
      totalPages: 1,
      activeItem: 5
    };
    this.fetchCustomer = this.fetchCustomer.bind(this);
  }

  componentDidMount() {
    this.fetchCustomer();
  }

  //Fetch the Customer Data

  fetchCustomer() {
    axios.get('https://onboardingtalentr.azurewebsites.net/Customers/GetCustomer')
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
    this.deleteModal();
  }

  // Passing and setting Customer details needs to be edited
  setEditModal = (customer) => {
    this.setState({ customer: customer })
    this.editModal();
  }

  // Page Changing function for Pagination
  pageChange = (item, current) => {
    this.setState({
      currentPage: current.activePage,
      totalPages: current.totalPages
    })
  }

  handleInputChange = (e, { value }) => this.setState({ activeItem: value })


  // Semantic UI Form for Customer CURD
  render() {
    const customers = this.state.customers;
    const openAddModal = this.state.openAddModal;
    const openDeleteModal = this.state.openDeleteModal;
    const openEditModal = this.state.openEditModal;
    const customer = this.state.customer;
    const totalItem = this.state.totalItem;
    const currentPage = this.state.currentPage;
    const { activeItem } = this.state

    const options = [
      { key: 1, text: '5', value: 5 },
      { key: 2, text: '10', value: 10 },
      { key: 3, text: '15', value: 15 },
      { key: 4, text: '20', value: 20 },
      { key: 5, text: 'All', value: 100 },
    ]

    return (
      <div>

        <AddNewCustomer
          open={openAddModal}
          addModal={() => this.addModal()}
          fetchCustomer={() => this.fetchCustomer()} />

        <DeleteCustomer
          open={openDeleteModal}
          deleteModal={() => this.deleteModal()}
          fetchCustomer={() => this.fetchCustomer()}
          customer={customer} />

        <EditCustomer
          open={openEditModal}
          editModal={() => this.editModal()}
          fetchCustomer={() => this.fetchCustomer()}
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
              let value = activeItem
              if ((index >= ((currentPage * value) - value)) && (index < (currentPage * value))) {
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
        </Table>

        <Grid id="grid-padding">
          <Grid.Column floated='left' width={5}>
            <Dropdown
              button
              options={options}
              onChange={this.handleInputChange}
              type='range'
              value={activeItem}
            />
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Pagination
              boundaryRange={1}
              activePage={currentPage}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={Math.ceil(totalItem) / activeItem}
              onPageChange={(item, current) => this.pageChange(item, current)}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }

}
