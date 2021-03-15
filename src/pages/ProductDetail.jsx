import React, { Component } from 'react';

import axios from 'axios';
import { API_URL, currencyFormatter } from '../helper';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { CartAction } from '../redux/actions/AuthAction';

class ProductDetail extends Component {
    state = {
        product: {},
        loading: true,
        qty: 1,
    };

    onAddToCartClick = () => {
        if (this.props.dataUser.islogin === false) {
            alert(' tidak boleh beli');
        } else {
            let id = this.props.dataUser.id;
            let idprod = this.state.product.id;
            let stok = this.state.product.stok;
            axios
                .get(`${API_URL}/users/${id}`)
                .then((res) => {
                    var cart = res.data.cart; //cart adalah array

                    let findIdx = cart.findIndex((val) => val.id === idprod);
                    if (findIdx < 0) {
                        let data = {
                            ...this.state.product,
                            qty: this.state.qty,
                        };
                        // rekayasa array
                        cart.push(data);
                        // update data
                        axios
                            .patch(`${API_URL}/users/${id}`, { cart: cart }) // expektasi data yang dikrim harus object
                            .then((res1) => {
                                console.log(res1.data);
                                this.props.CartAction(res1.data.cart);
                                alert('cart berhasil');
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        let qtyakhir = cart[findIdx].qty + this.state.qty; //4 //2
                        if (qtyakhir > stok) {
                            // rekayasa array
                            var qtyablebuy = stok - cart[findIdx].qty;
                            alert('barang dicart melebihi stok barang yang bisa dibeli hanya ' + qtyablebuy);
                        } else {
                            cart[findIdx].qty = qtyakhir; //?cart adalah array karena di db.json itu array
                            axios
                                .patch(`${API_URL}/users/${id}`, { cart: cart }) // ?ekspektasi data yang dikrim harus object
                                .then((res1) => {
                                    console.log(res1.data);
                                    this.props.CartAction(res1.data.cart);
                                    alert('cart berhasil');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    componentDidMount() {
        var idprod = this.props.match.params.idprod;
        var data = this.props.location.state;
        if (!data) {
            axios
                .get(`${API_URL}/products/${idprod}?_expand=category`)
                .then((res) => {
                    this.setState({ product: res.data });
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        } else {
            this.setState({ product: data.product, loading: false });
        }
    }

    onQtyClick = (operator) => {
        if (operator === 'tambah') {
            var hasil = this.state.qty + 1;
            if (hasil > this.state.product.stok) {
                alert('melebihi stock');
            } else {
                this.setState({ qty: this.state.qty + 1 });
            }
        } else {
            var hasil = this.state.qty - 1;
            if (hasil < 1) {
                alert('nggak boleh kurang dari 1');
            } else {
                this.setState({ qty: this.state.qty - 1 });
            }
        }
    };

    onAddToCartClick = () => {
        if (this.props.dataUser.islogin === false) {
            alert(' tidak boleh beli');
        } else {
            let id = this.props.dataUser.id;
            let idprod = this.state.product.id;
            let stok = this.state.product.stok;
            axios
                .get(`${API_URL}/users/${id}`)
                .then((res) => {
                    var cart = res.data.cart; //cart adalah array

                    let findIdx = cart.findIndex((val) => val.id === idprod);
                    if (findIdx < 0) {
                        let data = {
                            ...this.state.product,
                            qty: this.state.qty,
                        };
                        // rekayasa array
                        cart.push(data);
                        // update data
                        axios
                            .patch(`${API_URL}/users/${id}`, { cart: cart }) // expektasi data yang dikrim harus object
                            .then((res1) => {
                                console.log(res1.data);
                                this.props.CartAction(res1.data.cart);
                                alert('cart berhasil');
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        let qtyakhir = cart[findIdx].qty + this.state.qty; //4 //2
                        if (qtyakhir > stok) {
                            // rekayasa array
                            var qtyablebuy = stok - cart[findIdx].qty;
                            alert('barang dicart melebihi stok barang yang bisa dibeli hanya ' + qtyablebuy);
                        } else {
                            cart[findIdx].qty = qtyakhir; //?cart adalah array karena di db.json itu array
                            axios
                                .patch(`${API_URL}/users/${id}`, { cart: cart }) // ?ekspektasi data yang dikrim harus object
                                .then((res1) => {
                                    console.log(res1.data);
                                    this.props.CartAction(res1.data.cart);
                                    alert('cart berhasil');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    render() {
        return (
            <div>
                <div className="container" style={{ height: '100vh' }}>
                    <div className="bg-transparent">
                        <Breadcrumb className="mt-5 bg-transparent">
                            <BreadcrumbItem>
                                <Link to="/">Home</Link>
                            </BreadcrumbItem>

                            <BreadcrumbItem active>{this.state.product.name}</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div className="row mt-2 ">
                        <div className="col-md-6 shadow">
                            <img src={this.state.product.img} alt="product" width="100%" height="400vh" />
                        </div>
                        <div className="col-md-6">
                            <div className=" display-4 my-2" style={{ color: 'white' }}>
                                {this.state.product.name}
                            </div>

                            <div className="font-weight-bold my-2 mb-5" style={{ fontSize: '35px', color: 'white' }}>
                                {currencyFormatter(this.state.product.price * this.state.qty)}
                            </div>
                            <div className="d-flex mb-5">
                                <button
                                    className=""
                                    style={{
                                        fontSize: 35,
                                        padding: 'auto',
                                        width: '13%',
                                        borderRadius: '100%',
                                        border: 'none',
                                        backgroundColor: '#042a0f',
                                        color: '#15d04c',
                                    }}
                                    onClick={() => this.onQtyClick('kurang')}
                                >
                                    -
                                </button>
                                <div
                                    className="w-25 d-flex justify-content-center align-items-center"
                                    style={{ fontSize: 35, color: 'white' }}
                                >
                                    {this.state.qty}
                                </div>
                                <button
                                    className="py-2 px-2 "
                                    style={{
                                        fontSize: 35,
                                        padding: 'auto',
                                        width: '13%',
                                        borderRadius: '100%',
                                        border: 'none',
                                        backgroundColor: '#042a0f',
                                        color: '#15d04c',
                                    }}
                                    onClick={() => this.onQtyClick('tambah')}
                                >
                                    +
                                </button>
                            </div>
                            <div className="my-3">
                                <button
                                    className="w-50 py-2"
                                    onClick={this.onAddToCartClick}
                                    style={{
                                        backgroundColor: '#02A6A6',
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontWeight: 700,
                                        color: 'white',
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
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
export default connect(MaptstatetoProps, { CartAction })(ProductDetail);
