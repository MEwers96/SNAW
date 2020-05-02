import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles} from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = theme => ({
    non_button: {
        color: 'white',
        fontSize: '1em',
        backgroundColor: '#FF8042',
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        '&:hover': {
            background: '#bf6829',
        },
    },
    ant_button: {
        color: 'white',
        fontSize: '1em',
        backgroundColor: '#0088FE',
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        '&:hover': {
            background: '#004684',
        },
    },
    bio_button: {
        color: 'white',
        fontSize: '1em',
        backgroundColor: '#00C49F',
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        '&:hover': {
            background: '#005D4B',
        },
    },
    geo_button: {
        color: 'white',
        fontSize: '1em',
        backgroundColor: '#FFBB28',
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        '&:hover': {
            background: '#815F14',
        },
    },
});

class Spectrogram extends React.Component {
    state = {
        picture : 3
    }

    toggleAntImage = () => { this.setState(state => ({picture : 0})) }
    toggleBioImage = () => { this.setState(state => ({picture : 1})) }
    toggleGeoImage = () => { this.setState(state => ({picture : 2})) }
    toggleNonImage = () => { this.setState(state => ({picture : 3})) }

    getImageName = () => {
        if(this.state.picture === 0){return this.props.ant_img}
        if(this.state.picture === 1){return this.props.bio_img}
        if(this.state.picture === 2){return this.props.geo_img}
        if(this.state.picture === 3){return this.props.non_img}}

    getTitleName = () => {
        if(this.state.picture === 0){return "Anthrophony"}
        if(this.state.picture === 1){return "Biophony"}
        if(this.state.picture === 2){return "Geophony"}
        if(this.state.picture === 3){return "None"}}

    render() {
        const {classes} = this.props;
        const imageName = this.getImageName();
        const titleName = this.getTitleName();

        return (
            <div>
                <Typography variant='subtitle1'>{titleName}</Typography>
                <CardMedia id="spectrogram" component='img' image={imageName}
                           className="classes.media"/>
                           <Typography varient='subtitle1'>Toggle Classification Overlay Below</Typography>
                           <div>
                <Button disabled={false}
                        variant="contained"
                        className={classes.non_button}
                        onClick={this.toggleNonImage}>
                    None
                </Button>
                <Button disabled={false}
                        variant="contained"
                        className={classes.ant_button}
                        onClick={this.toggleAntImage}>
                    Anthrophony
                </Button>
                <Button disabled={false}
                        variant="contained"
                        className={classes.bio_button}
                        onClick={this.toggleBioImage}>
                    Biophony
                </Button>
                <Button disabled={false}
                        variant="contained"
                        className={classes.geo_button}
                        onClick={this.toggleGeoImage}>
                    Geophony
                </Button>
                           </div>
            </div>
        )
    }
}

export default withStyles(useStyles)(Spectrogram);