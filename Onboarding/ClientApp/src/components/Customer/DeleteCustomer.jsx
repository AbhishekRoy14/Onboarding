import React, { } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import axios from 'axios'

const DeleteCustomer = (props) => {
  const { open, deleteModal, customer } = props;

  const deleteCustomer = (id) => {
    axios.delete(`https://onboardingtalent.azurewebsites.net/Customers/DeleteCustomer/${id}`) 
    //axios.delete(`/Customers/DeleteCustomer/${id}`)
      .then(function (res) {
        console.log(res);
        deleteModal();
      })
  }

  // Semantic UI Form for Deleting Customer
  return (
    <Modal open={open} size="tiny">

      <Modal.Header>Delete Customer</Modal.Header>
      <Modal.Description>
        <Header>Are you sure?</Header>
      </Modal.Description>
      <Modal.Actions>
        <Button color='black' onClick={() => deleteModal()}>
          Cancel
        </Button>
        <Button
          content="Yes"
          color='red'
          icon='checkmark'
          onClick={() => deleteCustomer(customer.id)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default DeleteCustomer
