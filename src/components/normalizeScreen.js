import { Dimensions, Platform, PixelRatio } from 'react-native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 8p's scale
const scaleWidth = SCREEN_WIDTH / 414;
const scaleHeight = SCREEN_HEIGHT/ 736;

export function normalizeFont(size) {
  const newSize = size * scaleWidth;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export function normalizeHeight(size) {
  const newSize = size * scaleHeight;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)/1.16)
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 10;
  }
}

export function normalizeHeightLogin(size) {
  const newSize = size * scaleHeight;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 7;
  }
}
