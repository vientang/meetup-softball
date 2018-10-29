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
      dataSubmitted: false,
    };
  }

  async componentDidMount() {
    //let data = await API.get('player-statsCRUD', '/player-stats').then(stats => {
    //  this.setState(() => ({ data: stats }));
    //  return stats;
    //}).catch(error => console.log(error.response.data));
    await API.get('game-statsCRUD', '/game-stats').then(stats => {
      console.log('async stats on mount', stats);
      this.setState(() => ({ data: stats }));
    }).catch(error => console.log(error));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.dataSubmitted) {
      API.get('game-statsCRUD', '/game-stats').then(stats => {
        console.log('game stats updated', stats);
        this.setState(() => ({ data: stats, dataSubmitted: false }));
      }).catch(error => console.log(error));
    }
  }

  handleSubmitData = (stats) => {
    // send stats to dynamo
    const gamestats = {
      id: 'game15', // get from meetup api
      isTournament: false, // get from meetup api
      winners: {
        players: stats,
      },
    };
    this.setState(() => ({ data: stats, dataSubmitted: true, gameData: gamestats }));
    API.del('game-statsCRUD', '/game-stats/object/' + gamestats.id).then((stats) => {
      console.log('del', stats);
    });
    API.post('game-statsCRUD', '/game-stats', { body: gamestats });
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
