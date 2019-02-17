import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Transfer } from 'antd';
import componentStyles from './components.module.css';
import 'antd/dist/antd.css';

const locale = {
    itemUnit: 'Player',
    itemsUnit: 'Players',
    notFoundContent: 'No losers yet',
};

const transferBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.45rem',
};

const listStyle = {
    width: '47%',
    height: 500,
};

const setPlayerList = (players = []) => {
    const playerListWithKeys = players.map((player, i) => {
        const playerCopy = { ...player };
        playerCopy.key = i.toString();
        return playerCopy;
    });

    return playerListWithKeys;
};

class SortTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: props.data.gameId,
            players: setPlayerList(props.data.players) || [],
            targetKeys: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data.gameId === prevState.gameId) {
            return null;
        }
        return {
            gameId: nextProps.data.gameId,
            players: setPlayerList(nextProps.data.players),
        };
    }

    /**
     * @param {Array} targetKeys - items on the right transfer box
     */
    handleChange = (targetKeys) => {
        this.setState(() => ({ targetKeys }));
    };

    filterPlayers = (players, targetKeys, winners) => {
        return players
            .filter((p, i) => {
                return winners
                    ? !targetKeys.includes(i.toString())
                    : targetKeys.includes(i.toString());
            })
            .map((p, i) => {
                const player = { ...p };
                player.battingOrder = (i + 1).toString();
                return player;
            });
    };

    submitList = () => {
        const { players, targetKeys } = this.state;
        const losers = this.filterPlayers(players, targetKeys, false);
        const winners = this.filterPlayers(players, targetKeys, true);

        this.props.setTeams(winners, losers);
    };

    render() {
        const { teamTitles } = this.props;
        const { players, targetKeys } = this.state;

        return (
            <div className={componentStyles.teamTransferBox}>
                <Transfer
                    dataSource={players}
                    onChange={this.handleChange}
                    render={(item) => `${item.name}`}
                    locale={locale}
                    style={transferBoxStyle}
                    targetKeys={targetKeys}
                    titles={teamTitles}
                    listStyle={listStyle}
                />
                <Button
                    type="primary"
                    className={componentStyles.setTeams}
                    onClick={this.submitList}
                >
                    SET TEAMS
                </Button>
            </div>
        );
    }
}

SortTeams.propTypes = {
    data: PropTypes.shape({
        gameId: PropTypes.string,
        field: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
    }),
    setTeams: PropTypes.func,
    teamTitles: PropTypes.arrayOf(PropTypes.string),
};

SortTeams.defaultProps = {
    data: {},
    teamTitles: ['Winners', 'Losers'],
};

export default SortTeams;
