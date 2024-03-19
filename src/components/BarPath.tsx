import React from 'react';
import {Path, Skia} from '@shopify/react-native-skia';
import {
  SharedValue,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  x: number | undefined;
  y: number;
  barWidth: number;
  graphheight: number;
  progress: SharedValue<number>;
  label: string;
  selectedBar: SharedValue<string | null>;
};

const BarPath = ({
  x,
  y,
  barWidth,
  graphheight,
  progress,
  label,
  selectedBar,
}: Props) => {
  const color = useDerivedValue(() => {
    if (selectedBar.value === label) {
      return withTiming('#2DD1F2');
    } else if (selectedBar.value === null) {
      return withTiming('#DF09FF');
    } else {
      return withTiming('#DF09FF');
    }
  });

  const path = useDerivedValue(() => {
    const barPath = Skia.Path.Make();

    barPath.addRRect({
      rect: {
        x: x! - barWidth / 2,
        y: graphheight,
        width: barWidth,
        height: y * -1 * progress.value,
      },
      rx: 8,
      ry: 8,
    });

    return barPath;
  });

  return <Path path={path} color={color} />;
};

export default BarPath;
