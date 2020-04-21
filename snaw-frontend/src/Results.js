import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import LineChart from './Charts/LineChart';
import PieChart from './Charts/PieChart';
import Spectrogram from "./components/Spectrogram";
import ClassificationTable from "./components/ClassificationTable";
import AcousticIndiceTable from "./components/AcousticIndiceTable";
import ApplicationBar from "./components/ApplicationBar";
import Grid from '@material-ui/core/Grid';
import $ from 'jquery';
import Button from "@material-ui/core/Button";
import 'react-h5-audio-player/lib/styles.css';
import {createArrayCsvStringifier, createArrayCsvWriter} from "csv-writer";
import {createMuiTheme} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

//Surely a better way to do this other than global variable.
/* This is currently done to ensure that the panels are accessible after
 * the analysis completes. Without it, all the panels disappear after
 * clicking on one of them.
 * The change was made through removing the open statements which were constantly running
 * the scripts. Now the scripts will only run upon clicking the analysis button.
 *
 * TODO: Change Results.js to a class component, and store finalInfoDictionary within the state system.
 */
var finalInfoDictionary;


/*-------------------------------------------------------------/
 * Proper values to traverse the finalInfoDictionary[1st][2nd]:
 *
 * n-th file - [1st][] - used when referencing the entire dictionary, ex/ finalInfoDictionary[n-th file][OTHER_PARAM] where n-th file is the NUMBER of the file in the entire list of files. Dynamically called by Results().
 *
 * fileName - [][2nd] - The name of the file
 * fileSpectro - [][2nd] - The Base64 of the Spectrogram image
 * fileAudio - [][2nd] - The Base64 of the audio file
 * fileData - [][2nd] - The classification.py output of the file
 * fileAcoustics - [][2nd] - The acousticIndices.py out of the file
 *-------------------------------------------------------------/
 * Example of the dictionary structure:  {n-th file: [fileName, fileSpectro, fileAudio, fileData, fileAcoustics]}
 * Example call of the dictionary:
 * finalInfoDictionary[0][fileName] - This retrieves the name of the FIRST file in the list of all files
 *-------------------------------------------------------------*/

let fileName = 0;
let fileSpectro = 1;
let fileAudio = 2;
let fileData = 3;
let fileAcoustics = 4;


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    button: {
        color: 'white',
        fontSize: '1em',
        backgroundColor: '#AA4C39',
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        '&:hover': {
            background: '#550F00',
        },
    },
}));

const customtheme = createMuiTheme({
    palette : {
        primary : { main: '#297B48',
            light: '#7BB992',
            dark: '#003E17',
            contrastText: '#ffffff'},	/* Main Primary color */
        secondary : { main: '#AA4C39' },	/* Main Complement color */
    }
})

/*-----------------------------------------------------/
 * Function: fileInserted()
 *-----------------------------------------------------/
 * This function is in place to stop the page from constantly
 * running the classification and spectrogram functions.
 * It does so by checking if any files are actually present, if
 * there are none, the functions will not run. Once those functions
 * do run, the files are deleted.
 *-----------------------------------------------------*/
function fileInserted(){
    var result = '';
    $.ajax({
        url: '/didUpload',
        type: "GET",
        async: false,
        success: function(response){
            console.log(response);
            result = response;
        },
        error: function(error){
            console.log(error);
        },
    });
    return result;
}
/* Func: run_analysis()
   When the function is called, an ajax call is made to /results/spectro
   flask function returns a file location of a created spectrogram file based on audio file uploaded
   spectro_load set to true, allows function to only be loaded on results.js creation, not update
   ajax response is returned to the function
*/
function run_analysis( ){
    var result = '';
    $.ajax({
        url: '/results/analysis',
        type: "GET",
        async: false,
        success: function(response){
        //console.log(response);
        result = response;
        },
        error: function(error){
        console.log(error);
        },
    });
    return result;
}

/* func: downloadCSVFile
   creates a CSV file with a classification result when export button is pressed
 */
