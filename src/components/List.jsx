import React  from 'react';
import LazyLoad from "react-lazyload";
import JsonDump from  '../utils/jsondump';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styles from  '../styles/styles';
import indigo from '@material-ui/core/colors/indigo';
import DiffImage from '../utils/diff-image'
import PropTypes from "prop-types";

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: indigo[500],
        color: theme.palette.common.white,
        padding: 8,
        width: '33.3%',
    },
    body: {
        fontSize: 14,
        textAlign: 'center',
    },
}))(TableCell);

class List extends React.Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;
        let images = this._getImages(props);
        this.state = {
            images: images,
            totals: this._getTotal(images),
        }
    }
    _getImages(props){
        let images = [];
        if(props.current){
            images = _.uniq([...props.base, ...props.current]);
        }
        return images;
    }
    _getTotal(images){
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
        }
        return <div>
            <Typography variant="h1">
                        {this.props.current_key}
                        ({this.totalReport()})
                    </Typography>
            {(() => {
                if (!this.props.diff) {
                    return <Typography variant="h1">レポートが存在しません</Typography>
                }
                return (this.state.images.map((f, i) => {
                    return <div key={i} id={'diff'+i}>
                        <Typography variant="h2">
                            {this.getDiffDataCheckIcon(f)}
                            {f}
                            ({this.orgRound(this.getDiffDatawMisMatchPercentage(f), 3)} %)
                        </Typography>
                        <div className="table-responsive">
                            <Table className="table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell>dff</StyledTableCell>
                                    <StyledTableCell>{this.props.base_key}</StyledTableCell>
                                    <StyledTableCell>{this.props.current_key}</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableRow key={'image_' + i}>
                                    {(() => {
                                        if (this.props.diff[f] === undefined) {
                                            return <StyledTableCell>Not Data</StyledTableCell>
                                        }
                                        let path = '/diff/' + this.props.current_key + '/' + f
                                        return <StyledTableCell>
                                            <LazyLoad height={450} offset={100}>
                                                <img src={encodeURIComponent(path)} style={base_image_style} />
                                            </LazyLoad>
                                        </StyledTableCell>
                                    })()}
                                    {(() => {
                                        if (this.props.base.indexOf(f) < 0) {
                                            return <StyledTableCell>Not Data</StyledTableCell>
                                        }
                                        let path = '/assets/' + this.props.base_key + '/' + f
                                        return <StyledTableCell>
                                            <LazyLoad height={450} offset={100}>
                                                <img src={encodeURIComponent(path)} style={base_image_style} />
                                            </LazyLoad>
                                        </StyledTableCell>
                                    })()}
                                    {(() => {
                                        if (this.props.current.indexOf(f) < 0) {
                                            return <StyledTableCell>Not Data</StyledTableCell>
                                        }
                                        let path = '/assets/' + this.props.current_key + '/' + f
                                        return <StyledTableCell>
                                            <LazyLoad height={450} offset={100}>
                                                <img src={encodeURIComponent(path)} style={base_image_style} />
                                            </LazyLoad>
                                        </StyledTableCell>
                                    })()}
                                </TableRow>
                                    <TableRow key={'data_' + i}>
                                        <TableCell colSpan="3">

                                        {(() => {
                                        if(!this.getDiffData(f)){
                                            return 'No Data';
                                        }
                                        return <pre className={this.classes.pre}>
                        <JsonDump>{this.getDiffData(f)}</JsonDump>
                        </pre>
                                    })()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                }))
            })()}
                </div>
    }
}
List.propTypes = {
    classes: PropTypes.object.isRequired,
    base: PropTypes.array.isRequired,
    base_key: PropTypes.string.isRequired,
    current: PropTypes.array.isRequired,
    current_key: PropTypes.string.isRequired,
    diff: PropTypes.object.isRequired,
};
export default withStyles(styles)(List);