import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from './Icon';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR, SECONDARY_COLOR, WHITE, BORDER, DARK_GRAY, BLACK } from '../assets/styles';

export default function Button({
  disabled,
  title,
  compact,
  mode = 'contained',
  loading,
  icon,
  onPress,
  style,
  ...rest
}) {
  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: compact ? 8 : 16,
      borderRadius: 10,
    },
    buttonOutline: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: compact ? 8 : 15,
      borderWidth: mode=='outline' ? 1 : 0,
      borderRadius: 10,
      borderColor: BORDER,
    },
    buttonText: {
      color: mode == 'contained' ? WHITE : BLACK,
      fontSize: 17,
      fontWeight: '600',
      marginHorizontal: 4,
    },
  });
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      disabled={disabled}
      onPress={onPress}
    >
      {mode == 'contained' ? (
        <LinearGradient
          colors={[ PRIMARY_COLOR, SECONDARY_COLOR]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              style={{ width: 16, height: 16 }}
              color="white"
            />
          ) : (
            <>
              <Text style={styles.buttonText}>{title}</Text>
              {icon && <Icon name="arrow-right" size={16} color={WHITE} />}
            </>
          )}
        </LinearGradient>
      ) : (
        <View style={styles.buttonOutline}>
          {loading ? (
            <ActivityIndicator
              size="small"
              style={{ width: 16, height: 16 }}
              color="white"
            />
          ) : (
            <>
              <Text style={styles.buttonText}>{title}</Text>
              {icon && <Icon name="arrow-right" size={16} color={BLACK} />}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
