import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Countdown from 'react-native-countdown-component';
import moment from 'moment';

const RemainingTime = ({ createdDate, days }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Calculate the end date
    const endDate = moment(createdDate).add(days, 'days');
    // Calculate the remaining time in seconds  
    const now = moment();
    const duration = moment.duration(endDate.diff(now));
    const seconds = duration.asSeconds();
    setRemainingTime(seconds > 0 ? seconds : 0);
  }, [createdDate, days]);

  return (
    <View style={styles.container}>
      {remainingTime > 0 ? (
        <Countdown
          until={remainingTime}
          onFinish={() => alert('Order time has expired')}
          size={16}
          timeToShow={['D', 'H', 'M', 'S']}
          timeLabels={{ d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }}
          showSeparator
        />
      ) : (
        <Text style={styles.expiredText}>Order time has expired</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredText: {
    fontSize: 16,
    color: 'red',
    fontWeight: '500'
  },
});

export default RemainingTime;
