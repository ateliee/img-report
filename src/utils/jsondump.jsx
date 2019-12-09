import React from 'react';

export default class JsonDump extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <pre>{JSON.stringify(this.props.children, null, 4)}</pre>
    }
}
