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
        emptyDefaultColor: PropTypes.string

    }
    static defaultProps={
        emptyDefaultTitle:'没有数据',
        emptyDefaultColor:'rgba(200,200,200,1)'
    }

    constructor(props) {
        super(props)
        this.state = {
            refreshHeader:false,
            refreshFooter:false,
            refreshFooterNomore:false,
            refreshFooterRotate:new Animated.Value(0),
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
        this.setState({
            refreshHeader:true
        })
        this.onDidRefreshHeader()
    }

    endRefreshHeader = () => {
        console.log('endRefreshHeader')
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
        console.log('endRefreshFooter')
        this.setState({
            refreshFooter:false
        })
    }

    onDidRefreshHeader = () => {
        this.props.onBeginRefreshHeader();
        console.log('onDidRefreshFooter')
    }
    onDidRefreshFooter = () => {
        if (this.props.data.length == 0){
            return
        }
        if (!this.state.refreshFooter){
            this.setState({
                refreshFooter:true
            })

            var TIMES = 10;
            Animated.timing(this.state.refreshFooterRotate,{
                toValue: 360*TIMES,
                duration: 800*TIMES,
                easing: Easing.linear
            }).start();// 开始spring动画

            console.log('onDidRefreshFooter')
            this.props.onBeginRefreshFooter();
        }

    }

    render() {

        return (
            <FlatList
                {...this.props}
                ListEmptyComponent = {this.renderEmpty()}
                keyExtractor = {this.keyExtractor}
                refreshControl={this.renderHeader()}
                ListFooterComponent={this.renderFooter()}
                onEndReached={this.onDidRefreshFooter}
                onEndReachedThreshold={0.3}
                onLayout={e => {
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
        if (this.props.onBeginRefreshFooter && !this.state.refreshFooterNomore && this.state.refreshFooter){
            return(
                <View style={{
                    width:width,
                    height:50,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <Animated.Image source={require('./img/footer_loading.png')} style={{
                        width:24,
                        height:24,
                        transform:[{rotate: this.state.refreshFooterRotate
                            .interpolate({inputRange: [0, 360],outputRange: ['0deg', '360deg']})
                        }]
                    }}></Animated.Image>
                </View>
            )
        }
        return null;
    }

}