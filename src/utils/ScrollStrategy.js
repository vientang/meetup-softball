/**
 **********************************
 * Make sure containerNode has css position: relative or absolute to
 * ensure the offsetTop is accurate.
 * accurate.
 * @param focusedNode
 * @param containerNode
 **********************************
 */

const center = (focusedNode, containerNode) => {
    if (focusedNode && containerNode) {
        const { offsetTop: itemOffset, offsetHeight: itemHeight } = focusedNode;
        const { offsetHeight: menuHeight } = containerNode;

        // eslint-disable-next-line no-param-reassign
        containerNode.scrollTop = itemOffset - (menuHeight - itemHeight) / 2;
    }
};

const edge = (focusedNode, containerNode) => {
    if (focusedNode && containerNode) {
        const { offsetTop: itemOffset, offsetHeight: itemHeight } = focusedNode;
        const { offsetHeight: menuHeight, scrollTop } = containerNode;

        if (itemOffset < scrollTop) {
            // The item is above window
            // eslint-disable-next-line no-param-reassign
            containerNode.scrollTop = itemOffset;
        }

        if (itemOffset + itemHeight > menuHeight + scrollTop) {
            // item is below window
            // eslint-disable-next-line no-param-reassign
            containerNode.scrollTop = itemOffset + itemHeight - menuHeight;
        }
    }
};

const ScrollStrategy = {
    center,
    edge,
};

export default ScrollStrategy;
