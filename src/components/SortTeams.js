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

const setPlayerList = (players = []) => {
    const playerListWithKeys = players.map((player, i) => {
        const playerCopy = {...player};
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
    }

    submitList = () => {
        const { players, targetKeys } = this.state;
        const losers = players.filter((p, i) => targetKeys.includes(i.toString()));
        const winners = players.filter((p, i) => !targetKeys.includes(i.toString()));
        
        this.props.setTeams(winners, losers);
    }

    render() {
        const { teamTitles } = this.props;
        const { players, targetKeys } = this.state;

        return (
            <div className={componentStyles.teamTransferBox}>
                <Transfer 
                    dataSource={players}
                    onChange={this.handleChange}
                    render={item => `${item.name}`}
                    locale={locale}
                    targetKeys={targetKeys}
                    titles={teamTitles}
                    listStyle={{
                        width: '47%',
                        height: 500,
                    }}
                />
                <Button
                    size="small"
                    style={{ float: 'right', margin: 5 }}
                    onClick={this.submitList}
                >
                    Set teams
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
    teamTitles: PropTypes.array,
};

SortTeams.defaultProps = {
    data: {},
    teamTitles: ['Winners', 'Losers'],
};

export default SortTeams;