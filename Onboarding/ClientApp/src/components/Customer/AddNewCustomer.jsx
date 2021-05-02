import React, { useState, useEffect } from 'react'
import { Form, Button, Header, Modal } from 'semantic-ui-react'
import axios from 'axios'

const AddNewCustomer = (props) => {
    const { open, addModal } = props;
    const [name, setname] = useState(null);
    const [address, setaddress] = useState(null);
    const [nameErr, setNameErr] = useState({});
    const [addressErr, setAddressErr] = useState({});

    useEffect(() => {
    }, [name, address])

    function validate() {
        let nameErr = {};
        let addressErr = {};
        let isValid = true;

        if (!name) {
            nameErr = "Name is Required";
            isValid = false;
        }

        if (!address) {
            addressErr = "Address is Required";
            isValid = false;
        }
        setNameErr(nameErr);
        setAddressErr(addressErr);
        return isValid;
    }

    //Add Customer function
    const addCustomer = () => {
        const isValid = validate();
        if (isValid) {
            axios.post('https://ReactOnboarding.azurewebsites.net/Customers/PostCustomer', {
            //axios.post('/Customers/PostCustomer', {
                name: name,
                address: address
            })
                .then(function (res) {
                    console.log(res);
                    resetData();
                    addModal();
                })
        }
    }


    // Re-setting Add Customer Model fields to null
    const resetData = () => {
        setname(null)
        setaddress(null)
    }

    // Re-setting Add Customer Model fields to null
    const cancel = () => {
        resetData();
        addModal();
    }

    // Semantic UI Form for Adding New Customer
    return (
        <Modal
           
            open={open} size="small"
        >
            <Modal.Header>Create Customer</Modal.Header>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        <label>Customer Name</label>
                        <input placeholder='Name' value={name} type='text' onChange={(e) => setname(e.target.value)} />
                    </Form.Field>
                    {Object.keys(nameErr).map((key) => {
                        return <span style={{ color: "red" }}>{nameErr[key]}</span>
                    })}
                    <Form.Field>
                        <label>Customer Address</label>
                        <input placeholder='Address' value={address} type='text' onChange={(e) => setaddress(e.target.value)} />
                    </Form.Field>
                    {Object.keys(addressErr).map((key) => {
                        return <span style={{ color: "red" }}>{addressErr[key]}</span>
                    })}
                </Form>
            </Modal.Description>
            <Modal.Actions>
                <Button color='black' onClick={() => cancel()}>
                    Cancel
        </Button>
                <Button
                    content="Create"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => addCustomer()}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default AddNewCustomer