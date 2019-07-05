import React from 'react';
import PropTypes from 'prop-types';
import AdminSection from './AdminSection';
import TeamTransfer from './TeamTransfer';
import Button from './Button';

class SortTeams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            losers: [],
            gameId: props.data.id,
            players: props.data.players || [],
            teamsBalanced: false,
            winners: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data.id === prevState.id) {
            return null;
        }
        return {
            gameId: nextProps.data.id,
            players: nextProps.data.players,
        };
    }

    /**
     * @param {Array} winners - items on the left transfer box
     * @param {Array} losers - items on the right transfer box
     */
    handleChange = (winners, losers) => {
        const teamsBalanced = areTeamsBalanced(winners, losers);
        this.setState(() => ({ winners, losers, teamsBalanced }));
    };

    submitSortedTeams = () => {
        const { losers, winners, teamsBalanced } = this.state;

        if (teamsBalanced) {
            this.props.setTeams(winners, losers);
        }
    };

    render() {
        const { losers, gameId, players, teamsBalanced, winners } = this.state;

        const buttonProps = {
            disabled: !teamsBalanced,
            onClick: this.submitSortedTeams,
            tooltipMsg: `Teams are not balanced. You have ${
                winners.length
            } on the winning team and ${
                losers.length
            } on the losing team. Rebalance the teams and try again.`,
        };

        return (
            <AdminSection title="SORT TEAMS" iconType="swap" iconColor="#1890ff">
                <TeamTransfer gameId={gameId} onChange={this.handleChange} players={players} />
                <Button {...buttonProps}>SET TEAMS</Button>
            </AdminSection>
        );
    }
}

/**
 * Validate that teams are balanced with a delta of 1
 * @param {Array} winners
 * @param {Array} losers
 */
function areTeamsBalanced(winners, losers) {
    if (winners.length === 0 && losers.length === 0) {
        return false;
    }
    return Math.abs(winners.length - losers.length) <= 1;
}

SortTeams.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        field: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
    }),
    setTeams: PropTypes.func,
};

SortTeams.defaultProps = {
    data: {},
};

export default SortTeams;
