import { useEffect, type Dispatch, type PropsWithChildren, type ReactElement, type SetStateAction } from 'react';
import { StyleSheet, useColorScheme, View, Text, TouchableOpacity, PanResponder, Dimensions} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const HEADER_HEIGHT = 250;
const { height } = Dimensions.get('window');

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  name:string;
  description:string;
  setExpansion?: Dispatch<SetStateAction<boolean>> | undefined;
}>;

export default function ShopScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  name,
  description,
  setExpansion
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const offsetCloseButton = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: Math.min(
            interpolate(
              scrollOffset.value,
              [HEADER_HEIGHT, 0, -HEADER_HEIGHT],
              [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT]
            ),
            0
          ),
        }
      ],
    };
  });
  
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView 
      ref={scrollRef} 
      scrollEventThrottle={16} 
      showsVerticalScrollIndicator={false} 
      bounces={true}
      disableScrollViewPanResponder={true}
      keyboardShouldPersistTaps="handled"
      onScroll={()=>{
        if(scrollOffset.value <-height*.12){
          setExpansion && setExpansion(false);
        }
      }}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <View style={{ position: 'absolute', width: '100%', height: HEADER_HEIGHT,}}>
          {setExpansion && <Animated.View style={[{
                position: 'absolute',
                width:'100%',
                top: 10,
                zIndex:100,
              },
              offsetCloseButton
            ]}>
            <View style={styles.bar}/>

          </Animated.View>}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={{width:'100%'}}>
              <View style={{margin:10, zIndex:10}}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
              </View>
              <LinearGradient
                colors={['rgba(0,0,0,0)','rgba(0,0,0,0.4)']}
                style={{position:'absolute', width:'100%', height:'100%', zIndex:5}}
                locations={[0,0.3]}
              />
            </View>
          </View>
        </View>
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  header: {
    height: 250,
    overflow: 'hidden',
    backgroundColor:'gray'
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: 'hidden',
  },
  title:{
    textAlign:'left',
    color:'white',
    fontFamily:'Avenir Next',
    fontWeight:'700',
    fontSize:22
  },
  description:{
    textAlign:'left',
    color:'white',
    fontFamily:'Avenir Next',
    fontWeight:'500',
    fontSize:12
  },
  bar:{
    height:5, 
    backgroundColor:'white',
    opacity:0.8,
    borderRadius:10,
    width:'50%',
    alignSelf:'center',
    shadowColor:'black',
    shadowOpacity:.5,
    shadowRadius:3,
    shadowOffset:{
      height:2,
      width:0
    }
  }
});
