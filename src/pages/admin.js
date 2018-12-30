import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import Layout from '../components/Layout';
import SuccessImage from '../components/SuccessImage';
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import SortTeams from '../components/SortTeams';
import { createGameStats } from '../graphql/mutations';
import { Utils, statsCalc } from "../utils";
import styles from './pages.module.css';

const categories = ['player', 'o', '1b', '2b', '3b', 'hr', 'bb', 'sb', 'cs', 'k', 'rbi', 'r', 'sac'];
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

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areTeamsSet: false,
            currentGame: game247,
            dataSubmitted: false,
            finishedStatEntry: false,
            games: [game247, game248],
            losers: [],
            selectedGame: game247.gameId,
            selectedPlayers: [],
            winners: [],
        };
    }

    async componentDidMount() {
        // get list of players who attended the game from meetup api
        // merge each player name and meetup id with the stats categories
        // send to AdminStatsTable

        // After getting meetup data, check if any of those games have
        // already been entered. This can happen when admin enters stats 
        // for one game but not the other. We should find out which games
        // should be entered.
        this.setState(() => ({ 
            currentGame: game247,
            games: [game247, game248],
            selectedGame: game247.gameId,
        }));
    }

    /**
     * Write GraphQL mutations
     */
    handleSubmitData = (winners, losers, selectedGame) => {
        const meetupData = {
            meetupId: 'x1u3sjj99I',
            name: 'Game 247 Westlake Park, Daly City',
            venue: { name: 'Westlake Park, Daly City' },
            local_date: '2018-10-11',
            tournamentName: 'Halloween',
        };

        const gameStats = statsCalc.mergeGameStats(meetupData, winners, losers);
        
        API.graphql(graphqlOperation(createGameStats, { input: gameStats })).then(response => {
            this.setState((prevState) => {
                const games = prevState.games.filter((game) => game.gameId !== selectedGame );
                const currentGame = games[0];
                
                return { 
                    areTeamsSet: false,
                    finishedStatEntry: currentGame ? false : true,
                    selectedGame: currentGame ? currentGame.gameId : '',
                    currentGame,
                    games,
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

    handleSetTeams = (winners, losers) => {
        this.setState(() => ({ areTeamsSet: true, winners, losers }));
    };

    render() {
        const { 
            areTeamsSet, 
            currentGame, 
            finishedStatEntry, 
            games, 
            losers, 
            selectedGame, 
            winners,
        } = this.state;

        if (finishedStatEntry) {
            return (
                <Layout className={styles.adminPageSuccess}>
                    <SuccessImage />
                    <h3>You're done! Enjoy the day!</h3>
                </Layout>
            )
        }

        return (
            <>
                <Layout className={styles.adminPage}>
                    <AdminSideMenu 
                        games={games} 
                        selectedGame={selectedGame} 
                        onGameSelection={this.handleSelectGame}
                    />
                    {!areTeamsSet && (
                        <SortTeams 
                            data={currentGame} 
                            setTeams={this.handleSetTeams}
                        />
                    )}
                    {areTeamsSet && (
                        <AdminStatsTable 
                            winners={winners} 
                            losers={losers} 
                            categories={categories}
                            onSubmit={this.handleSubmitData} 
                            selectedGame={selectedGame} 
                        />
                    )}
                </Layout>
            </>
        );
    }
}

export default withAuthenticator(Admin, true);
