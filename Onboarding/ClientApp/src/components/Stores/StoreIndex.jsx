import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Pagination } from 'semantic-ui-react';
import AddNewStore from './AddNewStore';
import EditStore from './EditStore';
import DeleteStore from './DeleteStore';

export default class StoreIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      openAddModal: false,
      openDeleteModal: false,
      openEditModal: false,
      store: {},
      totalItem: 0,
      currentPage: 1,
      totalPages: 1
    };
    this.fetchStore = this.fetchStore.bind(this);
  }

  componentDidMount() {
    this.fetchStore();
  }

  //Fetch the Store Data

  fetchStore() {
    axios.get('https://onboardingtalent.azurewebsites.net/Stores/GetStore') 
    //axios.get('/Stores/GetStore')
      .then((res) => {
        console.log(res.data);
        this.setState({
          stores: res.data,
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

  // Trigger open and close of Add Store Model
  addModal = () => {
    this.setState({ openAddModal: !this.state.openAddModal })
  }

  // Trigger open and close of Delete Store Model
  deleteModal = () => {
    this.setState({
      openDeleteModal: !this.state.openDeleteModal
    })
  }

  // Trigger open and close of Edit Store Model
  editModal = () => {
    this.setState({
      openEditModal: !this.state.openEditModal
    })
  }

  // Passing and setting Store details needs to be deleted
  setDeleteModal = (store) => {
    this.setState({ store: store })
    this.deleteModal();
  }

  // Passing and setting Store details needs to be edited
  setEditModal = (store) => {
    this.setState({ store: store })
    this.editModal();
  }

  // Page Changing function for Pagination
  pageChange = (item, current) => {
    this.setState({
      currentPage: current.activePage,
      totalPages: current.totalPages
    })
  }

  // Semantic UI Form for Store CURD
  render() {
    const stores = this.state.stores;
    const openAddModal = this.state.openAddModal;
    const openDeleteModal = this.state.openDeleteModal;
    const openEditModal = this.state.openEditModal;
    const store = this.state.store;
    const totalItem = this.state.totalItem;
    const currentPage = this.state.currentPage;
    return (
      <div>
        <AddNewStore
          open={openAddModal}
          addModal={() => this.addModal()} />

        <DeleteStore
          open={openDeleteModal}
          deleteModal={() => this.deleteModal()}
          store={store} />

        <EditStore
          open={openEditModal}
          editModal={() => this.editModal()}
          store={store} />
        <Button color='blue' content='Create Store' onClick={this.addModal} />
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
            {stores.map((s, index) => {
              if ((index >= ((currentPage * 5) - 5)) && (index < (currentPage * 5))) {
                return (
                  <Table.Row key={s.id}>
                    <Table.Cell>{s.name}</Table.Cell>
                    <Table.Cell>{s.address}</Table.Cell>
                    <Table.Cell>
                      <Button color='yellow' icon='edit' content='Edit' onClick={() => this.setEditModal(s)} />
                    </Table.Cell>
                    <Table.Cell><Button color='red' icon='trash' content='Delete' onClick={() => this.setDeleteModal(s)} />
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
