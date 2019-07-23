import React from 'react';

export default React.createContext({
    view: 0,
    app: null,
    changeViewType: (viewType: number) => {}
});