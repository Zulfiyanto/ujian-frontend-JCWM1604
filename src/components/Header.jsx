import React, { Component } from 'react';
import './styleComponent.css';
import { FiLogIn } from 'react-icons/fi';
import { Modal, ModalBody, Alert } from 'reactstrap';
import Login from '../img/login-pict.jpg';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { LoginActionThunk, ResetActionThunk, LogoutAction } from '../redux/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Logo from '../img/Logo.svg';

const StyledBadge = withStyles((theme) => ({
    badge: {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
        color: 'white',
    },
}))(Badge);

class Header extends Component {
    state = { modal: false, isVisible: false, email: '', password: '', isOpen: 'false' };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    togglePass = () => {
        this.setState({ isVisible: !this.state.isVisible });
    };

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onLoginSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.email);
        const { email, password } = this.state;

        var data = {
            email: email,
            password,
        };
        this.props.LoginActionThunk(data);
    };

    onLogoutClick = () => {
        localStorage.removeItem('id');
        this.props.LogoutAction();
    };
    render() {
        return (
            <div className="header">
                <div className="image">
                    <Link to="/">
                        <img style={{ width: '10%' }} src={Logo} alt="" />
                    </Link>
                </div>

                <div className="header--right">
                    <Modal
                        size="lg"
                        contentClassName="padding"
                        style={{ maxWidth: '1600px', width: '80%', color: '#14151a' }}
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                    >
                        <ModalBody>
                            <div className="login">
                                <div className="pict">
                                    <img src={Login} alt="" />
                                </div>

                                <form className="input" onSubmit={this.onLoginSubmit}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="input-box"
                                        name="email"
                                        onChange={this.onInputChange}
                                        value={this.state.email}
                                    />

                                    <input
                                        type={this.state.isVisible ? 'text' : 'password'}
                                        className=" input-box"
                                        placeholder="Password"
                                        name="password"
                                        onChange={this.onInputChange}
                                        value={this.state.password}
                                    />
                                    <div className="eye">
                                        {this.state.isVisible ? (
                                            <AiFillEye
                                                style={{ fontSize: '1.5em', color: 'white' }}
                                                onClick={this.togglePass}
                                            />
                                        ) : (
                                            <AiFillEyeInvisible
                                                style={{ fontSize: '1.5em', color: '#9f9f9f' }}
                                                onClick={this.togglePass}
                                            />
                                        )}
                                    </div>

                                    <button
                                        style={{
                                            backgroundColor: '#02A6A6',
                                            border: 'none',
                                            borderRadius: '50px',
                                            fontWeight: 700,
                                            color: 'white',
                                            width: '50%',
                                            height: '6vh',
                                            marginTop: '10px',
                                        }}
                                        submit={true}
                                        onClick={this.toggle}
                                    >
                                        Login
                                    </button>

                                    {this.props.dataUser.error ? (
                                        <Alert color="danger mt-2">
                                            {this.props.dataUser.error}{' '}
                                            <span className="float-right" onClick={this.props.ResetActionThunk}>
                                                X
                                            </span>
                                        </Alert>
                                    ) : null}
                                </form>
                            </div>
                        </ModalBody>
                    </Modal>
                    {this.props.dataUser.islogin ? (
                        <div className="role-user">
                            <Link to="/history">
                                <button className="history-btn">
                                    <FiLogIn className="icon-all" />
                                    History
                                </button>
                            </Link>
                            <div className="cart-icon">
                                <Link to="/cart">
                                    <IconButton aria-label="cart">
                                        <ShoppingCartIcon style={{ color: 'white' }} />
                                        {this.props.dataUser.cart.length ? (
                                            <StyledBadge
                                                badgeContent={this.props.dataUser.cart.length}
                                                color="secondary"
                                            ></StyledBadge>
                                        ) : null}
                                    </IconButton>
                                </Link>
                            </div>

                            <div className="user-name">
                                <h5 style={{ marginRight: '20px', color: 'white' }}>Hi, {this.props.dataUser.email}</h5>
                                <Link to="/">
                                    <ExitToAppIcon onClick={this.onLogoutClick} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button className="tmbl" onClick={() => this.setState({ modal: true })}>
                                <FiLogIn className="icon-all" />
                                Login
                            </button>
                        </>
                    )}
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

export default connect(MaptstatetoProps, {
    LoginActionThunk,
    ResetActionThunk,
    LogoutAction,
})(Header);
