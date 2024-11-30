import { Animated, Text, TouchableWithoutFeedback, View, StyleSheet, Dimensions } from 'react-native';
import React, { useRef } from 'react';
import { color_pallete } from '@/constants/Colors';
import { localData } from '@/app-data/appData';

const { width } = Dimensions.get('window');

export default function page4() {  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { fetchDiscoverShops, discoverShops } = localData();

  const handlePress = (filterSelection: number) => {
    Animated.timing(slideAnim, {
      toValue: filterSelection * (width / 2),
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      try {
        // fetchDiscoverShops('wrh24k23jm', filterSelection);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    });
  };

  const FilterBar = React.memo(({ slideAnim, handlePress }: any) => {
    return (
      <View style={styles.filterBar}>
        <Animated.View
          style={[
            styles.indicator,
            { transform: [{ translateX: slideAnim }] },
          ]}
        />
        {[0, 1].map((filterSelection) => (
          <TouchableWithoutFeedback
            key={filterSelection}
            onPress={() => handlePress(filterSelection)}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.filterText}>
                {filterSelection === 0 ? 'myPlan' : 'Favorites'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  });

  return (
    <View style={styles.page}>
      <FilterBar slideAnim={slideAnim} handlePress={handlePress} />
      <View>

      </View>
    </View>
  );
}

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
    width: width / 2 + 30,
    backgroundColor: color_pallete[0],
    borderRadius: 20,
  },
  loading:{
    flex:1,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  }
});
