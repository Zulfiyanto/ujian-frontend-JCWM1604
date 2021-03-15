import React, { Component } from 'react';
import axios from 'axios';

import { Route, Switch } from 'react-router';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import { LoginActionThunk } from './redux/actions';
import { API_URL } from './helper';
import { connect } from 'react-redux';

import Cart from './pages/user/Cart';
import History from './pages/user/History';
import ProductDetail from './pages/ProductDetail';

class App extends Component {
    state = {
        isLoading: true,
    };
    // * keep login
    componentDidMount() {
        let id = localStorage.getItem('id');

        axios
            .get(`${API_URL}/users/${id}`)
            .then((res) => {
                console.log(res);
                this.props.LoginActionThunk(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }
    render() {
        return (
            <div className="background">
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/product/:idprod" component={ProductDetail} />
                    <Route path="/cart" exact component={Cart} />
                    <Route path="/history" exact component={History} />
                </Switch>
            </div>
        );
    }
}

const MaptstatetoProps = (state) => {
    return {
        dataUser: state.Auth,
    };
};
export default connect(MaptstatetoProps, { LoginActionThunk })(App);
