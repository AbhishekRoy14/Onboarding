import React, { useState, useEffect } from 'react'
import { Form, Button, Modal } from 'semantic-ui-react'
import axios from 'axios'

const EditStore = (props) => {

  const { open, editModal, store } = props;

  const [changeName, setNameChange] = useState(false)
  const [changeAddress, setChangeAddress] = useState(false)
  const [updateName, setUpdateName] = useState(store.name);
  const [updateAddress, setUpdateAddress] = useState(store.address);
  const [nameErr, setNameErr] = useState({});
  const [addressErr, setAddressErr] = useState({});

  useEffect(() => {
    if (store.name == null && store.address == null) {
      setUpdateName(store.name)
      setUpdateAddress(store.address);
    }
  }, [updateName, updateAddress])

  //Form Validation
  function validate() {
    let nameErr = {};
    let addressErr = {};
    let isValid = true;

    if (!updateName) {
        nameErr = "Name is Required";
        isValid = false;
    }

    if (!updateAddress) {
        addressErr = "Address is Required";
        isValid = false;
    }
    setNameErr(nameErr);
    setAddressErr(addressErr);
    return isValid;
}

  // Edit Store name 
  const editName = (e) => {
    setUpdateName(e.target.value)
    setNameChange(true)
  }

  // Edit Store address
  const editAddress = (e) => {
    setUpdateAddress(e.target.value)
    setChangeAddress(true)
  }

  // Cancel edit store model
  const cancel = () => {
    setNameChange(false);
    setChangeAddress(false);
    editModal();
  }

  //
  const editStore = (storeID) => {
    let stores = {
      id: storeID,
      name: changeName ? updateName : store.name,
      address: changeAddress ? updateAddress : store.address
    }
    setUpdateName(changeName ? updateName : store.name)
    setUpdateAddress(changeAddress ? updateAddress : store.address);

    const isValid = validate();
    if (isValid) {
      axios.put(`https://ReactOnboarding.azurewebsites.net/Stores/PutStore/${storeID}`, stores) 
   // axios.put(`/Stores/PutStore/${storeID}`, stores)
      .then(function (res) {
        console.log(res);
        setNameChange(false)
        setChangeAddress(false)
        editModal();
      })
    }
  }


  // Semantic UI Form for Editing Store Details
  return (
    <Modal open={open} size="small">
      <Modal.Header>Edit Store</Modal.Header>
      <Modal.Description>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input placeholder=' Name' name='updateName' defaultValue={store.name} id="myInput" onChange={(e) => editName(e)} />
          </Form.Field>
          {Object.keys(nameErr).map((key) => {
                        return <span style={{ color: "red" }}>{nameErr[key]}</span>
                    })}
          <Form.Field>
            <label> Address</label>
            <input placeholder=' Address' name='updateAddress' defaultValue={store.address} onChange={(e) => editAddress(e)} />
          </Form.Field>
          {Object.keys(addressErr).map((key) => {
                        return <span style={{ color: "red" }}>{addressErr[key]}</span>
                    })}
        </Form></Modal.Description>
      <Modal.Actions>
        <Button color='black' onClick={() => cancel()}>
          Cancel
        </Button>
        <Button
          content="Edit"
          labelPosition='right'
          icon='checkmark'
          onClick={() => editStore(store.id)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default EditStore