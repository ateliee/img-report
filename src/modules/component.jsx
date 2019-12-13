import React  from 'react';

export default class ReactComponent extends React.Component {
    constructor(props) {
        super(props)
        Object.getOwnPropertyNames(this.__proto__).forEach(func =>
            this[func] = this[func].bind(this)
        )
    }
}