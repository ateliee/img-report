import React  from 'react';
import LazyLoad from "react-lazyload";
import JsonDump from  '../utils/jsondump';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import styles from  '../styles/styles';
import DiffImage from '../utils/diff-image'
import PropTypes from "prop-types";

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
    render() {
        let base_image_style = {
            'maxWidth': '100%'
        }
        return <div>
            <Typography variant="h1">
                        {this.props.current_key}
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