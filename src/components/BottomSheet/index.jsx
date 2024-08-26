import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../../constants/theme';

export const BottomSheet = ({isVisible, setIsVisible, ...props}) => {
  return (
    <>
      <Modal
        isVisible={isVisible}
        swipeDirection={'down'}
        onSwipeComplete={() => setIsVisible(!isVisible)}
        style={styles.modalContainer}
        backdropColor={'transparent'}>
        <View style={styles.mainView}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.modalButton} />
          </View>
          {props.children}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
    // borderTopRightRadius: 40,
  },
  mainView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 30,
    // alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: '90%',
  },
  modalButton: {
    height: 4,
    width: '15%',
    backgroundColor: Colors.primary.darkgray,
    borderRadius: 2,
    marginVertical: 8,
  },
});
