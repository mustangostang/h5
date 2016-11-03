import "babel-polyfill";

import './styler/master.scss';
import Main from './containers/Main';
import Video from './containers/Video'
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import advancedSearchReducer from './reducers';
import _ from 'lodash';

const AdvancedSearchApp = props => {
    const logger = createLogger();
    const state = { settings: { ...props } };
    let store = createStore(advancedSearchReducer, state,
        compose(
          applyMiddleware(thunk, logger),
          window.devToolsExtension ? window.devToolsExtension() : f => f
        )
      );

    const reactComponent = (<Provider store={store}>
      <div>
        <Main />
        <Video />
      </div>
    </Provider>);
    return reactComponent;
};

ReactDOM.render(React.createElement(AdvancedSearchApp,
  { language: "en", theme: "light", userName: "Test developer", userToken: "belinde", groupId: 200, subgroupId: 1190, subgroupName: "Test subgroup" }
), document.getElementById('app'));
