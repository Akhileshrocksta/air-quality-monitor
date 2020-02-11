import { Action } from "redux";
import { UpdateTokenAction, UpdateTokenActionName } from "../action/UpdateTokenAction";
import { SessionStorageKey } from "../book/SessionStorageKey";
import { sessionStorageManager } from "../book/SessionStorageManager";
import { LoginToken } from "../entity/LoginToken";
import { initialAppState } from "../store/InitialAppState";

export const tokenReducer = (state: LoginToken | null = initialAppState.token, action: Action) => {
    switch (action.type) {
        case UpdateTokenActionName:
            const updateTokenAction = action as UpdateTokenAction;
            sessionStorageManager.setItem(SessionStorageKey.TOKEN_KEY, updateTokenAction.token);
            return updateTokenAction.token;
    }

    return state;
};