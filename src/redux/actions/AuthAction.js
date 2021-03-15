import axios from 'axios';
import { API_URL } from '../../helper';

//* without thunk
export const CartAction = (input) => {
    return {
        type: 'UPDATECART',
        cart: input,
    };
};

export const LoginAction = (input) => {
    return {
        type: 'LOGIN',
        payload: input,
    };
};

export const LogoutAction = () => {
    return { type: 'LOGOUT' };
};
export const ResetAction = () => {
    return {
        type: 'RESET',
    };
};
export const ResetActionThunk = () => {
    return (dispatch) => {
        dispatch({ type: 'RESET' });
    };
};

export const ErrorAction = (errmess) => {
    return {
        type: 'ERROR',
        error: errmess,
    };
};

// TODO Register
//? 1. input email, password , comfirm password dimana punya besar dan kecil minimal 6 char
//? 2. sama atau nggak pass dan confirmpass, jika beda jangan dilanjutkan kasih tau user untuk ubah
//? 3. di cek di axios bahwa email sudah digunakan atau tidak
//? 4. jika sudah digunakan maka kasih tau user bahwa email telah dipakai, jika tidak lanjutkan ke step 5
//? 5. post data  ke json-server data users
//? 6. jika berhasil, redirect langsung ke home dengan cara mengupdate data Auth reducers sama seperti Login
//?. cat: jangan lupa set localstroge seperti login agar dia bisa keep login

//* with thunk
export const LoginActionThunk = (input) => {
    var { email, password } = input;
    let data = {
        email,
        password,
        role: 'users',
    };
    return (dispatch) => {
        dispatch({ type: 'LOADING' });
        axios
            .get(`${API_URL}/users?email=${email}&password=${password}`)
            .then((res) => {
                if (res.data.length) {
                    localStorage.setItem('id', res.data[0].id);
                    dispatch({ type: 'LOGIN', payload: res.data[0] });
                } else {
                    axios
                        .get(`${API_URL}/users?email=${email}`)
                        .then((res1) => {
                            let validation = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])').test(password);
                            if (res1.data.length) {
                                dispatch({ type: 'ERROR', error: 'email telah terdaftar' });
                            } else if (!email && !password) {
                                dispatch({ type: 'ERROR', error: 'pastikan semua harus diisi' });
                            } else if (password.length < 6) {
                                dispatch({ type: 'ERROR', error: 'password harus minimal 6 karakter' });
                            } else if (validation === false) {
                                dispatch({
                                    type: 'ERROR',
                                    error: 'password harus ada unsur angka , uppercase dan lowercase',
                                });
                            } else {
                                axios
                                    .post(`${API_URL}/users`, data)
                                    .then((res2) => {
                                        console.log(res2.data);
                                        localStorage.setItem('id', res2.data.id);
                                        dispatch({ type: 'LOGIN', payload: res2.data });
                                    })
                                    .catch((err) => {
                                        dispatch({ type: 'ERROR', error: 'server error' });
                                    });
                            }
                        })
                        .catch((err) => {
                            dispatch({ type: 'ERROR', error: 'server error' });
                        });
                }
            })
            .catch((err) => {
                // console.log(err.response.statusText);
                dispatch({ type: 'ERROR', error: 'server error' });
            });
    };
};

export const RegActionThunk = (input) => {
    return (dispatch) => {
        var { email, password, confirmpass } = input;
        let data = {
            email,
            password,
            role: 'users',
        };
        if (password === confirmpass) {
            dispatch({ type: 'LOADING' });
            axios
                .get(`${API_URL}/users?email=${email}`)
                .then((res1) => {
                    let validation = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])').test(password);
                    if (res1.data.length) {
                        dispatch({ type: 'ERROR', error: 'email telah terdaftar' });
                    } else if (!email && !password && !confirmpass) {
                        dispatch({ type: 'ERROR', error: 'pastikan semua harus diisi' });
                    } else if (password.length < 6) {
                        dispatch({ type: 'ERROR', error: 'password harus minimal 6 karakter' });
                    } else if (validation === false) {
                        dispatch({ type: 'ERROR', error: 'password harus ada unsur angka , uppercase dan lowercase' });
                    } else {
                        axios
                            .post(`${API_URL}/users`, data)
                            .then((res2) => {
                                console.log(res2.data);
                                localStorage.setItem('id', res2.data.id);
                                dispatch({ type: 'LOGIN', payload: res2.data });
                            })
                            .catch((err) => {
                                dispatch({ type: 'ERROR', error: 'server error' });
                            });
                    }
                })
                .catch((err) => {
                    dispatch({ type: 'ERROR', error: 'server error' });
                });
        } else {
            dispatch({ type: 'ERROR', error: 'confirm dan pass harus sama' });
        }
    };
};
