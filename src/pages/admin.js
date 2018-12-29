import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import Layout from '../components/Layout';
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import { createGameStats } from '../graphql/mutations';
import { Utils, statsCalc } from "../utils";
import styles from './pages.module.css';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSubmitted: false,
            games: [],
            selectedGame: '0',
            selectedPlayers: [],
        };
    }

    async componentDidMount() {
        // get game info from meetup api
        // we need game name, venue name, date, and time
        // send to AdminSideMenu
        // here's an example
        const game247 = {
            gameId: '247',
            location: 'Westlake Park, Daly City',
            date: 'November 11th, 2018',
            time: '10:30am',
            players: Utils.makeData(1),
        }
        const game248 = {
            gameId: '248',
            location: 'Westlake Park, Daly City',
            date: 'November 11th, 2018',
            time: '12:30pm',
            players: Utils.makeData(2),
        }
        
        // get list of players who attended the game from meetup api
        // merge each player name and meetup id with the stats categories
        // send to AdminStatsTable

        this.setState(() => ({ 
            currentGame: game247,
            games: [game247, game248],
            selectedGame: game247.gameId,
        }));
    }

    /**
     * Write GraphQL mutations
     */
    handleSubmitData = async (currentStats, selectedGame) => {
        const meetupData = {
            meetupId: 'x1u3sjj99I',
            name: 'Game 247 Westlake Park, Daly City',
            venue: { name: 'Westlake Park, Daly City' },
            local_date: '2018-10-11',
            tournamentName: 'Halloween',
        };

        const gameStats = statsCalc.mergeGameStats(meetupData, currentStats);
        
        API.graphql(graphqlOperation(createGameStats, { input: gameStats })).then(response => {
            this.setState((prevState) => {
                const games = prevState.games.filter((game) => game.gameId !== selectedGame );
                const currentGame = games[0];
                
                return { 
                    selectedGame: currentGame ? currentGame.gameId : '',
                    games,
                    currentGame,
                };
            });
        }).catch(error => {
            console.log('error', error);
        });
    };

    /**
     * Toggle players between the games
     */
    handleSelectGame = (selectedGame) => {
        this.setState((prevState) => {
            const currentGame = prevState.games.find((game) => game.gameId === selectedGame);
            return {
                currentGame,
                selectedGame,
            } 
        });
    };

    render() {
        const { currentGame, games, selectedGame } = this.state;
        
        return (
            <>
                <Layout className={styles.adminPage}>
                    <AdminSideMenu 
                        games={games} 
                        selectedGame={selectedGame} 
                        onGameSelection={this.handleSelectGame}
                    />
                    <AdminStatsTable 
                        data={currentGame} 
                        onSubmit={this.handleSubmitData} 
                        selectedGame={selectedGame} 
                    />
                </Layout>
                {/* <pre>{JSON.stringify(selectedPlayers)}</pre> */}
            </>
        );
    }
}

export default withAuthenticator(Admin, true);
