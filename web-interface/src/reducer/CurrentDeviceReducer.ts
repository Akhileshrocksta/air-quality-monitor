import { Action } from "redux";
import { FetchDevicesSuccessAction, FetchDevicesSuccessActionName } from "../action/FetchDevicesAction";
import { UpdateCurrentDeviceAction, UpdateCurrentDeviceActionName } from "../action/UpdateCurrentDeviceAction";
import { LocalStorageKey } from "../book/LocalStorageKey";
import { localStorageManager } from "../book/LocalStorageManager";
import { Device } from "../entity/Device";
import { initialAppState } from "../store/InitialAppState";

export const currentDeviceReducer = (state: Device | null = initialAppState.currentDevice, action: Action): Device | null => {
    switch (action.type) {
        case FetchDevicesSuccessActionName:
            const updateDevicesAction = action as FetchDevicesSuccessAction;
            if (updateDevicesAction.devices && updateDevicesAction.devices.length && !state) {
                localStorageManager.setItem(LocalStorageKey.CURRENT_DEVICE_KEY, updateDevicesAction.devices[0]);
                return updateDevicesAction.devices[0];
            }

            if (!updateDevicesAction.devices || !updateDevicesAction.devices.length) {
                localStorageManager.removeItem(LocalStorageKey.CURRENT_DEVICE_KEY);
                return null;
            }
            break;
        case UpdateCurrentDeviceActionName:
            const updateCurrentDeviceAction = action as UpdateCurrentDeviceAction;
            localStorageManager.setItem(LocalStorageKey.CURRENT_DEVICE_KEY, updateCurrentDeviceAction.currentDevice);
            return updateCurrentDeviceAction.currentDevice;
    }
    return state;
};