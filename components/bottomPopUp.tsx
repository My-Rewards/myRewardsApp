import React, { forwardRef } from 'react';
import { View, Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { SvgXml } from 'react-native-svg';
import { mediumLogo } from '@/assets/images/MR-logos';

type BottomPopUpProps = {
  backgroundColor: string;
  description: string;
  buttonTitle: string;
  onClose: () => void;
  onSubmit: () => void;
};

const BottomPopUp = forwardRef<BottomSheet, BottomPopUpProps>(({ backgroundColor, description, buttonTitle, onClose, onSubmit }, ref) => {
  const snap_points = ["50%"];

  const handleClose = () => {
    (ref as React.RefObject<BottomSheet>).current?.close();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit();
  }

  return (
    <BottomSheet
      snapPoints={snap_points}
      ref={ref}
      enablePanDownToClose={true}
      handleIndicatorStyle={[styles.handleIndicator]}
      handleStyle={[styles.handleStyle, {backgroundColor: backgroundColor}]}
      onClose={onClose}
      style={{ backgroundColor: 'transparent' }}
    >
      <BottomSheetView style={[styles.contentContainer, { backgroundColor: backgroundColor }]}>
        <SvgXml xml={mediumLogo} style={styles.svg}/>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={[styles.mainButton]} onPress={handleSubmit}>
            <Text style={[styles.mainButtonText, { color: backgroundColor }]}>{buttonTitle}</Text>
          </Pressable>
          <Pressable onPress={handleClose} style={[styles.cancelButton, { backgroundColor: backgroundColor }]}>
            <Text style={styles.cancelButtonText}>cancel</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  description: {
    fontFamily: 'Avenir Next',
    fontSize: 16,
    color: '#FFFBF6',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: '#FFFBF6',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, 
  },
  mainButtonText: {
    fontFamily: 'Avenir Next',
    fontSize: 16,
    color: '#F35E43',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F35E43',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FFFBF6',
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Avenir Next',
    fontSize: 16,
    color: '#FFFBF6',
    fontWeight: 'bold',
  },
  handleIndicator: {
    backgroundColor: '#FFFBF6',
    width: 256,
  },
  handleStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  svg: {
    width: 200,
    height: 50,
    color: "#FFFBF6"
  }
});

export default BottomPopUp;