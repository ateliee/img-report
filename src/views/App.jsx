import React from "react";
import ReactComponent from '../modules/component';
import CssBaseline from "@material-ui/core/CssBaseline";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
    Collapse,
    MuiThemeProvider,
    ListItem,
    ListItemIcon, ListItemText, Box
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import List from "../components/List";
import { withStyles } from '@material-ui/core/styles';
import styles from "../styles/styles";
import Drawer from "@material-ui/core/Drawer";
import UiList from "@material-ui/core/List/List";
import PermMediaIcon from '@material-ui/icons/PermMedia';
import DiffImage from '../utils/diff-image'
import theme from '../styles/theme'
import PropTypes from 'prop-types';
let reports = REPORT_DATA;

class App extends ReactComponent {
    constructor(props){
        super(props);

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
            open: true,
            anchorEl: null,
        };
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
    changeCurrent(target) {
        this.setState({current_key: target});
    }
    handleDrawerOpen() {
        this.setState({open: !this.state.open});
    }
    handleClick(event) {
        this.setState({anchorEl: event.currentTarget});
    }
    handleClose() {
        this.setState({anchorEl: null});
    }
    render () {
        let classes = this.props.classes;
        return <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu"
                                onClick={this.handleDrawerOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" >
                        Report ({this.state.reports && this.state.reports.created})
                    </Typography>
                    <div className={classes.toolbarButtons}>
                    <Button aria-controls="header-menu" color="inherit" aria-haspopup="true" onClick={this.handleClick}>
                        {this.state.current_key}
                    </Button>
                    <Menu
                        id="header-menu"
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        className={classes.toolbarButtonMenu}
                    >
                        {(() => {
                            if (!this.state.reports) {
                                return
                            }
                            return (Object.keys(this.state.reports.diff).map((f) => {
                                return <MenuItem onClick={() => { this.changeCurrent(f); this.handleClose(); }} key={f}>{f}</MenuItem>
                            }))
                        })()}
                    </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            {(() => {
                if (!this.getCurrentDiff()) {
                    return <div className={classes.nocontent}>
                        <div className={classes.toolbar}>
                            <Typography variant="h1">レポートが存在しません</Typography>
                        </div>
                    </div>
                }
                return <div className={classes.root}>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        open={this.state.open}
                    >
                        <div className={classes.toolbar} />
                        <UiList>
                            {(() => {
                                if (!this.state.reports) {
                                    return
                                }
                                return (Object.keys(this.state.reports.diff).map((f) => {
                                    return ([
                                        <ListItem button component="a" href='#' onClick={ () => this.changeCurrent(f) } key={'files_'+f}>
                                            <ListItemIcon>
                                                <PermMediaIcon />
                                                {/*{this.getDiffDataCheckIcon(f)}*/}
                                            </ListItemIcon>
                                            <ListItemText primary={f} className={classes.sideListItem} />
                                        </ListItem>,
                                        (() => {
                                            if(f !== this.state.current_key){
                                                return null
                                            }
                                            return <Collapse in={true} timeout="auto" unmountOnExit key={'files_list_'+f}>
                                                <UiList component="div" disablePadding>
                                                    {(() => {
                                                        let images = Object.assign({}, this.getBase());
                                                        Object.assign(images, this.getCurrent());

                                                        return Object.keys(images).map((f, ii) => {
                                                            let ff = images[f];
                                                            let diff = this.getCurrentDiff();
                                                            let data = diff ? diff[f] : null;
                                                            let missMatchs = data ? data.data.rawMisMatchPercentage : 100.0;

                                                            return <ListItem button component="a" href={'#diff'+ii} className={classes.nested} key={ii}>
                                                                <ListItemIcon>
                                                                    {DiffImage.getMisMatchPercentageIcon(DiffImage.getMisMatchPercentageType(missMatchs))}
                                                                </ListItemIcon>
                                                                <ListItemText primary={ff.name} />
                                                            </ListItem>
                                                        })
                                                    })()}
                                                </UiList>
                                            </Collapse>
                                        })()
                                    ])
                                }))
                            })()}
                        </UiList>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <List
                            base_key={this.getBaseKey()} base={this.getBase()}
                            current={this.getCurrent()} current_key={this.state.current_key}
                            diff={this.getCurrentDiff()}/>
                        <Box className={classes.footer}>
                            &copy; <a href="https://github.com/ateliee/img-report" target="_blank" rel="noopener noreferrer">ateliee/img-report</a>
                        </Box>
                    </main>
                </div>
            })()}
        </MuiThemeProvider>;
    }
}
App.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);