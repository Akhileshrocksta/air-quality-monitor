import Drawer from "@material-ui/core/Drawer/Drawer";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoIcon from '@material-ui/icons/Info';
import { History } from 'history';
import React, { FunctionComponent } from "react";
import { Link, useHistory } from "react-router-dom";
import { updateSecretKeyActionBuilder } from "../action/UpdateSecretKeyAction";
import { CREDITS_URL } from '../book/Pages';
import { appStore } from "../store/AppStore";
import "./AppDrawer.scss";

export const AppDrawer: FunctionComponent<AppDrawerProps> = (props) => {
    let history = useHistory();

    return <Drawer open={props.isOpen} onClose={props.toggleDrawer(false)} className="app-drawer">
        <div
            role="presentation"
            onClick={props.toggleDrawer(false)}
            onKeyDown={props.toggleDrawer(false)}
            className="list-container">
            <List>
                <ListItem button className="list-item" component={Link} to={CREDITS_URL}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="Credits" />
                </ListItem>
                <ListItem button className="list-item" onClick={() => {
                    appStore.dispatch(updateSecretKeyActionBuilder(null));
                    history.push('/login');
                }}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    </Drawer>;
};

export interface AppDrawerProps {
    isOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    history?: History;
}