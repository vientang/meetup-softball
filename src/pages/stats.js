import React from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStats } from '../graphql/queries';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        API.graphql(graphqlOperation(listGameStats)).then(response => {
            console.log('response', response);
        }).catch(error => {
            console.log('error', error);
        })
    }

    render() {

        return (
            <div>stats page</div>
        );
    }
}

export default Stats;
