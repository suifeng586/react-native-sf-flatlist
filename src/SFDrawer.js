/**
 * Created by Joker on 2017-08-17.
 */
import React, {Component} from 'react'
import {
    Text,
    View,
    Dimensions,
    Platform,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;

export default class SFDrawer extends Component {
    static propTypes = {
        drawerWidthRate: PropTypes.number,
        drawerHeight: PropTypes.number,
        drawerDirection: PropTypes.string,
        drawerTop: PropTypes.number,
        backgroundColor: PropTypes.string,
        onOpen: PropTypes.func,
        onClose: PropTypes.func

    }
    static defaultProps={
        drawerWidthRate:0.7,
        drawerHeight:dh,
        drawerTop:0,
        drawerDirection:'left',
        backgroundColor:'rgba(0,0,0,0.7)'
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentWillMount() {
        this.width = dw*this.props.drawerWidthRate;
        if (this.props.drawerDirection == 'left'){
            this.aniPosX = new Animated.Value(-this.width);
            this.showX = 0;
            this.hideX = -this.width;
        }else{
            this.aniPosX = new Animated.Value(dw);
            this.showX = dw-this.width;
            this.hideX = dw;
        }
        this.aniOpacity = new Animated.Value(0);
        this.aniWidth = new Animated.Value(0);
    }
    componentDidMount() {

    }
    show = () => {
        Animated.timing(this.aniPosX, {
            toValue: this.showX,
            duration: 300,
        }).start();
        Animated.timing(this.aniOpacity, {
            toValue: 1,
            duration: 300,
        }).start();
        this.aniWidth.setValue(dw);
        if (this.props.onOpen){
            this.props.onOpen()
        }
    }
    hide = () => {
        Animated.timing(this.aniPosX, {
            toValue: this.hideX,
            duration: 300,
        }).start();
        Animated.timing(this.aniOpacity, {
            toValue: 0,
            duration: 300,
        }).start(()=>{
            this.aniWidth.setValue(0);
        });

        if (this.props.onClose){
            this.props.onClose()
        }
    }
    render() {
        var directionStyle;
        if (this.props.drawerDirection == 'left'){
            directionStyle = {right:0}
        }else{
            directionStyle = {left:0}
        }
        return (
            <Animated.View style={{
                position:'absolute',
                left:0,
                top:this.props.drawerTop,
                width:this.aniWidth,
                height:this.props.drawerHeight,
                overflow:'hidden'
            }}>
                <Animated.View style={{
                    position:'absolute',
                    left:0,
                    top:0,
                    width:dw,
                    height:this.props.drawerHeight,
                    backgroundColor:this.props.backgroundColor,
                    opacity:this.aniOpacity,
                }}>

                </Animated.View>
                <Animated.View style={{
                    width:this.width,
                    height:this.props.drawerHeight,
                    transform:[{translateX:this.aniPosX}]
                }}>
                    {this.props.children}
                </Animated.View>
                <TouchableWithoutFeedback onPress={this.hide}>
                    <View style={[{
                        width:dw-this.width,
                        height:this.props.drawerHeight,
                        position:'absolute',
                        top:0,
                    },directionStyle]}>

                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>

        )
    }
}