import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Pages } from "../../book/Pages";
import { AppBarOneRow } from "../common/AppBarOneRow";
import { AppButton } from "../common/AppButton";
import "./PageNotFound.scss";

export const NotFoundPage: FunctionComponent<{}> = () => {
    const { t } = useTranslation();

    return <div className="not-found-page">
        <AppBarOneRow>
            <Typography variant="h6">
                {t("appName")}
            </Typography>
        </AppBarOneRow>
        <Paper className="content">
            <Typography variant="h1" className="title">
                Page not found
            </Typography>

            <AppButton href={`#${Pages.DASHBOARD_URL}`} className="to-homepage" variant="contained">Go to home page</AppButton>
        </Paper>

    </div>;
};