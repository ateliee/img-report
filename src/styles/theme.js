
import { createMuiTheme } from '@material-ui/core/styles';
export default createMuiTheme({
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
            lineHeight: 1.6,
        },
        h2: {
            fontSize: 20,
            fontWeight: 'bold',
            lineHeight: 1.4,
            marginTop: 20,
            marginBottom: 14
        },
        h3: {
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 8
        },
        h4: {
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 8
        },
    }
})