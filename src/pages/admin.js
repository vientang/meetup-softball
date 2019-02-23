/* eslint-disable no-undef */
import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, SignIn, Greetings } from 'aws-amplify-react';
import fetchJsonp from 'fetch-jsonp';
import Layout from '../components/Layout';
import SuccessImage from '../components/SuccessImage';
import GameMenu from '../components/GameMenu';
import AdminStatsTable from '../components/AdminStatsTable';
import SortTeams from '../components/SortTeams';
import { createGameStats, updatePlayerStats } from '../graphql/mutations';
import { listGameStatss, listPlayerStatss } from '../graphql/queries';
import { Utils, apiService } from '../utils';
import styles from './pages.module.css';

const { GAMES_URL, PLAYER_URL, RSVP_URL } = process.env;

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areTeamsSet: false,
            currentGame: {},
            finishedStatEntry: false,
            games: [],
            losers: [],
            selectedGameId: '',
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
        const lastGameTimeStamp = await this.getLastGameRecorded();

        const games = [];

        await fetchJsonp(GAMES_URL)
            .then((response) => response.json())
            .then((result) => {
                result.data.forEach((game, i) => {
                    const {
                        id,
                        local_date,
                        local_time,
                        rsvp_limit,
                        time,
                        venue,
                        waitlist_count,
                    } = game;

                    // prevent overfetching games from meetup
                    if (lastGameTimeStamp >= time) {
                        return;
                    }

                    const gameDate = new Date(time).toDateString();
                    const [year, month] = local_date.split('-');
                    const { lat, lon, name } = venue;
                    const gameId = game.name.split(' ')[1];

                    const newGame = {};
                    newGame.date = gameDate;
                    newGame.field = name;
                    newGame.gameId = gameId;
                    newGame.lat = lat;
                    newGame.lon = lon;
                    newGame.meetupId = id;
                    newGame.month = month;
                    newGame.name = game.name;
                    newGame.rsvps = rsvp_limit;
                    newGame.time = local_time;
                    newGame.timeStamp = time;
                    newGame.tournamentName = game.name;
                    newGame.waitListCount = waitlist_count;
                    newGame.year = year;

                    games.push(newGame);
                });
            })
            .catch((error) => {
                throw new Error(error);
            });

        // sort games by time for GamesMenu
        games.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

        const currentGame = games[0];
        const RSVPS = `${RSVP_URL}${currentGame.meetupId}/attendance?&sign=true&photo-host=public`;

        let rsvpList = await fetchJsonp(RSVPS)
            .then((response) => response.json())
            .then((result) => result.data.filter((player) => player.rsvp.response === 'yes'))
            .catch((error) => {
                throw new Error(error);
            });

        rsvpList = await rsvpList.map((player) =>
            fetchJsonp(`${PLAYER_URL}${player.member.id}?&sign=true&photo-host=public`)
                .then((response) => response.json())
                .then((playerResult) => playerResult),
        );

        currentGame.players = await Promise.all(rsvpList).then((result) =>
            result.map((player) => Utils.createPlayer(player)),
        );

        this.setState(() => ({
            games: games.slice(0, 2),
            selectedGameId: currentGame.meetupId,
            currentGame,
        }));
    }

    getLastGameRecorded = async () => {
        const games = await API.graphql(graphqlOperation(listGameStatss, { limit: 1 }));
        return Number(games.data.listGameStatss.items[0].timeStamp);
    };

    /**
     * Submit updated stats to PlayerStats, GameStats and Metadata tables
     */
    handleSubmitData = async (winners, losers, selectedGameId) => {
        const players = await apiService.mergePlayerStats(this.state.currentGame, winners, losers);
        const gameStats = await apiService.mergeGameStats(this.state.currentGame, winners, losers);

        await API.graphql(graphqlOperation(createGameStats, { input: gameStats }));
        // playerStats.forEach(player => {
        //     API.graphql(graphqlOperation(updatePlayerStats, { input: player }));
        // });

        this.setState((prevState) => {
            const games = prevState.games.filter((game) => game.gameId !== selectedGameId);
            const currentGame = games[0];

            return {
                areTeamsSet: false,
                finishedStatEntry: !!currentGame,
                selectedGameId: currentGame ? currentGame.gameId : '',
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
