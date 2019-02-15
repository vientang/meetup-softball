import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, SignIn, Greetings } from 'aws-amplify-react';
import fetchJsonp from 'fetch-jsonp';
import Layout from '../components/Layout';
import SuccessImage from '../components/SuccessImage';
import GameMenu from '../components/GameMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import SortTeams from '../components/SortTeams';
import { createGameStats } from '../graphql/mutations';
import { listPlayerStatss } from '../graphql/queries';
import { Utils, apiService } from '../utils';
import styles from './pages.module.css';

const { GAMES_URL } = process.env;

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areTeamsSet: false,
            currentGame: {},
            dataSubmitted: false,
            existingPlayerStats: [],
            finishedStatEntry: false,
            games: [],
            lastGameRecorded: null, // used to prevent over fetching games
            losers: [],
            selectedGame: '',
            selectedPlayers: [],
            winners: [],
        };
    }

    /**
     * Get data from meetup api - games and players
     * Find those players in our API to get existing stats
     * Merge each player name and meetup id with the stats categories
     */
    async componentDidMount() {
        const games = [];
        let players = [];
        let lastGameRecorded = '';
        await fetchJsonp(GAMES_URL)
            .then((response) => response.json())
            .then((result) => {
                result.data.forEach((game, i) => {
                    const {
                        id,
                        local_date,
                        local_time,
                        time,
                        venue,
                        waitlist_count,
                        yes_rsvp_count,
                    } = game;

                    if (i === 0) {
                        lastGameRecorded = new Date(time);
                    }

                    const gameDate = new Date(time).toDateString();
                    const [year, month] = local_date.split('-');
                    const { lat, lon, name } = venue;
                    const gameId = game.name.split(' ')[1];

                    const newGame = {};
                    newGame.meetupId = id;
                    newGame.name = game.name;
                    newGame.gameId = gameId;
                    newGame.date = gameDate;
                    newGame.time = local_time;
                    newGame.year = year;
                    newGame.month = month;
                    newGame.field = name;
                    newGame.rsvps = yes_rsvp_count;
                    newGame.timeStamp = time;
                    newGame.waitListCount = waitlist_count;
                    newGame.lat = lat;
                    newGame.lon = lon;

                    games.push(newGame);
                });
            })
            .catch((error) => {
                throw new Error(error);
            });

        // sort games by time for GamesMenu
        games.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

        const currentGame = games[0];

        const PLAYERS_URL = `https://api.meetup.com/2/rsvps?&sign=true&photo-host=public&event_id=${
            currentGame.meetupId
        }&page=${currentGame.rsvps}&key=${process.env.MEETUP_KEY}`;

        await fetchJsonp(PLAYERS_URL)
            .then((response) => response.json())
            .then((result) => {
                players = result.results.map((player) => Utils.createPlayer(player));
            })
            .catch((error) => {
                throw new Error(error);
            });

        currentGame.players = players;
        if (players.length > 0) {
            API.graphql(graphqlOperation(listPlayerStatss))
                .then((result) => {
                    const allPlayers = result.data.listPlayerStatss.items;
                    const currentPlayers = allPlayers.filter((player) =>
                        players.some((currPlayer) => player.meetupId === currPlayer.meetupId),
                    );
                    // players = currentPlayers.length > 0 ? currentPlayers : players;

                    this.setState(() => ({
                        currentGame,
                        existingPlayerStats: players,
                        games: games.slice(0, 2),
                        selectedGameId: currentGame.meetupId,
                        lastGameRecorded,
                    }));
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }
    }

    /**
     * Submit updated stats to PlayerStats, GameStats and Metadata tables
     */
    handleSubmitData = async (winners, losers, selectedGameId) => {
        // const playerStats = apiService.updateMergedPlayerStats(existingStats, winners, losers);
        // playerStats.forEach(player => {
        //     API.graphql(graphqlOperation(updatePlayerStats, { input: player }));
        // });

        const gameStats = await apiService.mergeGameStats(this.state.currentGame, winners, losers);

        await API.graphql(graphqlOperation(createGameStats, { input: gameStats }));

        this.setState((prevState) => {
            const games = prevState.games.filter((game) => game.gameId !== selectedGameId);
            const currentGame = games[0];

            return {
                areTeamsSet: false,
                finishedStatEntry: !!currentGame,
                selectedGame: currentGame ? currentGame.gameId : '',
                currentGame,
                games,
            };
        });
    };

    /**
     * Toggle players between the games
     */
    handleSelectGame = (e) => {
        const selectedGameId = e.key;
        this.setState((prevState) => {
            const currentGame = prevState.games.find((game) => game.gameId === selectedGameId);
            return {
                currentGame,
                selectedGameId,
            };
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
            selectedGameId,
            winners,
        } = this.state;

        if (finishedStatEntry) {
            return (
                <Layout className={styles.adminPageSuccess}>
                    <SuccessImage />
                    <h3>You're done! Enjoy the day!</h3>
                </Layout>
            );
        }

        return (
            <>
                <Layout className={styles.adminPage}>
                    <GameMenu
                        games={games}
                        selectedGame={selectedGameId}
                        onGameSelection={this.handleSelectGame}
                    />
                    {!areTeamsSet && (
                        <SortTeams data={currentGame} setTeams={this.handleSetTeams} />
                    )}
                    {areTeamsSet && (
                        <AdminStatsTable
                            winners={winners}
                            losers={losers}
                            onSubmit={this.handleSubmitData}
                            selectedGame={selectedGameId}
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
