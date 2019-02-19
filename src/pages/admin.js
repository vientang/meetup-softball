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
import { listPlayerStatss } from '../graphql/queries';
import { Utils, apiService } from '../utils';
import styles from './pages.module.css';

const { MEETUP_KEY, GAMES_URL, PLAYER_URL, RSVP_URL } = process.env;

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
        const games = [];
        let players = [];
        let lastGameRecorded = '';
        const cachedTimeRecord = localStorage.getItem(lastGameRecorded);

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

                    if (cachedTimeRecord) {
                        // prevent over fetching games
                        // get timestamp of last game recorded from GameStats API
                        // compare time stamps
                        // break out of loop if cached time record is
                        // equal to or less than last game recorded
                    }

                    if (i === 0) {
                        lastGameRecorded = time;
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
                    newGame.rsvps = yes_rsvp_count;
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

        // get rsvp's then get player data
        const RSVPS = `${RSVP_URL}${currentGame.meetupId}&page=${
            currentGame.rsvps
        }&key=${MEETUP_KEY}`;

        let rsvpList = await fetchJsonp(RSVPS)
            .then((response) => response.json())
            .then((result) => result.results)
            .catch((error) => {
                throw new Error(error);
            });

        rsvpList = await rsvpList.map((player) =>
            fetchJsonp(`${PLAYER_URL}${player.member.member_id}?&sign=true&photo-host=public`)
                .then((response) => response.json())
                .then((playerResult) => playerResult),
        );

        players = await Promise.all(rsvpList).then((result) =>
            result.map((player) => Utils.createPlayer(player)),
        );

        currentGame.players = players;

        this.setState(() => ({
            games: games.slice(0, 2),
            selectedGameId: currentGame.meetupId,
            currentGame,
        }));
    }

    componentWillUnmount() {
        localStorage.removeItem('lastGameRecorded');
    }

    /**
     * Submit updated stats to PlayerStats, GameStats and Metadata tables
     */
    handleSubmitData = async (winners, losers, selectedGameId) => {
        const players = await apiService.mergePlayerStats(this.state.currentGame, winners, losers);
        const gameStats = await apiService.mergeGameStats(this.state.currentGame, winners, losers);

        // await API.graphql(graphqlOperation(createGameStats, { input: gameStats }));
        // playerStats.forEach(player => {
        //     API.graphql(graphqlOperation(updatePlayerStats, { input: player }));
        // });

        // update local storage cached time record with current game time stamp
        // localStorage.setItem(lastGameRecorded, this.state.currentGame.time);
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
