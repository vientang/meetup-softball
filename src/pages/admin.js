import React from 'react'
import { Link } from 'gatsby'
import { withAuthenticator } from 'aws-amplify-react'
import Layout from '../components/layout'

import { API } from 'aws-amplify';
//import { Utils } from "../utils";
//import AdminSideMenu from '../components/AdminSideMenu';
//import AdminStatsTable from '../components/AdminStatsTable';

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      // temporarily make mock data
      //data: Utils.makeData()
      data: [],
    };
  }

  componentDidMount() {
    API.get('player-statsCRUD', '/player-stats').then(stats => {
      //console.log('stats', stats);
      this.setState(() => ({ data: stats }))
    }).catch(error => console.log(error.response.data));
    //let data = API.get('player-statsCRUD', '/player-stats');
    //let data = await API.get('player-statsCRUD', '/player-stats');
    //console.log('componentDidMount', data);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log('componentDidUpdate');
    //let data = API.get('player-statsCRUD', '/player-stats');
    //if(prevState.data[0].id !== this.state.data[0].id){
    //  this.setState({data});
    //}
    //console.log('did update', { prevProps, prevState, snapshot });
  }

  handleSubmitData = (event) => {
    // hit the submit button
    // send state.data to server to update
    console.log('handleSubmitData', event);
    const playerstats = {
      id: 'two',
      name: 'two',
      gamesPlayed: 1
    };
    API.post('player-statsCRUD', '/player-stats', { body: playerstats });
  };

  render() {
    const { data } = this.state;

    return (
      <Layout>
        <h1>Hi from the second page</h1>
        <p>Welcome to page 2</p>
        <Link to="/">Go back to the homepage</Link>
        <button onClick={this.handleSubmitData}>Submit</button>
        <pre>{JSON.stringify(data)}</pre>
      </Layout>
    );
  }
}

export default withAuthenticator(Admin);
