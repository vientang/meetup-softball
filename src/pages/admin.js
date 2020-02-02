import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import get from 'lodash/get';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import { withAuthenticator, SignIn, Greetings } from 'aws-amplify-react';
import { Layout } from '../components';
import {
    AdminStatsTable,
    GameDetails,
    MoreGames,
    PlayerOfTheGame,
    SortTeams,
    SuccessImage,
} from '../components/Dashboard';
import { fetchGamesFromMeetup, fetchRsvpList } from '../utils/apiService';
// import SummarizeStats from '../utils/SummarizeStats';
import GameStats from '../utils/GameStats';
// import PlayerStats, { mergePlayerStats } from '../utils/PlayerStats';
// import PlayerInfo from '../utils/PlayerInfo';
// import MetaData from '../utils/MetaData';
import {
    createPlayer,
    getFieldName,
    findCurrentGame,
    filterCurrentGame,
    isPlayerOfTheGame,
    findPlayerById,
} from '../utils/helpers';
import styles from './pages.module.css';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areTeamsSorted: false,
            currentGame: {},
            games: [],
            losers: [],
            playerOfTheGame: {},
            selectedGameId: '',
            winners: [],
        };
    }

    /**
     * Get data from meetup api - games and players
     */
    async componentDidMount() {
        this.mounted = true;
        const allFields = JSON.parse(get(this.props.data, 'softballstats.metadata.allFields', {}));

        const lastGameTimeStamp = await this.getLastGameRecorded();
        const games = await fetchGamesFromMeetup(lastGameTimeStamp);
        const currentGame = games[0];
        currentGame.field = getFieldName(currentGame.field, allFields);
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
        const recentGames = JSON.parse(
            get(this.props.data, 'softballstats.metadata.recentGames', [{}]),
        );
        return Number(recentGames[0].timeStamp);
    };

    getCurrentGamePlayers = async (currentGame = {}) => {
        if (currentGame.players) {
            return currentGame.players;
        }

        const rsvpList = await fetchRsvpList(currentGame.id);
        const results = await Promise.all(rsvpList);

        return results.map((player) => createPlayer(player));
    };

    handleOnChange = (player) => {
        if (isPlayerOfTheGame(player, this.state.playerOfTheGame)) {
            this.setState(() => ({ playerOfTheGame: player }));
        }
    };

    /**
     * Submit updated stats to PlayerStats & GameStats
     */
    handleSubmitData = async (winners, losers, selectedGameId) => {
        const {
            data: {
                softballstats: { metadata },
            },
        } = this.props;
        const { currentGame, games, playerOfTheGame } = this.state;

        // console.log('Submit data', { winners, losers })
        // const stats = mergePlayerStats(currentGame, winners, losers, playerOfTheGame);
        // await PlayerStats.save(stats);
        // await SummarizeStats.save(currentGame, stats, metadata);
        await GameStats.save(currentGame, winners, losers, playerOfTheGame);
        // await MetaData.save(metadata, currentGame, winners, losers);
        // await PlayerInfo.save(winners, losers);

        const allFields = JSON.parse(metadata.allFields) || {};
        const remainingGames = games.filter((game) => game.id !== selectedGameId);
        const nextGame = remainingGames[0];
        nextGame.field = getFieldName(nextGame.field, allFields);
        nextGame.players = await this.getCurrentGamePlayers(remainingGames[0]);

        this.setState(() => {
            return {
                areTeamsSorted: false,
                currentGame: nextGame,
                games: remainingGames,
                playerOfTheGame: {},
                selectedGameId: get(nextGame, 'id', ''),
            };
        });
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

        const allFields = JSON.parse(get(this.props.data, 'softballstats.metadata.allFields', {}));
        currentGame.field = getFieldName(currentGame.field, allFields);

        this.setState(() => ({ currentGame, selectedGameId }));
    };

    /**
     * Removes a game from games menu
     * Useful when events other than games are created
     */
    handleCancelGame = async (e, id) => {
        e.stopPropagation();
        const selectedGameId = e.target.id || id;
        const games = this.state.games.filter(filterCurrentGame(selectedGameId));
        const nextGame = games[0];
        nextGame.players = await this.getCurrentGamePlayers(games[0]);

        const allFields = JSON.parse(get(this.props.data, 'softballstats.metadata.allFields', {}));
        nextGame.field = getFieldName(nextGame.field, allFields);

        this.setState(() => ({
            currentGame: nextGame,
            selectedGameId: get(nextGame, 'id', ''),
            games,
        }));
    };

    handleSetTeams = (winners, losers) => {
        this.setState(() => ({ areTeamsSorted: true, winners, losers }));
    };

    handlePlayerOfTheGame = (e) => {
        const id = e.target.value;
        const { losers, playerOfTheGame, winners } = this.state;
        let currentPotg = {};
        if (playerOfTheGame.id !== id) {
            const winner = findPlayerById(id, winners);
            const loser = findPlayerById(id, losers);
            currentPotg = winner
                ? { ...pick(winner, ['id', 'name']), winner: true }
                : { ...pick(loser, ['id', 'name']), winner: false };
        }
        console.log('potg', currentPotg);
        // const currentPotg =
        //     playerOfTheGame.id === id
        //         ? {}
        //         : winners.concat(losers).find((player) => player.id === id);
        this.setState(() => ({ playerOfTheGame: currentPotg }));
    };

    render() {
        const {
            data: {
                softballstats: { metadata },
            },
            pageResources,
        } = this.props;
        const {
            areTeamsSorted,
            currentGame,
            games,
            losers,
            playerOfTheGame,
            selectedGameId,
            winners,
        } = this.state;
        const adminPagePath = get(pageResources, 'page.path', null);

        if (!currentGame) {
            return (
                <Layout className={styles.adminPageSuccess}>
                    <SuccessImage />
                    <h3>All done! Enjoy the day!</h3>
                </Layout>
            );
        }

        const filterBarOptions = {
            disabled: true,
        };

        return (
            <Layout
                className={styles.adminPage}
                loading={isEmpty(currentGame)}
                filterBarOptions={filterBarOptions}
                uri={adminPagePath}
            >
                <div className={styles.adminPageColumn}>
                    <GameDetails data={currentGame} onGameCancel={this.handleCancelGame} />
                    <MoreGames
                        games={games}
                        onGameCancel={this.handleCancelGame}
                        onGameSelection={this.handleSelectGame}
                        selectedGame={selectedGameId}
                    />
                    <PlayerOfTheGame player={playerOfTheGame} />
                </div>
                {areTeamsSorted ? (
                    <AdminStatsTable
                        winners={winners}
                        losers={losers}
                        onChange={this.handleOnChange}
                        onSetPlayerOfTheGame={this.handlePlayerOfTheGame}
                        onSubmit={this.handleSubmitData}
                        playerOfTheGame={playerOfTheGame}
                        selectedGame={selectedGameId}
                    />
                ) : (
                    <SortTeams
                        data={currentGame}
                        setTeams={this.handleSetTeams}
                        metadata={metadata}
                    />
                )}
            </Layout>
        );
    }
}

// graphql aliases https://graphql.org/learn/queries/#aliases
export const query = graphql`
    query {
        softballstats {
            players: listPlayerss(limit: 500) {
                items {
                    id
                    name
                    photos
                }
            }
            summarized: getSummarizedStats(id: "_2018") {
                id
                stats
            }
            allSummarized: listSummarizedStatss(limit: 500) {
                items {
                    id
                    stats
                }
            }
            metadata: getMetaData(id: "_metadata") {
                id
                activePlayers
                allFields
                allYears
                inactivePlayers
                perYear
                recentGames
                recentGamesLength
                totalGamesPlayed
                totalPlayersCount
            }
        }
    }
`;

Admin.displayName = 'Admin';
Admin.propTypes = {
    data: PropTypes.shape({
        softballstats: PropTypes.shape(),
    }),
    pageResources: PropTypes.shape(),
};
/**
 * Admin | Display sign out button | Only include these Authenticator components | Federated configurations | Theme styling
 * @param { Element, Boolean, Array, Object, Object }
 */
export default withAuthenticator(Admin, true, [<Greetings />, <SignIn />]);
