import React from 'react'
import { API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import Layout from '../components/layout'
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import { Utils } from "../utils";

const layoutStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: 1500,
  minWidth: 1170,
  width: 1170,
  margin: '0 6.0875rem',
  padding: '0px 1.0875rem 1.45rem',
};

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Utils.makeData(), // mock data
    };
  }

  async componentDidMount() {
    let data = await API.get('player-statsCRUD', '/player-stats').then(stats => {
      this.setState(() => ({ data: stats }));
      return stats;
    }).catch(error => console.log(error.response.data));
    console.log('async stats from dynamo', data);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log('componentDidUpdate');
    //let data = API.get('player-statsCRUD', '/player-stats');
    //if(prevState.data[0].id !== this.state.data[0].id){
    //  this.setState({data});
    //}
    //console.log('did update', { prevProps, prevState, snapshot });
  }

  handleSubmitData = (stats) => {
    // send stats to dynamo
    console.log('handleSubmitData', stats);
    const playerstats = {
      id: 'two',
      name: 'two',
      gamesPlayed: 1
    };
    this.setState(() => ({ data: stats }))
    API.post('player-statsCRUD', '/player-stats', { body: playerstats });
  };

  render() {
    const { data } = this.state;

    return (
      <>
        <Layout style={layoutStyle}>
          <AdminSideMenu />
          <AdminStatsTable data={data} onSubmit={this.handleSubmitData} />
        </Layout>
        <pre>{JSON.stringify(data)}</pre>
      </>
    );
  }
}

export default withAuthenticator(Admin);
