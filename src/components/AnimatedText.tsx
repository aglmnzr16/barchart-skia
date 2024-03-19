import {Canvas, Text, useFont} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';

type props = {
  selectedValue: SharedValue<number>;
  selectedBar: SharedValue<string | null>
};

const AnimatedText = ({selectedValue, selectedBar}: props) => {
  const font = useFont(require('../assets/fonts/Roboto-Bold.ttf'), 88);

  const animatedText = useDerivedValue(() => {
    return `${Math.round(selectedValue.value)}`;
  });

  if (!font) {
    return <View />;
  }

  const fontSize = font.measureText('0');


  return (
    <Canvas 
      
      style={{height: fontSize.height + 40}}>
      <Text
        font={font}
        text={animatedText}
        color={'#DF09FF'}
        y={fontSize.height + 20}
      />
    </Canvas>
  );
};

export default AnimatedText;
