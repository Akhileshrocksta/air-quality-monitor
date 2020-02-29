import IconButton from "@material-ui/core/IconButton/IconButton";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimelineIcon from '@material-ui/icons/Timeline';
import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import { isNullOrUndefined } from "../../book/IsNullOrUndefined";
import { Pages } from "../../book/Pages";
import { celsiusToFahrenheit } from "../../book/TemperatureConverter";
import { TemperatureUnit } from "../../book/Unit";
import { Device } from "../../entity/Device";
import { MeterUnit } from "../../entity/MeterUnit";
import { ReadingTypes } from './../../book/ReadingTypes';

export const DeviceInfo: FunctionComponent<DeviceInfoProps> = props => {
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const isThereAddress = props.device.address && props.device.address.length;

    let temperatureValue =
        (props.meterUnit.temperature === TemperatureUnit.CELSIUS ? props.device.cpuTemperature : celsiusToFahrenheit(props.device.cpuTemperature))
            .toFixed(1)
            .replace(".", props.decimalSeparator)
        + (props.meterUnit.temperature === TemperatureUnit.CELSIUS ? "°C" : "°F");

    return <ListItem className="device">
        <ListItemIcon
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
            <IconButton>
                {isDetailsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </ListItemIcon>
        <ListItemText
            primary={props.device.name}
            secondary={
                isDetailsOpen && <React.Fragment>
                    <div className="ip">
                        <strong>IP:</strong> {props.device.deviceIP.split(";")[0]}
                    </div>
                    {isThereAddress && <div className="address">
                        <strong>Address:</strong> {props.device.address}
                    </div>}
                    {!isNullOrUndefined(props.device.cpuTemperature) && <div className="temperature">
                        <strong>CPU temperature:</strong> {temperatureValue}
                    </div>}
                </React.Fragment>
            } />
        <ListItemIcon>
            <Tooltip title="CPU temperature trend">
                <IconButton component={Link} to={`${Pages.CHARTS_URL}/${ReadingTypes.CPU_TEMPERATURE}/${props.device.deviceId}`}>
                    <TimelineIcon />
                </IconButton>
            </Tooltip>
        </ListItemIcon>
        <ListItemIcon>
            <IconButton onClick={() => props.onDeleteClick(props.device)}>
                <DeleteForeverIcon />
            </IconButton>
        </ListItemIcon>
    </ListItem>;
};

export interface DeviceInfoProps {
    device: Device;
    meterUnit: MeterUnit;
    decimalSeparator: string;
    onDeleteClick: (device: Device) => void;
}