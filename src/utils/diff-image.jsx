import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

class DiffImage {
    /**
     * ミスマッチ率から結果番号を取得
     * @param {number} misMatchPercentage
     * @returns {number}
     */
    getMisMatchPercentageType(misMatchPercentage){
        if(misMatchPercentage <= 0) {
            return 1;
        }else if(misMatchPercentage <= 0.1){
            return 2;
        }
        return 0
    }
    /**
     * 結果番号からアイコンを取得
     * @param {number} check
     * @returns {number}
     */
    getMisMatchPercentageIcon(check){
        if (check === 1) {
            return <CheckCircleIcon color="primary" />
        }else if (check === 2) {
            return <ErrorIcon color="secondary" />
        }
        return <HighlightOffIcon color="secondary" />
    }
}
export default new DiffImage();