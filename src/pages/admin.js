/* eslint-disable react/prop-types */
import React from 'react';
import fetchJsonp from 'fetch-jsonp';
import get from 'lodash/get';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, SignIn, Greetings } from 'aws-amplify-react';
import { AdminStatsTable, GameMenu, Layout, SortTeams, SuccessImage } from '../components';
import { createGameStats, createPlayerStats, updatePlayerStats } from '../graphql/mutations';
import { listGameStatss, listPlayerStatss } from '../graphql/queries';
import { apiService } from '../utils';
import { sortTimeStamp } from '../utils/helpers';
import styles from './pages.module.css';
import componentStyles from '../components/components.module.css';

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
        this.mounted = true;
        const lastGameTimeStamp = await this.getLastGameRecorded();

        const games = [];

        await fetchJsonp(process.env.GAMES_URL)
            .then((response) => response.json())
            .then((result) => {
                result.data.forEach((game) => {
                    // prevent overfetching games from meetup
                    if (lastGameTimeStamp >= game.time) {
                        return;
                    }
                    games.push(createGame(game));
                });
            })
            .catch((error) => {
                throw new Error(error);
            });

        // sort games by time for GamesMenu
        games.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

        const currentGame = games[0];
        currentGame.players = await this.getCurrentGamePlayers(currentGame);

        if (this.mounted) {
            this.setState(() => ({
                selectedGameId: currentGame.meetupId,
                currentGame,
                games,
            }));
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getLastGameRecorded = async () => {
        const lastGameRecorded = localStorage.getItem('lastGameRecorded');

        if (lastGameRecorded) {
            return lastGameRecorded;
        }

        const games = await API.graphql(graphqlOperation(listGameStatss));
        const gamesSorted = games.data.listGameStatss.items.sort(sortTimeStamp);

        return Number(gamesSorted[0].timeStamp);
    };

    getCurrentGamePlayers = async (currentGame = {}) => {
        if (currentGame.players) {
            return currentGame;
        }

        const RSVPS = `${process.env.RSVP_URL}${
            currentGame.meetupId
        }/attendance?&sign=true&photo-host=public`;

        let rsvpList = await fetchJsonp(RSVPS)
            .then((response) => response.json())
            .then((result) => result.data.filter(filterAttendees))
            .catch((error) => {
                throw new Error(error);
            });

        rsvpList = await rsvpList.map((player) =>
            fetchJsonp(`${process.env.PLAYER_URL}${player.member.id}?&sign=true&photo-host=public`)
                .then((response) => response.json())
                .then((playerResult) => playerResult),
        );

        const results = await Promise.all(rsvpList);
        return results.map((player) => createPlayer(player));
    };

    /**
     * Update a players game log or create a new player
     * @param {Array} playerStats
     */
    submitPlayerStats = async (playerStats = []) => {
        playerStats.forEach(async (player) => {
            let existingPlayer = await API.graphql(
                graphqlOperation(listPlayerStatss, {
                    filter: { meetupId: { eq: player.meetupId } },
                }),
            );
            existingPlayer = get(existingPlayer, 'data.listPlayerStatss.items', null);

            try {
                if (existingPlayer[0]) {
                    // player already exists in database
                    const { id, games } = existingPlayer[0];
                    const parsedGames = JSON.parse(games);
                    const updatedGames = [player.games[0], ...parsedGames];

                    await API.graphql(
                        graphqlOperation(updatePlayerStats, {
                            input: { id },
                            games: JSON.stringify(updatedGames),
                        }),
                    );
                } else {
                    // player does not yet exist in database
                    const newPlayer = {
                        ...player,
                        games: JSON.stringify(player.games),
                    };

                    await API.graphql(
                        graphqlOperation(createPlayerStats, {
                            input: newPlayer,
                        }),
                    );
                }
            } catch (e) {
                console.log('error saving player', { e, existingPlayer, player });
            }
        });
    };

    submitGameStats = async (gameStats) => {
        await API.graphql(graphqlOperation(createGameStats, { input: gameStats }));
    };

    /**
     * Submit updated stats to PlayerStats & GameStats
     */
    handleSubmitData = async (winners, losers, selectedGameId) => {
        const { currentGame, games } = this.state;
        const playerStats = await apiService.mergePlayerStats(currentGame, winners, losers);
        this.submitPlayerStats(playerStats);

        const gameStats = await apiService.mergeGameStats(currentGame, winners, losers);
        this.submitGameStats(gameStats);

        const remainingGames = games.filter((game) => game.meetupId !== selectedGameId);
        const nextGame = remainingGames[0];
        nextGame.players = await this.getCurrentGamePlayers(remainingGames[0]);

        this.setState(() => {
            return {
                areTeamsSorted: false,
                currentGame: nextGame,
                games: remainingGames,
                selectedGameId: get(nextGame, 'meetupId', ''),
            };
        });

        localStorage.setItem('lastGameRecorded', gameStats.timeStamp);
    };

    /**
     * Toggle players between the games
     */
    handleSelectGame = async (e) => {
        e.preventDefault();
        const selectedGameId = e.target.id;

        const nextGame = await this.getCurrentGamePlayers(
            this.state.games.find(findGameByMeetupId(selectedGameId)),
        );

        console.log('facts', {
            game: this.state.games.find(findGameByMeetupId(selectedGameId)),
            selectedGameId,
            nextGame,
        });
        this.setState(() => ({ currentGame: nextGame, selectedGameId }));
    };

    /**
     * Removes a game from games menu
     * Useful when events other than games are created
     */
    handleCancelGame = async (e) => {
        e.stopPropagation();
        const selectedGameId = e.target.id;
        const games = this.state.games.filter(filterGameByMeetupId(selectedGameId));
        const nextGame = games[0];
        nextGame.players = await this.getCurrentGamePlayers(games[0]);

        this.setState(() => ({
            currentGame: nextGame,
            selectedGameId: get(nextGame, 'meetupId', ''),
            games,
        }));
    };

    handleSetTeams = (winners, losers) => {
        this.setState(() => ({ areTeamsSorted: true, winners, losers }));
    };

    render() {
        const { areTeamsSorted, currentGame, games, losers, selectedGameId, winners } = this.state;
        const adminPagePath = get(this.props.pageResources, 'page.path', null);

        if (!currentGame) {
            return (
                <Layout className={styles.adminPageSuccess}>
                    <SuccessImage />
                    <h3>You're done! Enjoy the day!</h3>
                </Layout>
            );
        }

        return (
            <Layout className={styles.adminPage} uri={adminPagePath}>
                <div className={componentStyles.adminSection}>
                    <p className={componentStyles.adminSectionTitle}>GAME DETAILS</p>
                </div>

                {areTeamsSorted ? (
                    <AdminStatsTable
                        winners={winners}
                        losers={losers}
                        onSubmit={this.handleSubmitData}
                        selectedGame={selectedGameId}
                    />
                ) : (
                    <SortTeams data={currentGame} setTeams={this.handleSetTeams} />
                )}
                <GameMenu
                    games={games}
                    selectedGame={selectedGameId}
                    onGameSelection={this.handleSelectGame}
                    onGameCancel={this.handleCancelGame}
                />
            </Layout>
        );
    }
}

