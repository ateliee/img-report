
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
    toolbar: theme.mixins.toolbar,
    sideListItem: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
});