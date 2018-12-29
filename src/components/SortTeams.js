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

class SortTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: this.setPlayerList(props.data.players) || [],
            targetKeys: [],
        };
    }
    
    /**
     * @param {Array} targetKeys - items on the right transfer box
     */
    handleChange = (targetKeys) => {
        this.setState(() => ({ targetKeys }));
    }

    setPlayerList = (players) => {
        const playerListWithKeys = players.map((player, i) => {
            const playerCopy = {...player};
            playerCopy.key = i.toString();
            return playerCopy;
        });

        return playerListWithKeys;        
    }

    submitList = (e) => {
        const { players, targetKeys } = this.state;
        const losers = players.filter((p, i) => targetKeys.includes(i.toString()));
        const winners = players.filter((p, i) => !targetKeys.includes(i.toString()));
        
        this.props.setTeams(winners, losers);
    }

    renderFooter = () => (
        <Button
            size="small"
            style={{ float: 'right', margin: 5 }}
            onClick={this.submitList}
        >
            Set teams
        </Button>
    )

    render() {
        const { players, targetKeys } = this.state;

        return (
            <div className={componentStyles.teamTransferBox}>
                <Transfer 
                    dataSource={players}
                    onChange={this.handleChange}
                    render={item => `${item.name}`}
                    footer={this.renderFooter}
                    locale={locale}
                    targetKeys={targetKeys}
                    titles={['Winners', 'Losers']}
                    listStyle={{
                        width: '47%',
                        height: 500,
                    }}
                />
            </div>
        );
    }
}

SortTeams.propTypes = {
    data: PropTypes.shape({
        gameId: PropTypes.string,
        location: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
    }),
};

SortTeams.defaultProps = {
    data: {},
};

export default SortTeams;