/**
 * Created by Joker on 2017-08-17.
 */
import React, {Component} from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    Text,
    View,
    Dimensions,
    Platform,
    Animated,
    Easing
} from 'react-native'
import PropTypes from 'prop-types'
import SFFlatListFooter from './SFFlatListFooter'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width;

export default class SFFlatList extends Component {
    static propTypes = {
        onBeginRefreshHeader: PropTypes.func,
        onBeginRefreshFooter: PropTypes.func,
        refreshHeaderTitle: PropTypes.string,
        refreshHeaderColor: PropTypes.string,
        refreshHeaderBgColor: PropTypes.string,
        emptyComponent: PropTypes.object,
        emptyDefaultTitle: PropTypes.string,
        emptyDefaultColor: PropTypes.string,
        onEndShouldRate: PropTypes.number


    }
    static defaultProps={
        emptyDefaultTitle:'没有数据',
        emptyDefaultColor:'rgba(200,200,200,1)',
        onEndShouldRate:0.2
    }

    constructor(props) {
        super(props)
        this.state = {
            refreshHeader:false,
            fHeight:0,//flatList高度,
            isShowEmpty:false

        }
    }

    componentWillMount() {
        this.isFirst = true;
    }
    componentDidMount() {


    }
    keyExtractor = (item, index) => 'flcell_'+index;

    beginRefreshHeader = () => {
        this.onDidRefreshHeader()
    }

    endRefreshHeader = () => {
        this.setState({
            refreshHeader:false
        },()=>{
            if (this.isFirst){
                this.isFirst = false;
                if (this.props.data.length == 0){
                    this.setState({
                        isShowEmpty:true
                    })
                }
            }
        })
    }
    endRefreshFooter = () => {
        this.refs.flatFooter.endRefresh()
    }
    endRefreshNomore = () => {
        this.refs.flatFooter.endRefreshNomore()
    }

    onDidRefreshHeader = () => {
        if (this.props.onBeginRefreshHeader){
            var state = this.refs.flatFooter.getRefreshState();
            if (state == 2){
                this.refs.flatFooter.endRefresh();
            }
            this.setState({
                refreshHeader:true
            })
            this.props.onBeginRefreshHeader();
        }
    }
    onDidRefreshFooter = () => {
        if (this.props.onBeginRefreshFooter){
            this.refs.flatFooter.didRefresh()
            this.props.onBeginRefreshFooter();
        }
    }
    onScroll = (e) => {
        if (!this.props.onBeginRefreshFooter){
            return;
        }
        var state = this.refs.flatFooter.getRefreshState();
        if (state != 0){
            return;
        }
        let scrollY = e.nativeEvent.contentOffset.y;
        let contentHeight = e.nativeEvent.contentSize.height;
        if (contentHeight == 0 || scrollY <= 0 ){
            return;
        }

        if (scrollY+this.state.fHeight > contentHeight-this.state.fHeight*this.props.onEndShouldRate){
            this.onDidRefreshFooter()
        }
    }
    render() {

        return (
            <FlatList
                {...this.props}
                ListEmptyComponent = {this.renderEmpty()}
                keyExtractor = {this.keyExtractor}
                refreshControl={this.renderHeader()}
                initialNumToRender={15}
                ListFooterComponent={this.renderFooter()}
                onScroll={this.onScroll}
                onLayout={e => {
                    console.log('1111')
                    let height = e.nativeEvent.layout.height;
                    if (this.state.fHeight < height) {
                        this.setState({fHeight: height})
                    }}}
            />
        )
    }
    renderEmptyContent = () => {
        if (this.props.emptyComponent){
            return this.props.emptyComponent;
        }else{
            return(
                <Text style={{
                    color:this.props.emptyDefaultColor,
                    fontSize:14,
                }}>{this.props.emptyDefaultTitle}</Text>
            )
        }
    }
    renderEmpty = () => {
        if (!this.state.isShowEmpty){
            return null;
        }
        return(
            <View style={{
                width:width,
                height:this.state.fHeight,
                alignItems:'center',
                justifyContent:'center'
            }}>
                {this.renderEmptyContent()}
            </View>
        )
    }
    renderHeader = () => {
        if (this.props.onBeginRefreshHeader){
            return(
                <RefreshControl
                    refreshing={this.state.refreshHeader}
                    onRefresh={this.onDidRefreshHeader}
                    title={this.props.refreshHeaderTitle}
                    colors={this.props.refreshHeaderColor}
                    progressBackgroundColor={this.props.refreshHeaderBgColor}
                    tintColor={this.props.refreshHeaderColor}
                />
            )
        }
        return null;
    }
    renderFooter = () => {
        return(
            <SFFlatListFooter ref="flatFooter"/>
        )
    }

}