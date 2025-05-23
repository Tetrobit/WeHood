import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Linking, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Neighbourhood from "@/components/neighbourhood";
import VKLogo from "@/components/vk-logo";
import { router } from "expo-router";
import * as ExpoLinking from 'expo-linking';
import { parseQueryParams } from "@/core/utils/url";
import * as Device from 'expo-device';

const App = () => {
  const isVKOpen = useSharedValue(false);
  const codeVerifier = useSharedValue<string | null>(null);
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');

  const handleSubmit = () => {
    // Здесь будет логика авторизации
    router.push('/(tabs)');
  };

  const handleVKAuth = async () => {
    if (isVKOpen.value) {
      return;
    }

    isVKOpen.value = true;

    try {
      const response = await fetch('https://api.wehood.zenlog.ru/api/auth/vk-parameters').catch(err => {
        throw new Error("Не удалось подключиться к серверу");
      });
      const data = await response?.json();
      const { vkAppId, redirectUri, code_challenge, code_verifier, scope } = data;
      const url = `https://id.vk.com/authorize?client_id=${vkAppId}&redirect_uri=${redirectUri}&code_challenge=${code_challenge}&code_challenge_method=S256&response_type=code&scope=${scope}`;
      await ExpoLinking.openURL(url);
      codeVerifier.value = code_verifier;
    } catch (error) {
      console.error("Не удалось открыть страницу авторизации", error);
      Alert.alert("Не удалось открыть страницу авторизации");
    } finally {
      isVKOpen.value = false;
    }
  };

  React.useEffect(() => {
    ExpoLinking.addEventListener('url', (event) => {
      const {
        code,
        state,
        device_id,
        ext_id: _ext_id,
        type: _type,
      } = parseQueryParams(event.url);

      if (code === undefined || device_id === undefined) {
        return;
      }

      const handleVKAuth = async () => {
        const response = await fetch('https://api.wehood.zenlog.ru/api/auth/login-vk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier.value,
            device_id,
            state,
            device_name: Device.modelName,
            device_os: Device.osName,
            device_os_version: Device.osVersion,
            device_params: {
              manufacturer: Device.manufacturer,
              model: Device.modelName,
              brand: Device.brand,
              device_manufacturer: Device.manufacturer,
              device_model: Device.modelName,
            }
          }),
        });

        const data = await response.json();
        const token = data.token;
      };

      handleVKAuth();
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return (
    <LinearGradient colors={['#393790', '#df729d']}>
    {/* <LinearGradient colors={['#f26f8b', '#fdc859']}> */}
    {/* <LinearGradient colors={['#323f94', '#5ab8db']}> */}
    {/* <LinearGradient colors={['#df729d', '#393790']}> */}
      <SafeAreaView style={styles.view}>
        {/* <Cloud/> */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.leftFigure}>
              <View style={{...styles.figuresWrapper, ...styles.leftFiguresWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.block, ...styles.blockL1}} />
                  <View style={{...styles.block, ...styles.blockL2}} />
                  <View style={{...styles.block, ...styles.blockL3}} />
                  <View style={{...styles.block, ...styles.blockL4}} />
                </View>
              </View>
            </View>
            <Text style={styles.titleText}>Мой район</Text>
            <View style={styles.rightFigure}>
              <View style={{...styles.figuresWrapper, ...styles.rightFiguresWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.block, ...styles.blockR1}} />
                  <View style={{...styles.block, ...styles.blockR2}} />
                  <View style={{...styles.block, ...styles.blockR3}} />
                  <View style={{...styles.block, ...styles.blockR4}} />
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.companyContainer}>
            
            <View style={styles.letterContainer}>
              <View style={{...styles.figuresWrapper, ...styles.leftLetterWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.letterBlock, ...styles.blockT1}} />
                  <View style={{...styles.letterBlock, ...styles.blockT2}} />
                  <View style={{...styles.letterBlock, ...styles.blockT3}} />
                  <View style={{...styles.letterBlock, ...styles.blockT4}} />
                  <View style={{...styles.letterBlock, ...styles.blockT5}} />
                </View>
              </View>
            </View>
            <View style={styles.letterContainer}>
              <View style={{...styles.figuresWrapper, ...styles.middleLetterWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.letterBlock, ...styles.blockE1}} />
                  <View style={{...styles.letterBlock, ...styles.blockE2}} />
                  <View style={{...styles.letterBlock, ...styles.blockE3}} />
                  <View style={{...styles.letterBlock, ...styles.blockE4}} />
                  {/* <View style={{...styles.letterBlock, ...styles.blockT5}} /> */}
                </View>
              </View>
            </View>
            <View style={styles.letterContainer}>
              <View style={{...styles.figuresWrapper, ...styles.rightLetterWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.letterBlock, ...styles.blockT1}} />
                  <View style={{...styles.letterBlock, ...styles.blockT2}} />
                  <View style={{...styles.letterBlock, ...styles.blockT3}} />
                  <View style={{...styles.letterBlock, ...styles.blockT4}} />
                  <View style={{...styles.letterBlock, ...styles.blockT5}} />
                </View>
              </View>
            </View>
          </View>
                  </View>
        
        {/* Auth Form */}
        <View style={styles.authContainer}>
          <View style={styles.authForm}>
            <Text style={styles.authTitle}>{isLogin ? 'Вход' : 'Регистрация'}</Text>
            <TextInput
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Почта"
              placeholderTextColor="#ffffff88"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              onChangeText={text => setPassword(text)}
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#ffffff88"
              secureTextEntry
              defaultValue={password}
            />
            {!isLogin && 
              <TextInput
                onChangeText={setRepeatPassword}
                style={styles.input}
                placeholder="Повторите пароль"
                placeholderTextColor="#ffffff88"
                secureTextEntry
              />
            }
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.vkButton} onPress={handleVKAuth}>
              <VKLogo width={40} />
              <Text style={styles.vkButtonText}>Продолжить с VK</Text>
              <View style={{width: 40}}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchText}>
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Neighbourhood
          width={Dimensions.get('screen').width}
          height={Dimensions.get('screen').height}
          onLoad={() => {}}
          styles={styles.neighbourhood}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const blockWidth = 15;
