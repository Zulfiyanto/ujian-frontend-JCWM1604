import React, { Component } from 'react';

import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { currencyFormatter, API_URL } from '../../helper';
import axios from 'axios';
import { CartAction } from '../../redux/actions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
const Myswal = withReactContent(Swal);

class Cart extends Component {
    state = {
        modal: false,
        stockadmin: [],
        loading: false,
        products: [],
    };

    componentDidMount() {
        // * get data products
        axios
            .get(`${API_URL}/products`)
            .then((res) => {
                this.setState({ products: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onMinusClick = (index) => {
        let cart = this.props.dataUser.cart;
        let hasil = cart[index].qty - 1;
        if (hasil < 1) {
            alert('delete saja jika qty ingin 0');
        } else {
            cart[index].qty = cart[index].qty - 1;
            let iduser = this.props.dataUser.id;
            axios
                .patch(`${API_URL}/users/${iduser}`, { cart: cart })
                .then((res) => {
                    this.props.CartAction(res.data.cart);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    onPlusClick = (index) => {
        // ambil data product dulu dengan id dari index
        let cart = this.props.dataUser.cart;
        let idprod = cart[index].id;
        axios
            .get(`${API_URL}/products/${idprod}`)
            .then((res) => {
                let stock = res.data.stock;
                let qty = cart[index].qty;
                let hasil = qty + 1;
                if (hasil > stock) {
                    toast.error('qty melebihi ' + stock);
                } else {
                    cart[index].qty = hasil;
                    let iduser = this.props.dataUser.id;
                    // refresh cart
                    axios
                        .patch(`${API_URL}/users/${iduser}`, { cart: cart })
                        .then((res) => {
                            this.props.CartAction(res.data.cart);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onDeleteClick = (index) => {
        let cart = this.props.dataUser.cart;
        // start sweetalert
        Myswal.fire({
            title: `Are you sure wanna Delete ${cart[index].name} ?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                // edit cart
                cart.splice(index, 1);
                let iduser = this.props.dataUser.id;
                // refresh cart
                axios
                    .patch(`${API_URL}/users/${iduser}`, { cart: cart })
                    .then((res) => {
                        this.props.CartAction(res.data.cart);
                        Myswal.fire('Deleted!', 'Your Cart has been deleted.', 'success');
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    };

    renderCart = () => {
        return this.props.dataUser.cart.map((val, index) => {
            return (
                <tr key={index}>
                    <td style={{ color: 'white' }}>{index + 1}</td>
                    <td style={{ color: 'white' }}>{val.name}</td>
                    <td style={{ color: 'white' }}>
                        <img src={val.img} alt={val.name} width="200px" height="150px" />
                    </td>
                    <td style={{ color: 'white' }}>{currencyFormatter(val.price)}</td>
                    <td style={{ color: 'white' }}>
                        <button
                            style={{ color: 'white' }}
                            className="btn btn-danger mx-2"
                            onClick={() => this.onMinusClick(index)}
                            disabled={val.qty <= 1 ? true : false}
                        >
                            -
                        </button>
                        {val.qty}
                        <button
                            style={{ color: 'white' }}
                            className="btn btn-success mx-2"
                            onClick={() => this.onPlusClick(index)}
                        >
                            +
                        </button>
                    </td>
                    <td style={{ color: 'white' }}>{currencyFormatter(val.price * val.qty)}</td>
                    <td>
                        <button className="btn btn-danger" onClick={() => this.onDeleteClick(index)}>
                            delete
                        </button>
                    </td>
                </tr>
            );
        });
    };

    //? cara dengan asyn await

    onCheckoutClick = async () => {
        let iduser = this.props.dataUser.id;
        // data input to transaksi
        let data = {
            userId: this.props.dataUser.id,
            tanggal: new Date(),
            status: 'belum bayar',
            products: this.props.dataUser.cart,
            bankId: 0,
            bukti: '',
        };
        // post transaksi
        await axios.post(`${API_URL}/transactions`, data);
        // edit stock products
        var cart = this.props.dataUser.cart;
        var Productsadmin = this.state.products;
        for (let i = 0; i < cart.length; i++) {
            for (let j = 0; j < Productsadmin.length; j++) {
                if (cart[i].id === Productsadmin[j].id) {
                    let stockakhir = Productsadmin[j].stock - cart[i].qty;
                    await axios.patch(`${API_URL}/products/${Productsadmin[j].id}`, {
                        stock: stockakhir,
                    });
                }
            }
        }

        var res1 = await axios.patch(`${API_URL}/users/${iduser}`, { cart: [] });
        // refresh cart dan tutup modal
        this.props.CartAction(res1.data.cart);
        this.setState({ modal: false });
    };

    rendertotal = () => {
        let total = 0;
        this.props.dataUser.cart.forEach((val) => {
            total += val.price * val.qty;
        });
        return total;
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    onInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    renderRadio = () => {
        return this.state.banks.map((val, index) => {
            return (
                <label key={index} className="mx-2">
                    <input
                        type="radio"
                        name="pilihanId"
                        onChange={this.onInputChange}
                        checked={this.state.pilihanId === val.id}
                        value={val.id}
                        className="mr-2"
                    />
                    {val.nama} : {val.norek}
                </label>
            );
        });
    };

    render() {
        if (this.state.loading) {
            return <h1>Loading</h1>;
        }
        return (
            <div>
                <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Checkout</ModalHeader>
                    <ModalBody>Are You Sure Wanna Checkout ?</ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={this.onCheckoutClick}>
                            checkout
                        </button>
                        <button className="btn btn-danger" onClick={this.toggle}>
                            Cancel
                        </button>
                    </ModalFooter>
                </Modal>

                <div className="container mt-5" style={{ height: '80vh' }}>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{ color: 'white' }}>No.</th>
                                <th style={{ color: 'white' }}>Nama</th>
                                <th style={{ color: 'white' }}>Image</th>
                                <th style={{ color: 'white' }}>Harga</th>
                                <th style={{ color: 'white' }}>qty</th>
                                <th style={{ color: 'white' }}>subtotal</th>
                                <th style={{ color: 'white' }}>delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderCart()}
                            <tr>
                                <td style={{ color: 'white' }}></td>
                                <td style={{ color: 'white' }}></td>
                                <td style={{ color: 'white' }}></td>
                                <td style={{ color: 'white' }}></td>
                                <td style={{ color: 'white' }}>Total</td>
                                <td style={{ color: 'white' }}>{currencyFormatter(this.rendertotal())} </td>
                                <td>
                                    <button className="btn btn-success" onClick={() => this.setState({ modal: true })}>
                                        checkout
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}
const MaptstatetoProps = (state) => {
    return {
        dataUser: state.Auth,
    };
};

export default connect(MaptstatetoProps, { CartAction })(Cart);
