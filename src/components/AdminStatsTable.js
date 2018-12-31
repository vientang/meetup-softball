import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Utils } from '../utils';
import StatsTable from './StatsTable';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

class AdminStatsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            winners: props.winners,
            losers: props.losers,
			dataSubmitted: false,
		};
	}

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.dataSubmitted;
    }
    
	handleSubmitData = (e) => {
        const { winners, losers } = this.state;
        e.preventDefault();
        this.props.onSubmit(winners, losers, this.props.selectedGame);
        this.setState(() => ({ dataSubmitted: true }));
	};

	makeContentEditable = (cellInfo) => {
		return !isNaN(cellInfo.value);
	};

	/**
	 * Prevent non numeric keys from being triggered
	 * Prevent enter key from going to a new line
	 * @param e - event object from keyDown event
	 */
	handleNonNumericKeys = (e) => {
		const enterKey = e.key === 'Enter';
		const tabKey = e.key === 'Tab';
		const leftKey = e.key === 'ArrowLeft';
		const rightKey = e.key === 'ArrowRight';
		const backSpaceKey = e.key === 'Backspace';
		const charKeys = isNaN(Number(e.key));

		// keep default browser behavior for these keys
		if (backSpaceKey || tabKey || leftKey || rightKey) {
			return true;
		}

		// prevent default behavior of these keys
		if (enterKey || charKeys) {
			e.preventDefault();
		}
	};

	/**
	 * Save winner entries to state
	 * @param cellInfo - meta data for each cell
	 */
	handleWinnerEntry = (cellInfo) => (e) => {
        let value = Number(e.key);
        
		// do not save any values that are not numbers
		if (isNaN(value)) {
			return false;
		}

		const winners = [...this.state.winners];
        winners[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
        
        this.setState(() => ({ winners }));
	};

    /**
	 * Save loser entries to state
	 * @param cellInfo - meta data for each cell
	 */
    handleLoserEntry = (cellInfo) => (e) => {
		let value = Number(e.key);

		// do not save any values that are not numbers
		if (isNaN(value)) {
			return false;
		}

		const losers = [...this.state.losers];
        losers[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
        
		this.setState(() => ({ losers }));
    };
    
	renderWinnerEditableCell = (cellInfo) => {
        const makeContentEditable = this.makeContentEditable(cellInfo);
        
        return (
			<div
                className={componentStyles.statCell}
				contentEditable={makeContentEditable}
				suppressContentEditableWarning
				onKeyDown={this.handleNonNumericKeys}
				onKeyUp={this.handleWinnerEntry(cellInfo)}
			>
				{this.state.winners[cellInfo.index][cellInfo.column.id]}
			</div>
		);
	};

    renderLoserEditableCell = (cellInfo) => {
        const makeContentEditable = this.makeContentEditable(cellInfo);
        
        return (
			<div
				className={componentStyles.statCell}
				contentEditable={makeContentEditable}
				suppressContentEditableWarning
				onKeyDown={this.handleNonNumericKeys}
				onKeyUp={this.handleLoserEntry(cellInfo)}
			>
				{this.state.losers[cellInfo.index][cellInfo.column.id]}
			</div>
		);
    };
    
	render() {
        const { categories } = this.props;
        const { winners, losers } = this.state;
    
        if (!winners || winners.length < 1) {
            return null;
        }
        
		return (
			<div className={componentStyles.adminStatsTable}>
                <h3>Winners</h3>
                <StatsTable 
                    players={winners} 
                    categories={categories}
                    cellRenderer={this.renderWinnerEditableCell} 
                    showPagination={false}
                    sortMethod={Utils.sortByNameLength}
                />
                <h3>Losers</h3>
				<StatsTable 
                    players={losers} 
                    categories={categories}
                    cellRenderer={this.renderLoserEditableCell} 
                    showPagination={false}
                    sortMethod={Utils.sortByNameLength}
                />
				<div className={componentStyles.submitButton}>
					<Button
						type="primary"
						htmlType="button"
						onClick={this.handleSubmitData}
					>
						Submit
					</Button>
				</div>
            </div>
		);
	}
}

AdminStatsTable.propTypes = {
    winners: PropTypes.array,
    losers: PropTypes.array,
    categories: PropTypes.array,
    onSubmit: PropTypes.func,
    selectedGame: PropTypes.string,
};

AdminStatsTable.defaultProps = {
    winners: [],
    losers: [],
    categories: [],
};

export default AdminStatsTable;
