/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import withFilterBar from '../components/withFilterBar';
import PlayerInfo from '../components/PlayerInfo';

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            playerName: '',
        };
    }

    async componentDidMount() {
        if (typeof window === 'undefined') {
            return;
        }

        const player = get(window, 'history.state.playerName', null);
        const playerInMemory = await localStorage.getItem('currentPlayer');
        if (player) {
            if (!playerInMemory) {
                // first time saving to local storage
                // TODO: calculate the players career stats
                // replace the value with players calculated stats
                localStorage.setItem('currentPlayer', player);
                console.log('current player', playerInMemory);
            }
            this.setState(() => ({ playerName: player }));
        } else if (playerInMemory) {
            // if reached, player page was refreshed
            // window.history is gone but we've saved it in localStorage
            // so we're good!
            console.log('playerInMemory', playerInMemory);
            this.setState(() => ({
                playerName: playerInMemory,
            }));
        }
    }

    async componentWillUnmount() {
        const playerInMemory = await localStorage.getItem('currentPlayer');
        if (playerInMemory) {
            console.log('componentWillUnmount', playerInMemory);
            localStorage.removeItem('currentPlayer');
        }
    }

    render() {
        return (
            <div>
                <PlayerInfo playerInfo={{ name: this.state.playerName }} />
            </div>
        );
    }
}

Player.propTypes = {
    gameData: PropTypes.arrayOf(PropTypes.shape),
    playerData: PropTypes.arrayOf(PropTypes.shape),
};

Player.defaultProps = {
    gameData: [],
    playerData: [],
};

export default withFilterBar(Player);
