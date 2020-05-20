import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles} from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from '@material-ui/icons/Info';

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
                <Typography variant='h6'>
                    Spectrogram Visualization
                    <br/>
                </Typography>
                <Typography variant='subtitle1'>
                    Overlay Toggled: <b>{titleName}</b>
                    <Tooltip title={'In each spectrogram overlay, predictions will be labelled with a category and a confidence percentage. The percentage is how confident the model is that the category is correct. For example: 75% Insects (The model is 75% confident that insects are present in that portion of the audio file)'}><Button><InfoIcon/></Button></Tooltip>
                </Typography>
                <CardMedia id="spectrogram" component='img' image={imageName}
                           className="classes.media"/>
                           <Typography varient='subtitle1'>Toggle Classification Overlay Below</Typography>
                           <div>
                               <Tooltip title={'Spectrogram without an overlay.'}>
                <Button disabled={false}
                        variant="contained"
                        className={classes.non_button}
                        onClick={this.toggleNonImage}>
                    None
                </Button>
                               </Tooltip>
                               <Tooltip title={'Sounds made by Humans.'}>
                <Button disabled={false}
                        variant="contained"
                        className={classes.ant_button}
                        onClick={this.toggleAntImage}>
                    Anthrophony
                </Button>
                               </Tooltip>
                <Tooltip title={'Sounds made by Animals.'}>
                <Button disabled={false}
                        variant="contained"
                        className={classes.bio_button}
                        onClick={this.toggleBioImage}>
                    Biophony
                </Button>
            </Tooltip>
            <Tooltip title={'Sounds made by Nature.'}>
                <Button disabled={false}
                        variant="contained"
                        className={classes.geo_button}
                        onClick={this.toggleGeoImage}>
                    Geophony
                </Button>
                </Tooltip>
                           </div>
            </div>
        )
    }
}

export default withStyles(useStyles)(Spectrogram);