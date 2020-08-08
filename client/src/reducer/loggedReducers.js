var init = {
    login_status: false,
    username: '',
    email: '',
    rule: ''
}

const logggedReducers = (state = init, action) => {
    let newstate = { ...init };
    switch (action.type) {
        case 'Login':
            return state
        default:
            return state;
    }
}
export default logggedReducers;