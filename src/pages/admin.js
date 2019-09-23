/* eslint-disable react/prop-types */
import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { withAuthenticator, SignIn, Greetings } from 'aws-amplify-react';
import {
    AdminStatsTable,
    GameDetails,
    GameMenu,
    Layout,
    SortTeams,
    SuccessImage,
} from '../components';
import {
    createNewPlayerStats,
    fetchAllGames,
    fetchGamesFromMeetup,
    fetchPlayerStats,
    fetchRsvpList,
    submitNewGameStats,
    updateExistingPlayer,
} from '../utils/apiService';
import { mergePlayerStats, mergeGameStats } from '../utils/statsCalc';
import { createPlayer, findCurrentGame, filterCurrentGame, sortTimeStamp } from '../utils/helpers';
import styles from './pages.module.css';

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
     */
    async componentDidMount() {
        this.mounted = true;
        const games = await fetchGamesFromMeetup();

        const currentGame = games[0];
        currentGame.players = await this.getCurrentGamePlayers(currentGame);

        if (this.mounted) {
            this.setState(() => ({
                selectedGameId: currentGame.id,
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

        const games = await fetchAllGames();
        const gamesSorted = games.sort(sortTimeStamp);

        return Number(gamesSorted[0].timeStamp);
    };

    getCurrentGamePlayers = async (currentGame = {}) => {
        if (currentGame.players) {
            return currentGame.players;
        }

        const rsvpList = await fetchRsvpList(currentGame.id);
        const results = await Promise.all(rsvpList);

        return results.map((player) => createPlayer(player));
    };

    /**
     * Update a players game log or create a new player
     * @param {Array} playerStats
     */
    submitPlayerStats = async (playerStats = []) => {
        playerStats.forEach(async (player) => {
            const existingPlayer = await fetchPlayerStats(player.id);

            try {
                if (existingPlayer) {
                    // player already exists in database
                    const { id, games } = existingPlayer;
                    const parsedGames = JSON.parse(games);
                    const updatedGames = [player.games[0], ...parsedGames];
                    await updateExistingPlayer({
                        input: { id },
                        games: JSON.stringify(updatedGames),
                    });
                } else {
                    // player does not yet exist in database
                    const newPlayer = {
                        ...player,
                        games: JSON.stringify(player.games),
                    };
                    await createNewPlayerStats({ input: newPlayer });
                }
            } catch (e) {
                throw new Error(`Error saving player ${existingPlayer.name}: ${e}`);
            }
        });
    };

    submitGameStats = async (gameStats) => {
        await submitNewGameStats({ input: gameStats });
    };

    /**
     * Submit updated stats to PlayerStats & GameStats
     */
    handleSubmitData = async (winners, losers, selectedGameId) => {
        const { currentGame, games } = this.state;
        const playerStats = await mergePlayerStats(currentGame, winners, losers);
        this.submitPlayerStats(playerStats);

        const gameStats = await mergeGameStats(currentGame, winners, losers);
        this.submitGameStats(gameStats);

        const remainingGames = games.filter((game) => game.id !== selectedGameId);
        const nextGame = remainingGames[0];
        nextGame.players = await this.getCurrentGamePlayers(remainingGames[0]);

        this.setState(() => {
            return {
                areTeamsSorted: false,
                currentGame: nextGame,
                games: remainingGames,
                selectedGameId: get(nextGame, 'id', ''),
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
        const currentGame = this.state.games.find(findCurrentGame(selectedGameId));
        const currentPlayers = await this.getCurrentGamePlayers(currentGame);
        currentGame.players = currentPlayers;

        this.setState(() => ({ currentGame, selectedGameId }));
    };

    /**
     * Removes a game from games menu
     * Useful when events other than games are created
     */
    handleCancelGame = async (e) => {
        e.stopPropagation();
        const selectedGameId = e.target.id;
        const games = this.state.games.filter(filterCurrentGame(selectedGameId));
        const nextGame = games[0];
        nextGame.players = await this.getCurrentGamePlayers(games[0]);

        this.setState(() => ({
            currentGame: nextGame,
            selectedGameId: get(nextGame, 'id', ''),
            games,
        }));
    };

    handleSetTeams = (winners, losers) => {
        this.setState(() => ({ areTeamsSorted: true, winners, losers }));
    };

    render() {
        const { areTeamsSorted, currentGame, games, losers, selectedGameId, winners } = this.state;
        const adminPagePath = get(this.props.pageResources, 'page.path', null);

        if (isEmpty(currentGame)) {
            return (
                <Layout className={styles.loadingTextContainer} uri={adminPagePath}>
                    <div className={styles.loadingText}>LOADING</div>
                </Layout>
            );
        }

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
                <GameDetails data={currentGame} />

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
 * Admin | Display sign out button | Only include these Authenticator components | Federated configurations | Theme styling
 * @param { Element, Boolean, Array, Object, Object }
 */
export default withAuthenticator(Admin, true, [<Greetings />, <SignIn />]);
