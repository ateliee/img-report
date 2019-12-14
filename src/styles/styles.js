
import grey from '@material-ui/core/colors/grey';

const drawerWidth = 300;
export default theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    toolbarButtonMenu:{
        zIndex: theme.zIndex.drawer + 2,
    },
    toolbarButtons:{
        marginLeft: "auto",
        marginRight: -12
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    nocontent: {
        padding: theme.spacing(10),
        textAlign: 'center',

    },
    toolbar: theme.mixins.toolbar,
    sideListItem: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    pre: {
        backgroundColor: grey[100],
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: grey[300],
        paddingLeft: 16,
        paddingRight: 16,
    },
    footer: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        textAlign: 'right'
    },
});