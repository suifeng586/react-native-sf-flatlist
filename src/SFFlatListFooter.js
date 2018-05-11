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
export default class SFFlatListFooter extends Component {
    static propTypes = {
    }
    static defaultProps={

    }

    constructor(props) {
        super(props)
        this.state = {
            refreshState:0,//0:隐藏 1：刷新 2:没有更多
            refreshFooterRotate:new Animated.Value(0),
        }
    }

    componentWillMount() {
        this.refreshState = 0;
    }
    componentDidMount() {

    }
    getRefreshState = () => {
        return this.refreshState;
    }
    didRefresh = () => {
        this.refreshState = 1;
        this.setState({
            refreshState:1
        },()=>{
            var TIMES = 30;
            Animated.timing(this.state.refreshFooterRotate,{
                toValue: 360*TIMES,
                duration: 800*TIMES,
                easing: Easing.linear
            }).start();// 开始spring动画
        })
    }
    endRefresh = () => {
        this.refreshState = 0;
        this.setState({
            refreshState:0
        })
    }
    endRefreshNomore = () => {
        this.refreshState = 2;
        this.setState({
            refreshState:2
        })
    }
    render() {

        if (this.state.refreshState == 1){
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