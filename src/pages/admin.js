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
            areTeamsSorted: false,
            currentGame: {},
            games: [],
            losers: [],
            selectedGameId: '',
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
                result.data.forEach((game) => {
                    // prevent overfetching games from meetup
                    if (lastGameTimeStamp >= game.time) {
                        return;
                    }
                    games.push(this.createGame(game));
                });
            })
            .catch((error) => {
                throw new Error(error);
            });

        // sort games by time for GamesMenu
        games.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

        const currentGame = games[0];
        currentGame.players = await this.getCurrentGamePlayers(currentGame);

        this.setState(() => ({
            selectedGameId: currentGame.meetupId,
            currentGame,
            games,
        }));
    }

    getLastGameRecorded = async () => {
        // TODO: Get the actual last game recorded by timeStamp
        // simply getting the first item isn't guarantee to be the last game recorded
        // TRY: increase the limit to 5 and prevent over fetching by looping through the 5
        // TRY: save date in local storage - people say this is a bad idea
        // TRY: as last resort, save last game entered into a different table and query that table
        const games = await API.graphql(graphqlOperation(listGameStatss, { limit: 1 }));
        return Number(games.data.listGameStatss.items[0].timeStamp);
    };

    createGame = (game) => {
        const { id, local_date, local_time, rsvp_limit, time, venue, waitlist_count } = game;

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

        return newGame;
    };

    getCurrentGamePlayers = async (currentGame) => {
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

        const results = await Promise.all(rsvpList);
        return results.map((player) => Utils.createPlayer(player));
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
                areTeamsSorted: false,
                selectedGameId: currentGame ? currentGame.gameId : '',
                currentGame,
                games,
            };
        });
    };

    /**
     * Toggle players between the games
     */
    handleSelectGame = async (e) => {
        const selectedGameId = e.key;
        const currentGame = this.state.games.find((game) => game.meetupId === selectedGameId);
        currentGame.players = await this.getCurrentGamePlayers(currentGame);

        this.setState(() => {
            return {
                currentGame,
                selectedGameId,
            };
        });
    };

    handleSetTeams = (winners, losers) => {
        this.setState(() => ({ areTeamsSorted: true, winners, losers }));
    };

    render() {
        const { areTeamsSorted, currentGame, games, losers, selectedGameId, winners } = this.state;

        if (!currentGame) {
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
                    {!areTeamsSorted && (
                        <>
                            <GameMenu
                                games={games}
                                selectedGame={selectedGameId}
                                onGameSelection={this.handleSelectGame}
                            />
                            <SortTeams data={currentGame} setTeams={this.handleSetTeams} />
                        </>
                    )}
                    {areTeamsSorted && (
                        <AdminStatsTable
                            game={currentGame.name}
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
