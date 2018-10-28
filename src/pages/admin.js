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
    //let data = await API.get('player-statsCRUD', '/player-stats').then(stats => {
    //  this.setState(() => ({ data: stats }));
    //  return stats;
    //}).catch(error => console.log(error.response.data));
    let data = await API.get('game-statsCRUD', '/game-stats').then(stats => {
      this.setState(() => ({ data: stats }));
      console.log('async stats from dynamo', stats);
      return stats;
    }).catch(error => console.log(error));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    API.get('game-statsCRUD', '/game-stats').then(stats => {
      //this.setState(() => ({ data: stats }));
      console.log('game stats from dynamo', stats);
      stats.forEach((g) => {
        console.log('winners', g);
      })
    }).catch(error => console.log(error));
  }

  handleSubmitData = (stats) => {
    // send stats to dynamo
    //const playerstats = {
    //  id: 'two',
    //  name: 'two',
    //  gamesPlayed: 1
    //};
    //this.setState(() => ({ data: stats }))
    //API.post('player-statsCRUD', '/player-stats', { body: playerstats });
    const winners = {
      players: stats,
    };

    const gamestats = {
      id: 'game7',
      isTournament: false,
      winners,
    };
    console.log('gamestats', gamestats);
    this.setState(() => ({ gameData: gamestats }));
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
