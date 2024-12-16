import { StyleSheet, Dimensions } from 'react-native';
import { color_pallete } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    mapContainer: {
      width: '100%',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    marker: {
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor:'white',
      flex:1,
      paddingHorizontal: 20,
      margin:10,
      borderRadius:10,
      paddingTop:10,
      width:width-20,
      alignSelf:'center',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 25,
      padding: 5,
      zIndex:100
    },
    header:{
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    logo:{
        width:40,
        height:40,
        borderRadius:30,
        overflow:'hidden',
        alignSelf:'center',
        display:'flex',
        marginVertical:'auto'
    },
    text1:{
        color:color_pallete[2],
        fontFamily:'Avenir Next',
        fontWeight:'700',
        fontSize:22
    },
    titleContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        gap:10
    },
    subHeader:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginVertical:30,
    },
    modalTitle1:{
        alignSelf:'center',
        fontFamily:'Avenir Next',
        fontWeight:'600',
        fontSize:13,
        color:color_pallete[3],
        opacity:0.8,
    },
    subText:{
        fontFamily:'Avenir Next',
        color:color_pallete[3],
        fontWeight:'500',
        fontSize:11,
        opacity:0.8
    },
    descContainer:{
        alignSelf:'center', 
        marginBottom:30
    },
    text2:{
        color:color_pallete[2],
        fontFamily:'Avenir Next',
        fontSize:12,
        fontWeight:'500'
    },
    logo2:{
        width:30,
        height:30,
        borderRadius:30,
        overflow:'hidden',
        alignSelf:'center',
        display:'flex',
        marginVertical:'auto'
    },
    subHeader2:{
        flexDirection:'column',
    },
    subHeader1:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        gap:10,
        marginBottom:20
      },
});
  
export const modalStyle = StyleSheet.create({
  modalContainer:{ 
    position: 'absolute', 
    width: '100%', 
    height: '100%'
  },
  container:{
    backgroundColor:'white', 
    flex:0.8,
    borderTopRightRadius:15,
    borderTopLeftRadius:15,
    overflow:'hidden',
  },
  loadingContainer:{
    display:'flex',
    flex:1,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    position:'relative',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex:99
  },
  imageContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 2,
    backgroundColor:'gray'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
    textAlign:'center',
    fontFamily:'Avenir Next'
  },
  modalTitle1:{
    alignSelf:'center',
    fontFamily:'Avenir Next',
    fontWeight:'700',
    fontSize:16,
    color:'white',
    opacity:0.8
  },
  titleContainer:{
    borderRadius:10,
    borderWidth:2,
    borderColor:'white',
    display:'flex',
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal:10,
    paddingVertical:5, 
    paddingHorizontal:10,
    minWidth:'60%'
  },
  subHeader:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    gap:10,
    marginTop:5,
    marginBottom:20
  },
  subText:{
    fontFamily:'Avenir Next',
    color:'white',
    fontWeight:'500',
    fontSize:12,
    opacity:0.8
  },
  descContainer:{
    alignSelf:'center', 
    marginBottom:30
  },
  text1:{
    fontFamily:'Avenir Next',
    color:'white',
    fontWeight:'500',
    fontSize:13,
    opacity:1
  },
  toggleSection:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    paddingBottom:5,
    marginBottom:3
  },
  toggleText:{
    fontSize:14,
    color:'white',
    fontFamily:'Avenir Next',
    fontWeight:'500'
  },
  wrapper: {
    flexDirection: 'row',
    width: width * 2,
    backgroundColor:'transparent',
    flex:1,
  },
  roadmap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'80%',
  },
  roadmapContainer:{
    width:'100%',
    alignItems:'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: color_pallete[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#835C3B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  line: {
    height: 2,
    backgroundColor: color_pallete[2],
  },
  visitsText:{
    color:color_pallete[3],
    fontFamily:'Avenir Next',
    fontWeight:'600',
    fontSize:16
  }
});

export const dropDown = StyleSheet.create({
    container:{
        backgroundColor:'transparent',
        borderColor:color_pallete[5],
        borderWidth:2,
        borderRadius:10,
        width:'80%',
        overflow:'hidden'
    },
    tearText1:{

    },
    seperaterLine:{
        height:2,
        backgroundColor:color_pallete[5],
        width:'100%'
    },
    tierTitleContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:15,
        width:'100%'
    },
    tierContainer:{
        display:'flex',
        flexDirection:'column',
    },
    subText1:{
      fontFamily:'Avenir Next',
      fontWeight:'600'
    },
    rewardContainer:{
      paddingVertical:15,
      paddingHorizontal:10,
      justifyContent:'space-between',
      flexDirection:'row',
      alignItems:"center"
    },
    rewardText:{
      fontFamily:'Avenir Next',
      fontWeight:'500',
      color:color_pallete[5],
    },
    redeemBtn:{
      backgroundColor:color_pallete[5],
      borderRadius:5,
      padding:5
    },
    redeemText:{
      color:'white',
      fontSize:12,
      fontWeight:'500',
      fontFamily:'Avenir Next',
    }
})

export const milestoneStyle = StyleSheet.create({
  bar:{
    flex:1,
    backgroundColor:color_pallete[6],
    borderRadius:3,
    overflow:'hidden'
  },
  barConatiner:{
    flexDirection:'row',
    justifyContent:'center',
    gap:10,
    marginHorizontal:'6%',
    marginBottom:40,
  },
  darker:{
    backgroundColor:color_pallete[5],
    height:'100%',
    position:'absolute',
    left:0
  },
  text:{
    fontFamily:'Avenir Next',
    fontWeight:'500',
    color:color_pallete[5]
  },
  visitsText2:{
    color:color_pallete[3],
    fontFamily:'Avenir Next',
    fontWeight:'600',
    fontSize:14,
    opacity:0.8
  }
})