import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import withFilterBar from '../components/withFilterBar';
import NotFoundImage from '../components/NotFoundImage';
import StatsTable from '../components/StatsTable';
import { Utils, apiService } from '../utils';

const categories = [
    'player',
    'gp',
    'ab',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
    'obp',
    'ops',
    'slg',
    'woba',
];

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
            noDataFound: false,
        };
    }

    componentDidUpdate(prevProps) {
        let playerStats = [];
        const receivedNewStats = !isEqual(prevProps.gameData, this.props.gameData);
        if (prevProps.gameData.length <= 0 || receivedNewStats) {
            this.props.gameData.forEach((game) => {
                const updatedStats = apiService.filterPlayerStats(game);
                playerStats = Array.from(updatedStats.values());
            });
            this.updatePlayerStats(playerStats);
        }
        apiService.clearMasterList();
    }

    updatePlayerStats = (playerStats) => {
        this.setState(() => ({ playerStats, noDataFound: playerStats.length < 1 }));
    };

    render() {
        const { playerData } = this.props;
        const { playerStats, noDataFound } = this.state;
        const style = { height: '800px' };

        if (noDataFound) {
            return <NotFoundImage />;
        }

        if (playerData.length > 0) {
            console.log('player data', playerData);
        }

        return (
            <StatsTable
                categories={categories}
                players={playerStats}
                sortMethod={Utils.sortHighToLow}
                style={style}
            />
        );
    }
}

Stats.propTypes = {
    gameData: PropTypes.arrayOf(PropTypes.shape),
    playerData: PropTypes.arrayOf(PropTypes.shape),
};

Stats.defaultProps = {
    gameData: [],
    playerData: [],
};

export default withFilterBar(Stats);
