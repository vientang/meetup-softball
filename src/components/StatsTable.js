import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import componentStyles from './components.module.css';
import "react-table/react-table.css";

class StatsTable extends React.Component {

    renderColumns = () => {
        const { cellRenderer, players, sortMethod } = this.props;
        let categories = Object.keys(players[0]).filter(cat => cat !== 'id' && cat !== 'meetupId' && cat !== 'key');
        const nameIndex = categories.findIndex(cat => cat === 'name');
        const playerColumn = categories.splice(nameIndex, 1)[0];
        categories.unshift(playerColumn);
        
        const columns = categories.map(category => {
            const isPlayerCat = category === 'name';

            const column = {
                Header: isPlayerCat ? 'Player' : category.toUpperCase(),
                accessor: category,
                sortMethod: isPlayerCat && sortMethod ? sortMethod : null,
                maxWidth: isPlayerCat ? 200 : 50,
                width: isPlayerCat ? 200 : 50,
            }
        
            if (cellRenderer) {
                column.Cell = cellRenderer;
            }

            return column;
        });
        return columns;
    }

	render() {
        const { players, showPagination, style } = this.props;
    
        if (!players || players.length < 1) {
            return null;
        }

        return (
			<div className={componentStyles.statsTable}>
				<ReactTable
					data={players}
					className="-striped -highlight"
					columns={this.renderColumns()}
					defaultPageSize={players.length}
                    showPaginationBottom={showPagination}
                    style={style}
				/>
			</div>
		);
	}
}

StatsTable.propTypes = {
    cellRenderer: PropTypes.func,
    players: PropTypes.array,
    showPagination: PropTypes.bool,
    sortMethod: PropTypes.func,
};

StatsTable.defaultProps = {
    players: [],
    showPagination: false,
};

export default StatsTable;
