import React from 'react';
import {Text, useFont} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';

type Props = {
  x: number;
  y: number;
  text: string;
  selectedBar: SharedValue<string | null>
};

const XAxisText = ({x, y, text, selectedBar}: Props) => {

    const color = useDerivedValue(() => {
        if (selectedBar.value === text) {
          return withTiming('#2DD1F2');
        } else if (selectedBar.value === null) {
          return withTiming('#DF09FF');
        } else {
          return withTiming('#DF09FF');
        }
      });

  const font = useFont(require('../assets/fonts/Roboto-Bold.ttf'), 18);

  // find a fontsize
  const fontSize = font?.measureText(text);

  if (!font) {
    return null;
  }

  return (
    <Text
      font={font}
    // @ts-ignore
      x={x - fontSize?.width / 2}
      y={y}
      text={text}
      color={color}
    />
  );
};

export default XAxisText;