/**
 * Schema matching GameStats
 * Adaptor to create game object from meetup data and admin stats
 * @param {Object} player
 */
function createGame(game) {
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
}

/**
 * Schema matching PlayerStats
 * Adaptor to create player object from meetup data and admin stats
 * @param {Object} player
 */
function createPlayer(player) {
    const { name, id, joined, group_profile, is_pro_admin, photo, status } = player.data;
    return {
        name,
        joined,
        status,
        meetupId: id,
        profile: group_profile,
        admin: is_pro_admin,
        photos: photo,
        singles: null,
        doubles: null,
        triples: null,
        bb: null,
        cs: null,
        hr: null,
        k: null,
        o: null,
        r: null,
        rbi: null,
        sac: null,
        sb: null,
    };
}

function findGameByMeetupId(selectedGameId) {
    return (game) => game.meetupId === selectedGameId;
}

function filterGameByMeetupId(selectedGameId) {
    return (game) => game.meetupId !== selectedGameId;
}

/**
 * Data from Meetup API is inconsistent
 * Catch the different permutations of attendance
 * @param {Object} player
 * @return {Boolean}
 */
function filterAttendees(player = {}) {
    const status = get(player, 'status');
    const response = get(player, 'rsvp.response');
    if ((status && status === 'absent') || status === 'noshow') {
        return false;
    }
    if (response === 'yes') {
        return true;
    }
    return status === 'attended';
}

/**
 * Admin | Display sign out button | Only include these Authenticator components | Federated configurations | Theme styling
 * @param { Element, Boolean, Array, Object, Object }
 */
export default withAuthenticator(Admin, true, [<Greetings />, <SignIn />]);