function downloadCSVFile(fileNumber){

    const element = document.createElement("a");

    var infoDictKeys = finalInfoDictionary[fileNumber][fileData][0]['data'];

    const csvWriter = createArrayCsvStringifier({
        header : ['CATEGORY', 'TIME'],
        path : "classification_"+finalInfoDictionary[fileNumber][fileName]+"_results.csv"
    });
    const data = [['Anthrophony Model:', ' ', ' ', 'Biophony Model:', ' ', ' ', 'Geophony Model:', ' ', ' '], ['CATEGORY', 'TIMESTAMP (sec)', ' ', 'CATEGORY', 'TIMESTAMP (sec)', ' ', 'CATEGORY', 'TIMESTAMP (sec)']];
    for(var  keys = 0; keys < infoDictKeys.length; keys++) {
        var csvArray = [];
        for (var dictCount = 0; dictCount < 3; dictCount++) {
            //Adds information line by line in a CSV.
            csvArray.push(finalInfoDictionary[fileNumber][fileData][dictCount]["data"][keys]["category"]);
            csvArray.push(finalInfoDictionary[fileNumber][fileData][dictCount]["data"][keys]["time"]);
            csvArray.push(' ');

        }
        data.push(csvArray);

    }

    //csvWriter.writeRecords(data).then(r => console.log("Done"));
   //Fnd proper finalInfoDictionary traversing at top of file

    const file = new Blob([csvWriter.stringifyRecords(data)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);

    element.download = "classification_"+finalInfoDictionary[fileNumber][fileName]+"_results.csv";

    document.body.appendChild(element); // Required for this to work in FireFox

    element.click();
}

/*
 * Here we are checking the above function fileInserted,
 * which will tell us if there are files present, if not
 * the get_spectro and get_class will not run
 */
function runAnalysis() {

        // Create a final dictionary to store all information about each file
        //var resultDictionary;
        // Run spectrogram conversion
        //var indices = get_indices();
        var analysis_results = run_analysis();

        //TODO: This process needs to be completed in the backend, and then the finished dictionary sent through to front-end
        //resultDictionary = spectroImg;

        //Put everything together into one dictionary for dynamic adding.
        //for (var i = 0; i < Object.keys(spectroImg).length; i++) {
            //var classification = spectroImg[i][3];
            //resultDictionary[i].push(classification);
        //    resultDictionary[i].push(indices[i])
        //}
        console.log(analysis_results);
        return analysis_results;
}

//setter function for the global dictionary. Safety i guess?
function setGlblDictionary(dictionary){
    finalInfoDictionary = dictionary;
}

function Results() {
    console.log(finalInfoDictionary);
    //Check if files are currently inserted into the filesystem
    if(fileInserted() === "True") {
        //Set global var: finalInfoDictionary to the results of the analysis
        setGlblDictionary(runAnalysis());
    }
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className="App">
            <body>
            <ApplicationBar title={'Results of Analysis'}/>
            <Container>
                <br/><br/>
                <Typography variant='h5' style={{color:customtheme.palette.primary.dark}}>
                    View your Classified Audio Soundscape File(s) Below
                </Typography>
                <Divider middle/>
                <br/>
                {Object.entries(finalInfoDictionary).map(([key, value]) => {
                    return (
                        <ExpansionPanel expanded={expanded === key} onChange={handleChange(key)}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header">
                                <Typography className={classes.heading}>Results of</Typography>
                                <Typography className={classes.secondaryHeading}>{value[fileName]}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Container>
                                    <Paper>
                                    <br/>
                                    <Spectrogram ant_img={value[fileSpectro][0]}
                                                 bio_img={value[fileSpectro][1]}
                                                 geo_img={value[fileSpectro][2]}/>
                                    <br/>
                                    </Paper>
                                    <br/>
                                    <Typography variant='subtitle1'>Playback Audio File</Typography>
                                    <audio controls src={value[fileAudio]}/>
                                    <br/>
                                    <br/>
                                    <Typography variant='subtitle1'>Results from the Anthrophony, Geophony and Biophony Classification
                                        Models</Typography>
                                    <br/>
                                    <Grid container spacing={2}>
                                        <Grid item linechart>
                                            <Paper><LineChart series={value[fileData]}/></Paper>
                                        </Grid>
                                        <Grid item piechart>
                                            <Paper><PieChart series={value[fileData]}/></Paper>
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    <ClassificationTable series={value[fileData]}/>
                                    <br/>
                                    <ExpansionPanel>
                                    <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                        <Typography className={classes.heading}>Click to View Acoustic Indices Calculations</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <AcousticIndiceTable indices={value[fileAcoustics]}/>
                                    </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                    <br/>
                                    <Paper>
                                        <Button onClick={function () {
                                            downloadCSVFile(key)
                                        }} variant="contained" className={classes.button}>Export Neural Network Classification</Button>
                                    </Paper>
                                </Container>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        )})}
            </Container>
            </body>
            <footer>
                <Container>
                    <br/><br/>
                    <Typography variant='subtitle1'>Created by NAU Capstone Team IntelliChirp</Typography>
                    <br/>
                </Container>
            </footer>
        </div>
            )
        }

export default Results;
