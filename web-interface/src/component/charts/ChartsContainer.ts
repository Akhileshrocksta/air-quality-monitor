import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ReadingTypes } from '../../book/ReadingTypes';
import { celsiusToFahrenheit } from '../../book/TemperatureConverter';
import { TemperatureUnit } from '../../book/Unit';
import { userRenewAccessToken, UserRenewAccessTokenResponse } from '../../book/UserRenewAccessToken';
import { userTimeRangeReadings } from '../../book/UserTimeRangeReadings';
import { Granularity } from '../../entity/Granularity';
import { LoginToken } from '../../entity/LoginToken';
import { ServiceResponse } from '../../entity/ServiceResponse';
import { fetchTimeRangeErrorActionBuilder, fetchTimeRangeStartActionBuilder, fetchTimeRangeSuccessActionBuilder } from './../../action/FetchTimeRangeAction';
import { AppState } from './../../entity/AppState';
import { Charts, ChartsProps } from './Charts';

export const ChartsContainer = connect(
    (appState: AppState): Partial<ChartsProps> => {
        return {
            airQualityDataAverages: appState.airQualityDataAverages,
            token: appState.token as LoginToken,
            deviceId: appState.currentDevice?.deviceId,
            title: (measurementType: string): string => {
                switch (measurementType) {
                    case ReadingTypes.TVOC: return 'TVOC';
                    case ReadingTypes.PRESSURE: return 'Pressure';
                    case ReadingTypes.HUMIDITY: return 'Humidity';
                    case ReadingTypes.TEMPERATURE: return 'Temperature';
                    case ReadingTypes.CO2: return 'CO2';
                    case ReadingTypes.CPU_TEMPERATURE: return 'CPU temperature';
                }
                return '';
            },
            decimalSeparator: appState.settings.decimalSeparator,
            value: (measurementType: string, value: number, decimalSeparator: string): string => {
                switch (measurementType) {
                    case ReadingTypes.TVOC:
                    case ReadingTypes.PRESSURE:
                    case ReadingTypes.HUMIDITY:
                    case ReadingTypes.CO2:
                        return value
                            .toFixed(0)
                            .replace('.', decimalSeparator);
                    case ReadingTypes.TEMPERATURE:
                    case ReadingTypes.CPU_TEMPERATURE:
                        return (appState.settings.meterUnit.temperature === TemperatureUnit.CELSIUS ? value : celsiusToFahrenheit(value))
                            .toFixed(1)
                            .replace(".", decimalSeparator);
                }
                return '';
            },
            unitMeter: (measurementType: string): string => {
                switch (measurementType) {
                    case ReadingTypes.TVOC: return appState.settings.meterUnit.tvoc;
                    case ReadingTypes.PRESSURE: return appState.settings.meterUnit.pressure;
                    case ReadingTypes.HUMIDITY: return appState.settings.meterUnit.humidity;
                    case ReadingTypes.TEMPERATURE: return appState.settings.meterUnit.temperature === TemperatureUnit.CELSIUS ? "°C" : "°F";
                    case ReadingTypes.CO2: return appState.settings.meterUnit.co2;
                    case ReadingTypes.CPU_TEMPERATURE: return "°C";
                }
                return '';
            },
            dateFormat: appState.settings.dateFormat,
            shortDateFormat: appState.settings.shortDateFormat,
        } as ChartsProps;
    },
    (dispatch: Dispatch): ChartsProps => {
        return {
            fetchAverages: (token: LoginToken, deviceId: string, measurementType: string, timestamp: number | undefined) => {
                dispatch(fetchTimeRangeStartActionBuilder());

                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ?
                    userRenewAccessToken(token.refreshToken) :
                    Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                renewToken
                    .then(response => {
                        if (response.error || !response.payload) {
                            console.log(response.error);
                            return;
                        }

                        return userTimeRangeReadings(deviceId, response.payload?.accessToken, measurementType, timestamp)
                            .then(response => {
                                if (response.error) {
                                    dispatch(fetchTimeRangeErrorActionBuilder(response.error));
                                    return;
                                }

                                if (!response.payload) {
                                    dispatch(fetchTimeRangeErrorActionBuilder(0));
                                    return;
                                }

                                dispatch(fetchTimeRangeSuccessActionBuilder(
                                    response.payload.timeRangeReadings.filter(m => m.granularity === Granularity.yearly) || [],
                                    response.payload.timeRangeReadings.filter(m => m.granularity === Granularity.monthly) || [],
                                    response.payload.timeRangeReadings.filter(m => m.granularity === Granularity.daily) || []
                                ));
                            })
                            .catch(error => {
                                console.error(error);
                                dispatch(fetchTimeRangeErrorActionBuilder(error));
                            });
                    })
                    .catch(error => {
                        console.error(error);
                        dispatch(fetchTimeRangeErrorActionBuilder(error));
                    });
            }
        } as ChartsProps;
    }
)(Charts);