import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ApplicationBar from "./components/ApplicationBar";
import Footer from "./components/Footer";

const useStyles = makeStyles(theme => ({
    container: {
        textAlign: 'center',
    }
}));

function NotFound() {
    const classes = useStyles();
    return (
        <div className="NotFound">
            <div className={classes.container}>
            <ApplicationBar title={'404: We could not find this page.'}/>
            </div>
            <Footer />
        </div>
    )
}

export default NotFound;