import React  from 'react';
import ReactComponent from '../modules/component';
import LazyLoad from "react-lazyload";
import JsonDump from  '../utils/jsondump';
import { withStyles } from '@material-ui/core/styles';
import {Typography, Grid, Paper} from '@material-ui/core';
import styles from  '../styles/styles';
import DiffImage from '../utils/diff-image'
import PropTypes from "prop-types";
import InfoData from "./list/InfoData";

// const StyledTableCell = withStyles(theme => ({
//     head: {
//         backgroundColor: indigo[500],
//         color: theme.palette.common.white,
//         padding: 8,
//         width: '33.3%',
//     },
//     body: {
//         fontSize: 14,
//         textAlign: 'center',
//     },
// }))(TableCell);

class List extends ReactComponent {
    constructor(props) {
        super(props);

        let images = this._getImages(props);
        this.state = {
            images: images,
            totals: this._getTotal(images),
        }
    }
    _getImages(props){
        let images = {};
        if(props.current){
            // images = _.uniq([...props.base, ...props.current]);
            images = Object.assign(images, props.base);
            Object.assign(images, props.current);
        }
        return images;
    }
    _getTotal(images){
        let totals = {
            success: 0,
            warning: 0,
            error: 0,
        };
        for(var i in images){
            let check = this.getDiffDataCheck(images[i].name)
            if(check === 1) {
                totals.success++;
            }else if(check === 2){
                totals.warning ++;
            }else{
                totals.error ++;
            }
        }
        return totals;
    }
    getDiffData(key){
        if(this.props.diff[key] !== undefined){
            return this.props.diff[key].data
        }
        return null
    }
    getDiffDatawMisMatchPercentage(key){
        let data = this.getDiffData(key)
        if(data){
            return data.rawMisMatchPercentage
        }
        return 100.0
    }
    getDiffDataCheck(key){
        let data = this.getDiffDatawMisMatchPercentage(key)
        return DiffImage.getMisMatchPercentageType(data)
    }
    getDiffDataCheckIcon(key){
        let check = this.getDiffDataCheck(key);
        return DiffImage.getMisMatchPercentageIcon(check);
    }
    orgRound(value, base) {
        base = base ? Math.pow(10, base) : 1;
        return Math.round(value * base) / base;
    }
    totalReport(){
        let images = this._getImages(this.props);
        let totals = this._getTotal(images);
        let res = [];
        if(totals.success > 0) {
            res.push('success:' + totals.success)
        }
        if(totals.warning > 0){
            res.push('warning:' + totals.warning)
        }
        if(totals.error > 0){
            res.push('error:' + totals.error)
        }
        return res.join('/');
    }
    render() {
        let base_image_style = {
            'maxWidth': '100%'
        };
        let classes = this.props.classes;
        return <div>
            <Typography variant="h1">
                        {this.props.current_key}
                        ({this.totalReport()})
                    </Typography>
            {(() => {
                return (Object.keys(this.state.images).map((f, i) => {
                    return <div key={i} id={'diff'+i}>
                        <Typography variant="h2">
                            <Grid container direction="row" alignItems="center" spacing={1}>
                                {this.getDiffDataCheckIcon(f)}
                                <Grid item>
                                    {f}
                                    ({this.orgRound(this.getDiffDatawMisMatchPercentage(f), 3)} %)
                                </Grid>
                            </Grid>
                        </Typography>
                        <Grid container
                              direction="row"
                              alignItems="stretch"
                              justify="space-between"
                              spacing={2}>
                            <Grid item xs>
                                <Paper className={classes.paper} style={{height: '100%'}}>
                                    <Typography variant="h4" component="h3">
                                        diff
                                    </Typography>
                                    {(() => {
                                        if (this.props.diff[f] === undefined) {
                                            return <div>Not Data</div>
                                        }
                                        let path = '/diff/' + this.props.current_key + '/' + f
                                        return <LazyLoad height={450} offset={100}>
                                            <img src={encodeURIComponent(path)} style={base_image_style} />
                                        </LazyLoad>
                                    })()}
                                    <InfoData data={this.props.diff[f]} />
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper className={classes.paper} style={{height: '100%'}}>
                                    <Typography variant="h4" component="h3">
                                        {this.props.base_key}
                                    </Typography>
                                    {(() => {
                                        if (this.props.base[f] === undefined) {
                                            return <div>Not Data</div>
                                        }
                                        let path = '/assets/' + this.props.base_key + '/' + f
                                        return <LazyLoad height={450} offset={100}>
                                            <img src={encodeURIComponent(path)} style={base_image_style} />
                                        </LazyLoad>
                                    })()}
                                    <InfoData data={this.props.base[f]} />
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper className={classes.paper} style={{height: '100%'}}>
                                    <Typography variant="h4" component="h3">
                                        {this.props.current_key}
                                    </Typography>
                                    {(() => {
                                        if (this.props.current[f] === undefined) {
                                            return <div>Not Data</div>
                                        }
                                        let path = '/assets/' + this.props.current_key + '/' + f
                                        return <LazyLoad height={450} offset={100}>
                                            <img src={encodeURIComponent(path)} style={base_image_style} />
                                        </LazyLoad>
                                    })()}
                                    <InfoData data={this.props.current[f]} />
                                </Paper>
                            </Grid>
                        </Grid>
                        <div>
                            {(() => {
                                if(!this.getDiffData(f)){
                                    return 'No Data';
                                }
                                return <pre className={classes.pre}>
                        <JsonDump>{this.getDiffData(f)}</JsonDump>
                        </pre>
                            })()}
                        </div>
                    </div>
                }))
            })()}
        </div>
    }
}
List.propTypes = {
    classes: PropTypes.object.isRequired,
    base: PropTypes.object.isRequired,
    base_key: PropTypes.string.isRequired,
    current: PropTypes.object.isRequired,
    current_key: PropTypes.string.isRequired,
    diff: PropTypes.object.isRequired,
};
export default withStyles(styles)(List);