const initialState = {
    value: null,
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state.value + 1
        case 'DECREMENT':
            return state.value - 1
    }
    return state
}

export default reducer;