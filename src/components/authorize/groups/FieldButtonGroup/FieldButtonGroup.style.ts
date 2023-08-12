import { StyleSheet } from 'react-native';
import { fonts } from 'styles/theme';

const fieldButtonGroupStyles = StyleSheet.create({
  container: {
    gap: 10,
  },
  fieldContainer: {
    width: 360,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  title: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
});

export default fieldButtonGroupStyles;
