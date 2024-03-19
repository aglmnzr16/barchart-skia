import {Canvas, Group} from '@shopify/react-native-skia';
import {
  GestureResponderEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Data, data} from './src/data/data';

import * as d3 from 'd3';
import BarPath from './src/components/BarPath';
import XAxisText from './src/components/XAxisText';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useEffect, useState} from 'react';
import AnimatedText from './src/components/AnimatedText';

function App() {
  const {width} = useWindowDimensions();

  const [selectedDay, setSelectedDay] = useState<string>('Total');
  const selectedBar = useSharedValue<string | null>(null);

  const progress = useSharedValue<number>(0);
  const selectedValue = useSharedValue<number>(0);

  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  const canvasWidth = width;
  const canvasHeight = 350;

  const barWidth = 28;

  const graphWidth = width;
  const graphMargin = 20;
  const graphHeight = canvasHeight - graphMargin;

  const xRange = [0, graphWidth];

  const xDomain = data.map((dataPoint: Data) => dataPoint.label);

  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  const yRange = [0, graphHeight];

  const yDomain = [0, d3.max(data, (yDataPoint: Data) => yDataPoint.value)!];

  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  useEffect(() => {
    progress.value = withTiming(1, {duration: 1000});
    selectedValue.value = withTiming(totalValue, {duration: 1000});
  }, [progress, selectedValue, totalValue]);

  const touchHandler = (e: GestureResponderEvent) => {
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;

    const index = Math.floor((touchX - barWidth / 2) / x.step());

    if (index >= 0 && index < data.length) {
      const {label, value, day} = data[index];

      if (
        touchX > x(label)! - barWidth / 2 &&
        touchX < x(label)! + barWidth / 2 &&
        touchY > graphHeight - y(value) &&
        touchY < graphHeight
      ) {
        setSelectedDay(day);
        selectedValue.value = withTiming(value);
        selectedBar.value = label;
        console.log({label, value, day});
      } else {
        selectedBar.value = null;
        selectedValue.value = withTiming(totalValue);
        setSelectedDay('Total');
        console.log('OUT SIDE BAR');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, padding: 25}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#fff'}}>
          Walk And Run Activity
        </Text>

        <AnimatedText selectedValue={selectedValue} selectedBar={selectedBar} />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: '#fff',
          }}>{`${selectedDay} Steps`}</Text>
      </View>
      <Canvas
        onTouchStart={touchHandler}
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}>
        {data.map((dataPoint: Data, index: number) => (
          <Group key={index}>
            <BarPath
              x={x(dataPoint.label)!}
              y={y(dataPoint.value)}
              barWidth={barWidth}
              graphheight={graphHeight}
              progress={progress}
              label={dataPoint.label}
              selectedBar={selectedBar}
            />
            <XAxisText
              x={x(dataPoint.label)!}
              y={canvasHeight}
              text={dataPoint.label}
              selectedBar={selectedBar}
            />
          </Group>
        ))}
      </Canvas>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010101',
  },
});

export default App;
