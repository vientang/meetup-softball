import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, SignIn, Greetings } from 'aws-amplify-react';
import fetchJsonp from 'fetch-jsonp';
import Layout from '../components/Layout';
import SuccessImage from '../components/SuccessImage';
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import SortTeams from '../components/SortTeams';
import { createGameStats } from '../graphql/mutations';
import { listPlayerStatss } from '../graphql/queries';
import { Utils, apiService } from "../utils";
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

const GAMES_URL = 'https://api.meetup.com/San-Francisco-Softball-Players/events?&sign=true&photo-host=public&status=past&desc=true&page=5';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areTeamsSet: false,
            currentGame: game247,
            dataSubmitted: false,
            existingPlayerStats: [],
            finishedStatEntry: false,
            games: [game247, game248],
            lastGameRecorded: null,
            losers: [],
            selectedGame: game247.gameId,
            selectedPlayers: [],
            winners: [],
        };
    }

    /**
     * Get the games to be entered
     * Get list of players who attended the game from meetup api
     * Find those players in our API to get existing stats
     * Merge each player name and meetup id with the stats categories
     */
    async componentDidMount() {
        const games = [];
        let players = [];
        let lastGameRecorded = '';
        await fetchJsonp(GAMES_URL)
            .then(response => response.json())
            .then(result => {
                result.data.forEach((game, i) => {
                    if (i === 0) {
                        lastGameRecorded = new Date(game.time);
                    }
                    const dates = game.local_date.split('-');
                    const gameId = game.name.split(' ')[1];
                    const newGame = {};
                    newGame.meetupId = game.id;
                    newGame.name = game.name;
                    newGame.gameId = gameId;
                    newGame.date = game.local_date;
                    newGame.time = game.local_time;
                    newGame.year = dates[0];
                    newGame.month = dates[1];
                    newGame.field = game.venue.name;
                    newGame.rsvps = game.yes_rsvp_count;
                    
                    games.push(newGame);
                });
            })
            .catch((error) => {
                console.log('meetup games request error', error);
            });
        
        const currentGame = games[0];
        
        const PLAYERS_URL = `https://api.meetup.com/2/rsvps?&sign=true&photo-host=public&event_id=${currentGame.meetupId}&page=${currentGame.rsvps}&key=${process.env.MEETUP_KEY}`;

        await fetchJsonp(PLAYERS_URL)
            .then(response => response.json())
            .then(result => {
                players = result.results.map(player => Utils.createPlayer(player));
            })
            .catch(error => {
                console.log('meetup player request error', error);
            });
            
        currentGame.players = players;
        if (players.length > 0) {
            API.graphql(graphqlOperation(listPlayerStatss))
                .then(result => {
                    const allPlayers = result.data.listPlayerStatss.items;
                    const currentPlayers = allPlayers.filter((player) => (
                        players.some(currPlayer => player.meetupId === currPlayer.meetupId)
                    ));
                    players = currentPlayers.length > 0 ? currentPlayers : players;
                    // After getting meetup data, check if any of those games have
                    // already been entered. This can happen when admin enters stats 
                    // for one game but not the other. We should find out which games
                    // should be entered.
                    this.setState(() => ({
                        currentGame: game247,
                        existingPlayerStats: players,
                        games: [game247, game248],
                        selectedGame: game247.gameId,
                        lastGameRecorded,
                    }));
                })
                .catch(error => {
                    console.log('player query error', error);
                })
        }
    }

    /**
     * Submit updated stats to PlayerStats and GameStats table
     */
    handleSubmitData = async (winners, losers, selectedGame) => {
        const meetupData = {
            meetupId: 'x1u3sjj99I',
            name: 'Game 247 Westlake Park, Daly City',
            venue: { name: 'Westlake Park, Daly City' },
            local_date: '2018-10-11',
            tournamentName: 'Halloween',
        };

        // const playerStats = apiService.updateMergedPlayerStats(existingStats, winners, losers);
        // playerStats.forEach(player => {
        //     API.graphql(graphqlOperation(updatePlayerStats, { input: player }));
        // });

        const gameStats = await apiService.mergeGameStats(meetupData, winners, losers);
        
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
            console.log('error in createGameStats', error);
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

/**
 * Admin | Display sign out button | Only include these Authenticator components | Federated configurations | Theme styling
 * @param { Element, Boolean, Array, Object, Object }
 */
export default withAuthenticator(Admin, true, [<Greetings />, <SignIn />]);
// export default withAuthenticator(Admin);
