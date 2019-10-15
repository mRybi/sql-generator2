import React from 'react';

export default React.createContext({
    view: 0,
    app: null,
    app2: null,
    changeViewType: (viewType: number) => {}
});