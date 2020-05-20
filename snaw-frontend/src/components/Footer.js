import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({

    footer: {
        marginLeft: 'auto', 
        marginRight: 'auto', 
        textAlign: 'center',
    }
}));

function Footer() {
    const classes = useStyles();
    return (
        <div className="Footer">
            <footer>
              <Container>
                <br/><br/>
                <Typography variant='subtitle1' className={classes.footer}>
                    Created by NAU Capstone Team IntelliChirp · 
                    <a href="https://www.ceias.nau.edu/capstone/projects/CS/2020/IntelliChirp-S20/">
                        Visit project website
                    </a> · 
                    <a href="https://soundscapes2landscapes.org/">
                        Visit our sponsor
                    </a>
                </Typography>
                <br/>
              </Container>
            </footer>
        </div>
    )
}

export default Footer;