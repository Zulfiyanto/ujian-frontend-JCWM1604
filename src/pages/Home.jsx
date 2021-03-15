import { Container, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { Component } from 'react';
import './stylePages.css';
import { API_URL, currencyFormatter } from '../helper';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Home extends Component {
    state = { products: [] };
    componentDidMount() {
        axios
            .get(`${API_URL}/products`)
            .then((res) => {
                this.setState({
                    products: res.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidUpdate(prevprops, prevstate) {
        if (this.state.page !== prevstate.page) {
            axios
                .get(`${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=5 `)
                .then((res) => {
                    this.setState({
                        products: res.data,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    renderProduct = () => {
        if (this.state.products.length === 0) {
            return (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        height: '63vh',
                        width: '243%',
                        backgroundColor: 'lightgray',
                    }}
                >
                    <h1>Data Tidak Ditemukan</h1>
                </div>
            );
        }

        return this.state.products.map((val, index) => {
            console.log(this.state.products);
            return (
                <div className="kartu mr-5" key={val.id}>
                    <div className="kartu-img">
                        <img src={val.img} alt="" />
                    </div>
                    <div className="price">
                        <p>{currencyFormatter(val.price)}</p>
                    </div>
                    <div className="kartu-body">
                        <Typography variant="h4" component="h2" className="mt-1 text-white">
                            {val.name}
                        </Typography>
                        <p>{val.description}</p>
                        <Link to={{ pathname: `/product/${val.id}`, state: { product: val } }}>
                            <button onClick={this.onAddToCartClick} className="tmbl-beli">
                                Beli
                            </button>
                        </Link>
                    </div>
                </div>
            );
        });
    };

    render() {
        return (
            <div className="main">
                <Container maxWidth="lg">
                    <Typography variant="h3" component="h2" className="mt-4 text-white">
                        SALES
                    </Typography>
                    <Typography variant="h5" component="h2" className="mt-4 text-muted">
                        A Great Way To Genarate All The Motivation You Need To Get Fit
                    </Typography>

                    <div className="row d-flex justify-content-space-between">{this.renderProduct()}</div>
                </Container>
            </div>
        );
    }
}

const MaptstatetoProps = (state) => {
    return {
        dataUser: state.Auth,
    };
};
export default connect(MaptstatetoProps)(Home);
