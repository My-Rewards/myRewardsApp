import {createContext, useContext, useState, ReactNode, useEffect, useRef} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Modal,
    Pressable,
    SafeAreaView,
    Animated, ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {SvgXml} from "react-native-svg";
import {BackButton, WhiteBGLogo} from "@/assets/images/MR-logos";
import {color_pallete} from "@/constants/Colors";
import {calculateDistance} from "@/constants/functions";
import {localData} from "@/app-data/appData";
import useAlert from "@/app/LoadingProp/alert";
import {redeemRewardApi} from "@/APIs/reward/redeem";
import {Plan} from "@/app-data/data-types";
import {fetchPlan} from "@/APIs/PlanAPIs/fetchShopPlan";

const { height, width } = Dimensions.get("window");

interface RewardModalContextType {
    redeemReward: (
        id: string,
        org_id:string,
        imageUrl: string,
        reward: string,
        name: string,
        location: { lat: number; lng: number },
        setPlan: (value: (((prevState: (Plan | null)) => (Plan | null)) | Plan | null)) => void
    ) => void;
}

const RewardModalContext = createContext<RewardModalContextType | undefined>(undefined);

export const useRewardModal = () => {
    const context = useContext(RewardModalContext);
    if (!context) {
        throw new Error("useRewardModal must be used inside RewardModalProvider");
    }
    return context;
};

function getCurrentDateTime() {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();

    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');

    const date = `${month}/${day}/${year}`;
    const time = `${formattedHours}:${minutes} ${ampm}`;

    return { date, time };
}

export function RewardModalProvider({ children }: { children: ReactNode }) {
    const { userLocation } = localData();
    const { alert } = useAlert();

    const [isOpen, setIsOpen] = useState(false);
    const [rewardId, setRewardId] = useState<string|null>(null);
    const [orgId, setOrgId] = useState<string|null>(null);
    const [imageUrl, setImageUrl] = useState<string|null>(null);
    const [businessName, setBusinessName] = useState<string|null>(null);
    const [reward, setReward] = useState<string|null>(null);
    const [isfar, setIsFar] = useState<number|null>(null);
    const [currentTime, setCurrentTime] = useState(getCurrentDateTime());
    const [planUpdater, setPlanUpdater] = useState<((value: Plan | null | ((prev: Plan | null) => Plan | null)) => void) | null>(null);

    const slide = useRef(new Animated.Value(0)).current;
    const [canProceed, setCanProceed] = useState(false);

    const shouldShowModal =
        isOpen !== null &&
        reward !== null &&
        imageUrl!== null &&
        businessName !== null &&
        rewardId !== null;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentDateTime());
        }, 60000);

        return () => clearInterval(interval);
    }, [isOpen]);

    const redeemReward = (
        id: string,
        org_id:string,
        url: string,
        reward: string,
        name: string,
        location: { lat: number; lng: number },
        setPlan: (value: Plan | null | ((prev: Plan | null) => Plan | null)) => void
    ) => {
        setRewardId(id);
        setOrgId(org_id)
        setImageUrl(url);
        setIsOpen(true);
        setReward(reward);
        setBusinessName(name);
        setPlanUpdater(() => setPlan); // Store the function

        const distance = calculateDistance(location.lat, location.lng, userLocation);
        const intDistance = Math.round(parseFloat(distance || '0'));
        setIsFar(intDistance);
    };

    const close = () => {
        setCanProceed(false);
        setRewardId(null);
        setImageUrl(null);
        setIsOpen(false);
        setReward(null);
        setBusinessName(null);
    }
    const onRedeem = async () => {
        setCanProceed(true);

        Animated.timing(slide, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    function Reward() {
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!rewardId || !orgId) return;

            const handleRedemption = async () => {
                try {
                    await redeemRewardApi(rewardId);
                    const planData = await fetchPlan(orgId);
                    planUpdater?.(planData);
                } catch (error) {
                    alert("Error", "Failed to redeem reward", "error");
                } finally {
                    setLoading(false);
                }
            };

            handleRedemption();
        }, []);

        if (loading) {
            return (
                <View style={styles2.loaderContainer}>
                    <ActivityIndicator size="large" color={color_pallete[1]} />
                    <Text style={styles2.loadingText}>Processing...</Text>
                </View>
            );
        }

        return (
            <View style={styles2.loaderContainer}>
                <Text>{reward}</Text>
            </View>
        );
    }

    return (
        <RewardModalContext.Provider value={{ redeemReward }}>
            {children}

            {shouldShowModal && <Modal
                visible={isOpen}
                animationType="slide"
                transparent={false}
                onRequestClose={close}
            >
                <Animated.View
                    style={[
                        styles2.slider,
                        {transform: [{translateX: slide}]},
                    ]}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.topContainer}>
                            <Image
                                source={{uri: imageUrl}}
                                resizeMode="cover"
                                style={styles.image}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.6)']}
                                style={styles.gradient}
                            />
                        </View>
                        <View style={styles.middleLogo}>
                            <SvgXml xml={WhiteBGLogo} fill={color_pallete[1]}/>
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={[styles.subContainer, {flex: 1, gap: 15}]}>
                                <View style={styles.textRow}>
                                    <Text style={styles.businessNameText}>{businessName}</Text>
                                    <View style={styles.divider}/>
                                    <Text style={styles.dateTimeText}>{currentTime.date}</Text>
                                    <View style={styles.divider}/>
                                    <Text style={styles.dateTimeText}>{currentTime.time}</Text>
                                </View>
                                <Text
                                    numberOfLines={2}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.5}
                                    style={styles.rewardText}
                                >
                                    {reward}
                                </Text>
                                {isfar && isfar >= 10 &&
                                    <Text style={styles.warning}> Are you sure you want to redeem this right now, you
                                        seem a little far. </Text>
                                }
                            </View>
                            <View style={[styles.subContainer, {gap: 20}]}>
                                <Pressable onPress={onRedeem} style={styles.redeemButton}>
                                    <Text style={styles.redeemText}>Redeem</Text>
                                </Pressable>
                                <Pressable onPress={close} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>I'm not Ready to redeem</Text>
                                </Pressable>
                                <SafeAreaView/>
                            </View>
                        </View>
                    </View>
                    {canProceed && (
                        <View style={[styles2.page, {width}]}>
                            <SafeAreaView style={styles2.backContainer}>
                                <Pressable onPress={close}>
                                    <SvgXml xml={BackButton} fill="black"/>
                                </Pressable>
                            </SafeAreaView>
                            <Reward/>
                        </View>
                    )}
                </Animated.View>
            </Modal>}
        </RewardModalContext.Provider>
    );
}


