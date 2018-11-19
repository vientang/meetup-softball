import React from 'react'
import { API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import Layout from '../components/layout'
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import { Utils } from "../utils";
import styles from './pages.module.css';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSubmitted: false,
      games: [],
      selectedGame: '0',
      selectedPlayers: Utils.makeData(1),
    };
  }

  async componentDidMount() {
    // get game info from meetup api
    // we need game name, venue name, date, and time
    // send to AdminSideMenu
    // here's an example
    const game247 = {
      gameNumber: 'Game 247',
      location: 'Westlake Park, Daly City',
      date: 'November 11th, 2018',
      time: '10:30am',
    }
    const game248 = {
      gameNumber: 'Game 248',
      location: 'Westlake Park, Daly City',
      date: 'November 11th, 2018',
      time: '12:30pm',
    }

    this.setState(() => ({ 
      games: [game247, game248],
      selectedPlayers: Utils.makeData(1),
    }));

    // get list of players who attended the game from meetup api
    // merge each player name and meetup id with the stats categories
    // send to AdminStatsTable

    // await API.get('game-statsCRUD', '/game-stats').then(stats => {
    //   console.log('async stats on mount', stats);
    //   this.setState(() => ({ data: stats }));
    // }).catch(error => console.log(error));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (this.state.dataSubmitted) {
    //   API.get('game-statsCRUD', '/game-stats').then(stats => {
    //     console.log('game stats updated', stats);
    //     this.setState(() => ({ dataSubmitted: false }));
    //   }).catch(error => console.log(error));
    // }
  }

  handleSubmitData = async (playerStats) => {
    // refactor to do a bulk write
    await playerStats.forEach((player) => {
      const stats = {
        id: player.id,
        stats: player,
      }
      API.post('player-statsCRUD', '/player-stats/object/' + player.id, { body: stats }).catch(error => console.log(error));
    });

    // for new game stats
    // loop through player stats
    // for each player, API.get data for only players in that game
    // look into FilterExpression || BatchGetItem || BatchWriteItem in .get
    // await playerStats.forEach((player, idx) => {
    //   API.get('player-statsCRUD', '/player-stats/' + playerStats.id).then(result => {
    //     if (result.length < 1) {
    //       console.log('Player from Dynamo', {result, player});
    //       API.post('player-statsCRUD', '/player-stats/' + playerStats.id, { body: player }).catch(error => console.log(error));
    //     }
    //   }).catch(error => console.log(`Could not locate ${player.player}`, error));
    // })
    // add counting stats
    // calculate percentage stats
    // API.post to update each player stats

    // await API.post('game-statsCRUD', '/game-stats', { body: gamestats }).catch(error => console.log(error));
    
    // when post is complete, 
    // if there's another game to add stats
    // tell AdminSideMenu to focus on next game
    // removed the complete game from the AdminSideMenu
    // this should show the AdminStatsTable for the next game

    // else, route the admin to AdminDashboard (need to build out an admin dashboard)

    // await API.del('game-statsCRUD', '/game-stats/object/' + gamestats.id).then((stats) => {
    //   console.log('del', stats);
    // });
    
  };

  selectGame = (e) => {
		this.setState((prevState) => ({ 
      selectedGame: e.key,
      selectedPlayers: e.key === '0' ? Utils.makeData(1) : Utils.makeData(2),
    }))
  };
  
  render() {
    const { selectedPlayers, games, selectedGame } = this.state;

    return (
      <>
        <Layout className={styles.adminPage}>
          <AdminSideMenu 
            games={games} 
            selectedGame={selectedGame} 
            onGameSelection={this.selectGame}
          />
          <AdminStatsTable 
            data={selectedPlayers} 
            onSubmit={this.handleSubmitData} 
          />
        </Layout>
        <pre>{JSON.stringify(selectedPlayers)}</pre>
      </>
    );
  }
}

export default withAuthenticator(Admin);
