import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withFilterBar, CareerStats, PlayerGameLog, PlayerInfo } from '../components';

const careerStats = [
    {
        gp: '2',
        w: '.529',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '1',
        rbi: '1',
        r: '1',
        sb: '1',
        cs: '0',
        k: '1',
        bb: '1',
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '1',
        sac: '1',
    },
];

const gameStats = [
    {
        game: 'Game 245 WWS',
        gp: '2',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '1',
        rbi: '1',
        r: '1',
        sb: '1',
        cs: '0',
        k: '1',
        bb: '1',
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '1',
        sac: '1',
    },
];

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            player: {},
        };
    }

    async componentDidMount() {
        if (typeof window === 'undefined') {
            return;
        }

        const player = get(this.props, 'location.state.playerName', null);
        const playerStats = get(this.props, 'location.state.playerStats', {});
        const playerInMemory = await localStorage.getItem('currentPlayer');

        if (player) {
            // routed by clicking on player name
            await localStorage.setItem('currentPlayer', JSON.stringify(playerStats));
            this.setState(() => ({ player: playerStats }));
        } else if (playerInMemory) {
            // routed by refreshing player page
            // location.state is gone but we've saved it in localStorage
            // so we're good!
            this.setState(() => ({ player: JSON.parse(playerInMemory) }));
        }
    }

    componentWillUnmount() {
        const playerInMemory = localStorage.getItem('currentPlayer');

        if (playerInMemory) {
            localStorage.removeItem('currentPlayer');
        }
    }

    render() {
        return (
            <>
                <PlayerInfo playerInfo={this.state.player} />
                <CareerStats stats={careerStats} />
                <PlayerGameLog stats={gameStats} />
            </>
        );
    }
}

Player.displayName = 'Player';
/* eslint-disable react/no-unused-prop-types */
Player.propTypes = {
    filterBar: PropTypes.node,
    gameData: PropTypes.arrayOf(PropTypes.shape),
    location: PropTypes.shape(),
    playerData: PropTypes.arrayOf(PropTypes.shape),
};

Player.defaultProps = {
    gameData: [],
    location: {},
    playerData: [],
};

export default withFilterBar(Player);