export default function RewardConfirmationPage({ children }: { children: ReactNode }) {
    return (
        <RewardModalProvider>
            {children}
        </RewardModalProvider>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: color_pallete[10],
        width:width,
        height:height
    },
    topContainer: {
        width: '100%',
        aspectRatio: 1,
        zIndex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: 'gray',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        zIndex:10,
        height:'100%',
        width:'100%'
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        position:'relative',
        alignItems: 'center',
        flexDirection:'column',
        gap:10,
        marginTop:'20%',
    },
    middleLogo:{
        height:0,
        width:'100%',
        overflow:'visible',
        justifyContent:'center',
        alignItems:'center',
        zIndex:20,
        bottom:7
    },
    textRow:{
        display:'flex',
        justifyContent:"space-evenly",
        flexDirection:'row',
        alignItems:'center',
        gap:5,
    },
    businessNameText: {
        color: color_pallete[1],
        fontFamily: "Avenir Next",
        fontWeight: "600",
        textAlign:'center',
        fontSize: 14,
        flexWrap: 'wrap',
        maxWidth: width*0.5
    },
    dateTimeText: {
        color: color_pallete[1],
        fontFamily: "Avenir Next",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
    divider:{
        width:2,
        height:'100%',
        backgroundColor:color_pallete[1],
        borderRadius:10
    },
    rewardText:{
        fontFamily: "Avenir Next",
        fontWeight: "700",
        marginHorizontal:'auto',
        textAlign:'center',
        fontSize: 50,
        color: color_pallete[3],
    },
    redeemButton:{
        backgroundColor:color_pallete[1],
        padding:10,
        borderRadius:10,
        width:'100%'
    },
    redeemText:{
        color:'white',
        fontFamily: "Avenir Next",
        fontWeight: "700",
        fontSize: 16,
        textAlign: "center",
    },
    cancelText:{
        color:'black',
        opacity:0.6,
        fontFamily: "Avenir Next",
        textAlign: "center",
        fontSize:16
    },
    cancelButton:{
        justifyContent:'center'
    },
    subContainer:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        width:'90%',
    },
    warning:{
        color:color_pallete[2],
        fontFamily: "Avenir Next",
        fontWeight: "600",
        fontSize:14,
        textAlign:'center',
        width:'80%',
        marginHorizontal:'auto',
    }
});

const styles2 = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
    },
    slider: {
        flex: 1,
        backgroundColor: color_pallete[10],
        flexDirection: "row",
        width:width*2
    },
    page: {
        backgroundColor: color_pallete[10],
        alignItems: "center",
        padding: 20,
    },
    backContainer: {
        alignSelf: "flex-start",
        padding: 10,
    },

    title: {
        marginTop: -50,
        color: "white",
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
    },
    date: {
        color: "white",
        marginVertical: 8,
    },
    warning: {
        color: color_pallete[2],
        marginVertical: 8,
        textAlign: "center",
    },
    primaryBtn: {
        backgroundColor: color_pallete[1],
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        width: "80%",
    },
    primaryBtnText: {
        color: "white",
        textAlign: "center",
        fontWeight: "600",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        color: color_pallete[2],
    },
});