import React, { Component } from 'react';
import LazyLoad from "react-lazyload";
import JsonDump from  '../utils/jsondump';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import UiList from '@material-ui/core/List';
import {Container, Box, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import styles from  '../styles/styles';

class List extends React.Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;
        let images = [];
        if(props.current){
            images = _.uniq([...props.base, ...props.current]);
        }
        let totals = {
            success: 0,
            warning: 0,
            error: 0,
        }
        for(var i in images){
            let check = this.getDiffDataCheck(images[i])
            if(check === 1) {
                totals.success++;
            }else if(check === 2){
                totals.warning ++;
            }else{
                totals.error ++;
            }
        }
        this.state = {
            images: images,
            totals: totals
        }
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
        if(data <= 0) {
            return 1;
        }else if(data <= 0.1){
            return 2;
        }
        return 0
    }
    getDiffDataCheckIcon(key){
        let check = this.getDiffDataCheck(key);
        if (check === 1) {
            return <CheckCircleIcon color="primary" />
        }else if (check === 2) {
            return <ErrorIcon color="secondary" />
        }
        return <HighlightOffIcon />
    }
    orgRound(value, base) {
        base = base ? Math.pow(10, base) : 1;
        return Math.round(value * base) / base;
    }
    render() {
        let base_image_style = {
            'maxWidth': '100%'
        }
        return <div className={this.classes.root}>
            <Drawer
                className={this.classes.drawer}
                variant="permanent"
                classes={{
                    paper: this.classes.drawerPaper,
                }}
            >
                <div className={this.classes.toolbar} />
                <UiList>
                    {(() => {
                        if (!this.props.diff) {
                            return
                        }
                        return (this.state.images.map((f, i) => {
                            return <ListItem button key={i} component="a" href={'#diff'+i}>
                                <ListItemIcon>
                                    {this.getDiffDataCheckIcon(f)}
                                </ListItemIcon>
                                <ListItemText primary={f} className={this.classes.sideListItem} />
                            </ListItem>
                        }))
                    })()}
                </UiList>
            </Drawer>

            <main className={this.classes.content}>
                <div className={this.classes.toolbar} />
                <div>
                    <h2>
                        Report
                        ({(() => {
                            let res = [];
                            if(this.state.totals.success > 0) {
                                res.push('success:' + this.state.totals.success)
                            }
                            if(this.state.totals.warning > 0){
                                res.push('warning:' + this.state.totals.warning)
                            }
                            if(this.state.totals.error > 0){
                                res.push('error:' + this.state.totals.error)
                            }
                            return res.join('/');
                        })()})
                    </h2>
                </div>
                {(() => {
                    if (!this.props.diff) {
                        return <div>レポートが存在しません</div>
                    }
                    return (this.state.images.map((f, i) => {
                        return <div key={i} id={'diff'+i}>
                            <h3>
                                {this.getDiffDataCheckIcon(f)}
                                {f}
                                ({this.orgRound(this.getDiffDatawMisMatchPercentage(f), 3)} %)
                            </h3>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>dff</th>
                                        <th>{this.props.base_key}</th>
                                        <th>{this.props.current_key}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr key={'image_' + i}>
                                        {(() => {
                                            if (this.props.diff[f] === undefined) {
                                                return <td>Not Data</td>
                                            }
                                            let path = '/diff/' + this.props.current_key + '/' + f
                                            return <td>
                                                <LazyLoad height={450} offset={100}>
                                                    <img src={encodeURIComponent(path)} style={base_image_style} />
                                                </LazyLoad>
                                            </td>
                                        })()}
                                        {(() => {
                                            if (this.props.base.indexOf(f) < 0) {
                                                return <td>Not Data</td>
                                            }
                                            let path = '/assets/' + this.props.base_key + '/' + f
                                            return <td>
                                                <LazyLoad height={450} offset={100}>
                                                    <img src={encodeURIComponent(path)} style={base_image_style} />
                                                </LazyLoad>
                                            </td>
                                        })()}
                                        {(() => {
                                            if (this.props.current.indexOf(f) < 0) {
                                                return <td>Not Data</td>
                                            }
                                            let path = '/assets/' + this.props.current_key + '/' + f
                                            return <td>
                                                <LazyLoad height={450} offset={100}>
                                                    <img src={encodeURIComponent(path)} style={base_image_style} />
                                                </LazyLoad>
                                            </td>
                                        })()}
                                    </tr>
                                    <tr key={'data_' + i}>
                                        <td colSpan="3">
                        <pre>
                        <JsonDump>{this.getDiffData(f)}</JsonDump>
                        </pre>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }))
                })()}
                <Box textAlign="right">
                    Template By: <a href="https://material-ui.com/" target="_blank">Material-UI</a>
                </Box>
            </main>
            {/*<JsonDump>{this.props}</JsonDump>*/}
        </div>
    }
};
export default withStyles(styles)(List);