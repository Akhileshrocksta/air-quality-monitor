import React, { FunctionComponent, useEffect } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { averageAirStatus } from "../../book/AverageAirStatus";
import { AirQualityData } from '../../entity/AirQualityData';
import { AirStatus } from "../../entity/AirStatus";
import { Device } from "../../entity/Device";
import { LoginToken } from '../../entity/LoginToken';
import { MeterUnit } from '../../entity/MeterUnit';
import { AppDrawer } from '../common/AppDrawer';
import './Dashboard.scss';
import { DashboardHeader } from './DashboardHeader';
import { DeviceAirQualityData } from './DeviceAirQualityData';

export const Dashboard: FunctionComponent<DashboardProps> = (props) => {
    const [isAppDrawerOpen, setIsAppDrawerOpen] = React.useState(false);

    useEffect(() => {
        props.fetchDevices();
    }, []);
    useEffect(() => {
        if (props.currentDevice) {
            props.fetchAirQualityData(props.currentDevice.deviceId);
        }
    }, [props.currentDevice]);

    const average = averageAirStatus(props.airStatus);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }

        setIsAppDrawerOpen(open);
    };

    return <div className="dashboard">
        <AppDrawerContainer
            isOpen={isAppDrawerOpen}
            toggleDrawer={toggleDrawer} />

        <DashboardHeader
            devices={props.devices}
            currentDevice={props.currentDevice}
            average={average}
            toggleDrawer={toggleDrawer}
            onCurrentDeviceChange={props.onCurrentDeviceChange}
            suggestions={props.suggestions} />

        <div className="spacer" />

        <DeviceAirQualityData
            airQualityData={props.airQualityData}
            airStatus={props.airStatus}
            decimalSeparator={props.decimalSeparator}
            meterUnit={props.meterUnit}
            iconVisualizationType={props.iconVisualizationType} />
    </div>;
};

export interface DashboardProps {
    decimalSeparator: string;

    airQualityData: AirQualityData;
    airStatus: AirStatus;
    meterUnit: MeterUnit;

    devices: Device[];
    suggestions: string[];

    currentDevice: Device | null;
    onCurrentDeviceChange: (device: Device) => void;

    fetchDevices: () => void;
    fetchAirQualityData: (currentDeviceId: string) => void;

    iconVisualizationType: string;
}