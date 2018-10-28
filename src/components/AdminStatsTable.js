import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import { Button } from 'antd';
import { Utils } from "../utils";
import "react-table/react-table.css";

class AdminStatsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data,
			dataSubmitted: false,
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// after submitting the data, we need to reset this back to false
		// to prevent unnecessary updates in shouldComponentUpdate
		if (this.state.dataSubmitted) {
			this.setState(() => ({ dataSubmitted: false, data: this.props.data }));
		}
	}

	handleSubmitData = () => {
		// hit the submit button
		// send state.data to server to update
		this.props.onSubmit(this.state.data);
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
	 * Save number entries to state
	 * @param cellInfo - argument passed back from Cell renderer from React Table columns
	 * @param e - event object from keyUp event
	 */
	handleDataEntry = (cellInfo) => (e) => {
		let value = Number(e.key);

		// do not save any values that are not numbers
		if (isNaN(value)) {
			return false;
		}

		const data = [...this.state.data];
		data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
		this.setState(() => ({ data }));
	};

	renderEditable = (cellInfo) => {
		const makeContentEditable = this.makeContentEditable(cellInfo);

		return (
			<div
				className="stat-cell"
				contentEditable={makeContentEditable}
				suppressContentEditableWarning
				onKeyDown={this.handleNonNumericKeys}
				onKeyUp={this.handleDataEntry(cellInfo)}
			>
				{this.state.data[cellInfo.index][cellInfo.column.id]}
			</div>
		);
	};

	render() {
		const { data } = this.state;

		return (
			<div>
				<ReactTable
					data={data}
					columns={[
						{
							Header: "PLAYER",
							accessor: "player",
							Cell: this.renderEditable,
							sortMethod: Utils.sortByNameLength,
							maxWidth: 150,
							width: 150,
						},
						{
							Header: "O",
							accessor: "o",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "1b",
							accessor: "1b",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "2b",
							accessor: "2b",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "3b",
							accessor: "3b",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "HR",
							accessor: "hr",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "RBI",
							accessor: "rbi",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "R",
							accessor: "r",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "BB",
							accessor: "bb",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "K",
							accessor: "k",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "SB",
							accessor: "sb",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "CS",
							accessor: "cs",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "AB",
							accessor: "ab",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
					]}
					defaultPageSize={data.length}
					className="-striped -highlight stat-table"
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
	data: PropTypes.array,
	onSubmit: PropTypes.func,
};

AdminStatsTable.defaultProps = {
	data: [],
};

export default AdminStatsTable;
