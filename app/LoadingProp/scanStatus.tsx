import {color_pallete, toast_pallete} from "@/constants/Colors";
import React, { useState, useRef, useMemo } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
     Vibration,
} from "react-native";
import {
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import {SvgXml} from "react-native-svg";
import {logo} from "@/assets/images/MR-logos";


export const scanStatusProp = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [success, setSuccess] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const scanStatus = useMemo(
        () => (success:boolean) => {
            setSuccess(success);
            setAlertVisible(true);

            if (success) {
                Vibration.vibrate(100);
            } else {
                Vibration.vibrate([0, 100, 100, 100]);
            }

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start()

            setTimeout(() => {
                hideStatus();
            }, 1500);
        },
        []
    );

    const hideStatus = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setAlertVisible(false);
        });
    };

    const StatusModal = useMemo(() => {
        return alertVisible ? (
            <Animated.View style={{ position: "absolute", top: 0, width: "100%", height:'100%', opacity: fadeAnim , backgroundColor:color_pallete[1]}}>
                <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                    <SafeAreaView />
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <View  style={[style.alertContainer]}>
                            <View style={{ display:'flex', flexDirection:'column', justifyContent:'space-evenly', height:'100%'}}>
                                <View style={{display:'flex', marginHorizontal:'auto'}}>
                                    <SvgXml
                                        xml={logo}
                                        height={140}
                                        width={140}
                                        color={color_pallete[10]}
                                    />
                                </View>
                                <View style={{flexDirection:'column', gap:10}}>
                                    <Text style={style.title}>
                                        {success ? "Success" : "Error"}
                                    </Text>
                                    <Text style={style.description}>
                                        {success
                                            ? "Your visit was logged"
                                            : "Your visit was not logged"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </GestureHandlerRootView>
                </View>
            </Animated.View>
        ) : null;
    }, [alertVisible, fadeAnim]);

    return { scanStatus, StatusModal };
};

export default scanStatusProp;

const style = StyleSheet.create({
    alertContainer: {
        position: "relative",
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        gap:10
    },
    alertBox: {
        borderRadius: 20,
        padding: 15,
        paddingVertical: 20,
        width: "100%",
        shadowColor: "black",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    successColor: {
        backgroundColor: toast_pallete[0],
    },
    errorColor: {
        backgroundColor: toast_pallete[1],
    },
    title: {
        fontWeight: "bold",
        color: "white",
        fontSize: 25,
        margin:'auto',
        fontFamily: "Avenir Next",
    },
    description: {
        color: "white",
        fontSize: 15,
        width: "auto",
        fontFamily: "Avenir Next",
    },
});
