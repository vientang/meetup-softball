import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import { Button } from 'antd';
import { Utils } from "../utils";
import "react-table/react-table.css";
import './components.css';

class AdminStatsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			players: props.data.players,
			dataSubmitted: false,
		};
	}

	static getDerivedStateFromProps(props) {
		return {
            players: props.data.players,
		}
	}

	handleSubmitData = (e) => {
        e.preventDefault();
		this.props.onSubmit(this.state.players, this.props.selectedGame);        
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
	 * Save number entries to state
	 * @param cellInfo - meta data for each cell
	 */
	handleDataEntry = (cellInfo) => (e) => {
		let value = Number(e.key);

		// do not save any values that are not numbers
		if (isNaN(value)) {
			return false;
		}

		const players = [...this.state.players];
        players[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
        
		this.setState(() => ({ players }));
	};

	renderEditableCell = (cellInfo) => {
        const makeContentEditable = this.makeContentEditable(cellInfo);

        return (
			<div
				className="stat-cell"
				contentEditable={makeContentEditable}
				suppressContentEditableWarning
				onKeyDown={this.handleNonNumericKeys}
				onKeyUp={this.handleDataEntry(cellInfo)}
			>
				{this.state.players[cellInfo.index][cellInfo.column.id]}
			</div>
		);
	};

	render() {
        const { players } = this.state;
    
        if (!players || players.length < 1) {
            return null;
        }
        
		return (
			<div className="stats-table-container">
				<ReactTable
					data={players}
					columns={[
						{
							Header: "PLAYER",
							accessor: "name",
							Cell: this.renderEditableCell,
							sortMethod: Utils.sortByNameLength,
							maxWidth: 150,
							width: 150,
						},
						{
							Header: "O",
							accessor: "o",
							Cell: this.renderEditableCell,
							maxWidth: 50,
                        },
						{
							Header: "1b",
							accessor: "1b",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "2b",
							accessor: "2b",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "3b",
							accessor: "3b",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "HR",
							accessor: "hr",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "RBI",
							accessor: "rbi",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "R",
							accessor: "r",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "BB",
							accessor: "bb",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "K",
							accessor: "k",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "SB",
							accessor: "sb",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
						{
							Header: "CS",
							accessor: "cs",
							Cell: this.renderEditableCell,
							maxWidth: 50,
                        },
                        {
							Header: "SAC",
							accessor: "sac",
							Cell: this.renderEditableCell,
							maxWidth: 50,
						},
					]}
					defaultPageSize={players.length}
					className="-striped -highlight stats-table"
					showPaginationBottom={false}
				/>
				<div className="submit-button">
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
	data: PropTypes.shape({
        gameId: PropTypes.string,
        location: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
    }),
    onSubmit: PropTypes.func,
    selectedGame: PropTypes.string,
};

AdminStatsTable.defaultProps = {
	data: {},
};

export default AdminStatsTable;
