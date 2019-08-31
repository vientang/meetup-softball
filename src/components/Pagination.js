import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import componentStyles from './components.module.css';

/* eslint-disable react/prop-types */
const defaultButton = (props) => (
    <button type="button" {...props}>
        {props.children}
    </button>
);

const Pagination = (props) => {
    const {
        PageButtonComponent = defaultButton,
        nextText,
        onPageChange,
        page,
        pages,
        previousText,
    } = props;
    const [visiblePages, setVisiblePages] = useState([]);
    const [activePage, setActivePage] = useState(page + 1);

    const handleNextPage = (currPage) => () => {
        const visiblePages = getVisiblePages(currPage, pages);
        setVisiblePages(filterPages(visiblePages, pages));
        setActivePage(activePage + 1);

        onPageChange(currPage - 1);
    };
    const handlePrevPage = (currPage) => () => {
        const visiblePages = getVisiblePages(currPage, pages);
        setVisiblePages(filterPages(visiblePages, pages));
        setActivePage(activePage - 1);

        onPageChange(currPage - 1);
    };

    const handlePageSelection = (e) => {
        const currPage = getCurrentPage(e);
        const visiblePages = getVisiblePages(currPage, pages);
        setVisiblePages(filterPages(visiblePages, pages));
        setActivePage(currPage);

        onPageChange(currPage - 1);
    };

    useEffect(() => {
        setVisiblePages(getVisiblePages(null, pages));
        setActivePage(activePage);
    }, [pages]);

    const prevButtonClass = cn({
        [componentStyles.pageButton]: true,
        [componentStyles.pageButtonDisabled]: activePage === 1,
    });

    const nextButtonClass = cn({
        [componentStyles.pageButton]: true,
        [componentStyles.pageButtonDisabled]: activePage === pages,
    });

    return (
        <div className={componentStyles.pagination}>
            <PageButtonComponent
                className={prevButtonClass}
                onClick={handlePrevPage(activePage - 1)}
                disabled={activePage === 1}
            >
                {previousText}
            </PageButtonComponent>
            {visiblePages.map((page, index, array) => {
                return (
                    <PageButtonComponent
                        key={page}
                        className={`${componentStyles.pageButton} ${activePage === page &&
                            componentStyles.pageButtonActive}`}
                        onClick={handlePageSelection}
                    >
                        {array[index - 1] + 2 < page ? `...${page}` : page}
                    </PageButtonComponent>
                );
            })}
            <PageButtonComponent
                className={nextButtonClass}
                onClick={handleNextPage(activePage + 1)}
                disabled={activePage === pages}
            >
                {nextText}
            </PageButtonComponent>
        </div>
    );
};

function getVisiblePages(page, total) {
    if (total < 7) {
        return filterPages([1, 2, 3, 4, 5, 6], total);
    }
    if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
    }
    if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
    }
    return [1, 2, 3, 4, 5, total];
}

function filterPages(visiblePages = [], totalPages) {
    return visiblePages.filter((page) => page <= totalPages);
}

function getCurrentPage(e) {
    let currPage = e.target.textContent || e.target.innerText;
    if (currPage[0] === '.') {
        currPage = Number(currPage.slice(3));
    } else {
        currPage = Number(currPage);
    }
    return currPage;
}

Pagination.displayName = 'Pagination';
Pagination.propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    PageButtonComponent: PropTypes.node,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string,
};

export default Pagination;
