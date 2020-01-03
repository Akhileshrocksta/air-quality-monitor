import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAirQualityDataSuccessActionBuilder } from '../../action/FetchAirQualityDataSuccessAction';
import { fetchDevicesSuccessActionBuilder } from '../../action/FetchDevicesSuccessAction';
import { updateCurrentDeviceActionBuilder } from '../../action/UpdateCurrentDeviceAction';
import { userDevicesSearch } from '../../book/UserDevicesSearch';
import { userMeasurementsSearch } from '../../book/UserMeasurementsSearch';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { AirQualityData } from '../../entity/AirQualityData';
import { AppState } from '../../entity/AppState';
import { Device } from '../../entity/Device';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { Dashboard, DashboardProps } from './Dashboard';

export const DashboardContainer = connect(
    (appState: AppState) => {
        return {
            airQualityData: appState.airQualityData,
            airStatus: appState.airStatus,
            meterUnit: appState.settings.meterUnit,
            currentDevice: appState.currentDevice,
            devices: appState.devices,
            suggestions: appState.suggestions,
            decimalSeparator: appState.settings.decimalSeparator,
            loadAirQualityData: !!appState.devices.length,
            iconVisualizationType: appState.settings.iconVisualizationType
    },
    (dispatch: Dispatch) => {
        return {
            onCurrentDeviceChange: (device: Device) => { dispatch(updateCurrentDeviceActionBuilder(device)); },
            dispatchFetchDevicesSuccess: (devices: Device[]) => (dispatch(fetchDevicesSuccessActionBuilder(devices))),
            dispatchFetchAirQualityDataSuccess: (airQualityData: AirQualityData) => (dispatch(fetchAirQualityDataSuccessActionBuilder(airQualityData as AirQualityData))),
            refreshToken: (token: LoginToken): Promise<LoginToken> => {
                const isExpired = Date.now() > token.expiredAt;
                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = isExpired ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiresIn: token.expiredAt } });
                return renewToken.then(response => {
                    if (response.error) {
                        console.error(`Error while renew access token: ${response.error}`);
                        throw new Error(`Error while renew access token: ${response.error}`);
                    }

                    if (!response.payload) {
                        console.error("Invalid payload");
                        throw new Error("Invalid payload");
                    }

                    const newToken = {
                        accessToken: response.payload.accessToken,
                        expiredAt: response.payload.expiredAt,
                        refreshToken: token.refreshToken,
                        username: token.username
                    };
                    dispatch(updateTokenActionBuilder(newToken));
                    return newToken;
                });
            }
        };
    },
    (stateToProps, dispatchToProps): DashboardProps => {
        return {
            airQualityData: stateToProps.airQualityData,
            airStatus: stateToProps.airStatus,
            meterUnit: stateToProps.meterUnit,
            currentDevice: stateToProps.currentDevice,
            devices: stateToProps.devices,
            suggestions: stateToProps.suggestions,
            decimalSeparator: stateToProps.decimalSeparator,
            onCurrentDeviceChange: dispatchToProps.onCurrentDeviceChange,
            fetchDevices: () => {
                const renewToken = dispatchToProps.refreshToken(stateToProps.token as LoginToken);

                renewToken.then(response => {
                    userDevicesSearch(response.accessToken)
                        .then(response => {
                            if (response.error) {
                                console.log(response.error);
                                return;
                            }

                            dispatchToProps.dispatchFetchDevicesSuccess(response.payload?.devices || []);
                        })
                        .catch((error) => {
                            // TODO: dispatch an error message
                            console.error(`Error while fetch devices: ${error}`);
                        });
                });
            },
            fetchAirQualityData: (currentDeviceId: string) => {
                const poller = () => {
                    const renewToken = dispatchToProps.refreshToken(stateToProps.token as LoginToken);
                    const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = isExpired ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiresIn: token.expiredAt } });

                    renewToken.then(response => {
                        userMeasurementsSearch(currentDeviceId, response.accessToken)
                            .then(response => {
                                if (response.error) {
                                    console.log(response.error);
                                    return;
                                }

                                dispatchToProps.dispatchFetchAirQualityDataSuccess(response.payload as AirQualityData);

                                setTimeout(() => poller(), parseInt(process.env.REACT_APP_AIR_QUALITY_DATA_REFRESH_TIME as string));
                            })
                            .catch((error) => {
                                // TODO: dispatch an error message
                                console.error(`Error while fetch air quality data: ${error}`);
                            });
                    });
                };

                poller();
            }
        } as DashboardProps;
    }
)(Dashboard);