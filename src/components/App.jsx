import path from 'path'
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {AppBar, IconButton, Toolbar, Typography, Menu, MenuItem, Button} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import List from "./List";
import { withStyles } from '@material-ui/core/styles';
import styles from "../styles/styles";
let reports = REPORT_DATA;

class App extends React.Component {
    constructor(props){
        super(props);

        this.classes = props.classes;
        let current_key = null;
        if(reports){
            if(reports.diff){
                for(let k in reports.diff){
                    current_key = k;
                    break
                }
            }
        }
        // console.log(reports)
        this.state = {
            current_key: current_key,
            reports: reports,
            anchorEl: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    getCurrentDiff(){
        if(this.state.current_key !== null && this.state.reports && this.state.reports.diff){
            return this.state.reports.diff[this.state.current_key]
        }
        return null;
    }
    getCurrent(){
        if(this.state.current_key !== null && this.state.reports && this.state.reports.diff){
            return this.state.reports.files[this.state.current_key]
        }
        return null;
    }
    getBase(){
        if(this.state.reports && this.state.reports.base){
            return this.state.reports.files[this.state.reports.base]
        }
        return null;
    }
    getBaseKey(){
        if(this.state.reports && this.state.reports.base){
            return this.state.reports.base
        }
        return null;
    }
    handleClick(event) {
        this.anchorEl = event.currentTarget;
    }
    handleClose() {
        console.log('close')
        this.anchorEl = null;
    }
    render () {
        return <div>
            <CssBaseline />
            <AppBar position="fixed" className={this.classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" >
                        Report ({this.state.reports && this.state.reports.created})
                    </Typography>
                    <div className={this.classes.toolbarButtons}>
                    <Button aria-controls="header-menu" color="inherit" aria-haspopup="true" onClick={this.handleClick}>
                        Open Menu
                    </Button>
                    <Menu
                        id="header-menu"
                        keepMounted
                        open={Boolean(this.anchorEl)}
                        anchorEl={this.anchorEl}
                        onClose={this.handleClose}
                        className={this.classes.toolbarButtonMenu}
                    >
                        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                        <MenuItem onClick={this.handleClose}>My account</MenuItem>
                        <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                    </Menu>
                    </div>
                </Toolbar>
            </AppBar>

            <List
                base_key={this.getBaseKey()} base={this.getBase()}
                current={this.getCurrent()} current_key={this.state.current_key}
                diff={this.getCurrentDiff()} />
        </div>;
    }
}
export default withStyles(styles)(App);