const blockPad = 3;


const letterBlockWidth = 12;
const letterBlockPad = 2;


const styles = StyleSheet.create({
  view: {
    height: Dimensions.get('screen').height,
    paddingTop: 45
  },
  neighbourhood: {
    top: 320,
    position: 'absolute',
    zIndex: -1,
  },
  header: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 20,
  },
  letterBlock: {
    position: 'absolute',
    width: letterBlockWidth,
    height: letterBlockWidth,
    backgroundColor: '#fffa',
    borderRadius: 2,
  },
  letterContainer: {
    position: 'relative',
    width: (letterBlockPad + letterBlockWidth) * 3,
top: 7,
  },
  leftLetterWrapper: {
    left: letterBlockWidth,
    top: -20,
  },
  middleLetterWrapper: {
    left: letterBlockPad + letterBlockWidth,
    top: -20,
  },
  rightLetterWrapper: {
    left: 0,
    top: -20,
  },
  companyContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    color: 'white',
    flexDirection: 'row',
  },
  blockE1: {
    top: 0,
    left: 0
  },
  blockE2: {
    top: letterBlockPad + letterBlockWidth,
    left: 0,
  },
  blockE3: {
    top: letterBlockPad + letterBlockWidth,
    left: letterBlockPad + letterBlockWidth,
  },
  blockE4: {
    top: (letterBlockPad + letterBlockWidth) * 2,
    left: 0,
  },
  blockT1: {
    top: 0,
    left: 0
  },
  blockT2: {
    top: 0,
    left: letterBlockPad + letterBlockWidth,
  },
  blockT3: {
    top: 0,
    left: (letterBlockPad + letterBlockWidth) * 2,
  },
  blockT4: {
    top: letterBlockPad + letterBlockWidth,
    left: letterBlockPad + letterBlockWidth,
  },
  blockT5: {
    top: (letterBlockPad + letterBlockWidth) * 2,
    left: letterBlockPad + letterBlockWidth,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    color: 'white',
    flexDirection: 'row',
  },
  titleWrapper: {

  },

  // Tetris Figures
  figuresWrapper: {
    position: 'absolute',
  },
  figuresWrapperRel: {
    position: 'relative',
  },
  leftFigure: {
    position: 'relative',
  },
  leftFiguresWrapper: {
    top: -31,
    left: 15
  },
  rightFiguresWrapper: {
    top: 8,
    left: 19,
  },
  rightFigure: {
    position: 'relative',
  },
  blockL1: {
    right: 0,
    top: 0
  },
  blockL2: {
    right: 0,
    top: blockPad + blockWidth,
  },
  blockL3: {
    right: blockPad + blockWidth,
    top: blockPad + blockWidth,
  },
  blockL4: {
    right: blockPad + blockWidth,
    top: (blockPad + blockWidth) * 2,
  },
  blockR1: {
    right: 0,
    top: 0
  },
  blockR2: {
    right: 0,
    top: blockPad + blockWidth,
  },
  blockR3: {
    right: blockPad + blockWidth,
    top: blockPad + blockWidth,
  },
  blockR4: {
    right: (blockPad + blockWidth) * 2,
    top: blockPad + blockWidth,
  },
  block: {
    position: 'absolute',
    width: blockWidth,
    height: blockWidth,
    backgroundColor: '#fffa',
    borderRadius: 3,
  },
  titleText: {
    color: 'white',
    fontSize: 20,
  },
  authContainer: {
    width: '100%',
    position: 'absolute',
    marginTop: 100,
    marginBottom: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1
  },
  authForm: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    backdropFilter: 'blur(10px)',
  },
  authTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  vkButton: {
    backgroundColor: '#000',
    padding: 7,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 5,
    marginBottom: 15,
display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vkButtonText: {
marginLeft: 10,
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
})

export default App;
