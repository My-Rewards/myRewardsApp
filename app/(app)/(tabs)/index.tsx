import React, { useRef, useState } from 'react';
import { 
  Animated, 
  Text, 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { color_pallete } from '@/constants/Colors';
import { localData } from '@/app-data/appData';
import { ShopPreview } from '@/components/shopPreview';
import { shopPreview } from '@/app-data/data-types';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function index() {
  const { fetchDiscoverShops, discoverShopsFilter1, discoverShopsFilter2, discoverShopsFilter3 } = localData();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFilter, setLoadingNewFilter] = useState(false)
  const [savedFilterSelection, setSavedFilterSelection] = useState(0)

  const runAnimation = (value: number) => {
    Animated.timing(slideAnim, {
      toValue: value,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const sendShopOption = () =>{
    switch (savedFilterSelection){
      case 0:
        return discoverShopsFilter1
      case 1:
        return discoverShopsFilter2
      case 2:
        return discoverShopsFilter3 
    }
  }

  const handlePress = async (filterSelection: number) => {
    try {
      setLoadingNewFilter(true);
      setSavedFilterSelection(filterSelection);

      runAnimation(filterSelection * (width / 3));

      setLoadingNewFilter(false);
      
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const loadMoreData = async () => {
    if (!loadingMore) {
      console.log('fetching more data...');
      try {
        setLoadingMore(true);
        await fetchDiscoverShops(savedFilterSelection, 1);
      } catch (error) {
        console.error("Error fetching more shops:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return (
    <View style={styles.page}>
      <FilterBar slideAnim={slideAnim} handlePress={handlePress} />
      {!loadingNewFilter? 
        <ShopPreviews 
          discoverShops={sendShopOption()} 
          loadMoreData={loadMoreData}
        />:
        <View style={{flex:1}}>
          <ActivityIndicator />
        </View>
      }
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)','rgba(0, 0, 0, .1)']}
        style={{position:'absolute', width:'100%', height:'100%', zIndex:5, pointerEvents:'none'}}
        locations={[0.3,1]}
      />
    </View>
  );
}

const FilterBar = React.memo(({ slideAnim, handlePress }: any) => (
  <View style={styles.filterBar}>
    <Animated.View
      style={[
        styles.indicator,
        { transform: [{ translateX: slideAnim }] },
      ]}
    />
    {[0, 1, 2].map((filterSelection) => (
      <TouchableWithoutFeedback
        key={filterSelection}
        onPress={() => handlePress(filterSelection)}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.filterText}>
            {filterSelection === 0 ? 'Nearby' : filterSelection === 1 ? 'Popular' : 'Favorites'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ))}
  </View>
));

const ShopPreviews = React.memo((
  { discoverShops, loadMoreData }: 
  {discoverShops:shopPreview[]| null | undefined, loadMoreData:() => Promise<void>}) => {

  const { setShopPreviewCache, isPage1Loading } = localData();

  const handleScroll = async (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    if ((contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) && !isPage1Loading && contentOffset.y>0) {
      loadMoreData(); 
    }
  };

  const openShopPage = (shop:shopPreview) =>{
    setShopPreviewCache(shop);
    router.push({ pathname: "/shopPage", params:{ parentPage:'Discover' }});
  }

  if(discoverShops){
    return (
      <View style={{flex:1, width:'100%', height:'100%', zIndex:100}}>
        <ScrollView
          overScrollMode="always"
          bounces={true}
          style={{ flex: 1, width: '100%', height:'100%' }}
          onScrollEndDrag={handleScroll}
          scrollEventThrottle={20}
          showsVerticalScrollIndicator={false}
        >
          {discoverShops.map((shop: any, index: number) => (
            <View key={index} style={{ marginHorizontal: 15 }}>
              <TouchableOpacity onPress={()=>openShopPage(shop)}>
                <ShopPreview 
                selectedPin={shop} 
                type={1} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }else{
    return(
    <View style={{flex:1}}>
      <ActivityIndicator />
    </View>
    )
  }
});

const styles = StyleSheet.create({
  filterBar: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    zIndex: 100,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: color_pallete[0],
    borderBottomWidth: 2,
  },
  page: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:color_pallete[10]
  },
  filterText: {
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    color: color_pallete[2],
    fontSize: 13,
    padding: 10,
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    left: -15,
    width: width / 3 + 30,
    backgroundColor: color_pallete[0],
    borderRadius: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: color_pallete[1],
    borderRadius: 10,
    alignItems: 'center',
  },
  cardText: {
    color: color_pallete[2],
    fontSize: 16,
    fontWeight: 'bold',
  },
});
