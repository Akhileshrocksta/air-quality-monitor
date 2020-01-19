import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { APP_SETTINGS_URL, CHARTS_URL, CREDITS_URL, DASHBOARD_URL, LOGIN_URL, APP_CONSOLE_URL } from './book/Pages';
import { NotFoundPage } from './component/404/PageNotFound';
import { ChartsContainer } from './component/charts/ChartsContainer';
import { IsLogged } from './component/common/IsLogged';
import { AppConsoleContainer } from './component/console/AppConsoleContainer';
import { Credits } from './component/credits/Credits';
import { DashboardContainer } from './component/dashboard/DashboardContainer';
import { LoginContainer } from './component/login/LoginContainer';
import { AppSettingsContainer } from './component/settings/AppSettingsContainer';
import './index.scss';
import { appStore } from './store/AppStore';

ReactDOM.render(
    <Provider store={appStore}>
        <CssBaseline />
        <HashRouter>
            <Switch>
                <Route exact path={CREDITS_URL} component={Credits} />
                <Route exact path={DASHBOARD_URL}>
                    <IsLogged
                        loginPageUrl={LOGIN_URL}
                        sourceUrl={DASHBOARD_URL}>
                        <DashboardContainer />
                    </IsLogged>
                </Route>
                <Route exact path="/" component={LoginContainer} />
                <Route path={LOGIN_URL} component={LoginContainer} />
                <Route path={APP_SETTINGS_URL} component={AppSettingsContainer} />
                <Route path={`${CHARTS_URL}/:readingType`} component={ChartsContainer} />
                <Route path={`${APP_CONSOLE_URL}`} component={AppConsoleContainer} />
                <Route component={NotFoundPage} />
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);
