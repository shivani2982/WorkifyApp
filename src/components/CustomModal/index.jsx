import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Colors} from '../../constants/theme';

const CustomModal = ({visible, onClose, onAction, action, message}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <StatusBar translucent={false} backgroundColor="rgba(0, 0, 0, 0)" />

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.txt}>{message}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
              marginTop: 40,
            }}>
            <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
              <Text style={styles.btnTxt}>{action}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: Colors.primary.sub,
    borderRadius: 10,
  },
  txt: {
    color: Colors.primary.black,
    fontSize: 18,
  },
  actionBtn: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  cancelBtn: {
    backgroundColor: Colors.primary.white,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  btnTxt: {
    color: Colors.primary.lightBlack,
    fontSize: 16,
  },
});

export default CustomModal;
