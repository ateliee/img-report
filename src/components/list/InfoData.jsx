import ReactComponent from "../../modules/component";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import styles from "../../styles/styles";
import {Grid, Paper} from "@material-ui/core";
import React from "react";

class ImageInfo extends ReactComponent {
    constructor(props) {
        super(props);
    }
    render () {
        let classes = this.props.classes;
        if (this.props.data === undefined ||
            this.props.data.info === undefined) {
            return <div></div>
        }
        let info = this.props.data.info;
        return <Grid container
                         direction="row"
                         justify="flex-end"
                         spacing={1}>
                <Grid item>w: {info.width}px</Grid>
                <Grid item>h: {info.height}px</Grid>
                <Grid item>{info.type}</Grid>
            </Grid>
    }
}
ImageInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object,
};
export default withStyles(styles)(ImageInfo);