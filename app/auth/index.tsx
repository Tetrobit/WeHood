import React, { useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Linking, Alert, ColorValue, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Neighbourhood from "@/components/neighbourhood";
import VKLogo from "@/components/vk-logo";
import { router } from "expo-router";
import * as ExpoLinking from 'expo-linking';
import { parseQueryParams } from "@/core/utils/url";
import useApi from "@/core/hooks/useApi";
import { wait } from "@/core/utils/time";
import Spinner from 'react-native-spinkit';
import Success from "./success";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import PagerView from 'react-native-pager-view';
import { ArrowLeftIcon } from "lucide-react-native";

const gradientColors: [ColorValue, ColorValue][] = [
  ['#f26f8b', '#fdc859'],
  ['#323f94', '#5ab8db'],
  ['#393790', '#df729d'],
];

const App = () => {
  const [gradientIndex, updateGradientIndex] = React.useReducer((state: number) => (state + 1) % gradientColors.length, 2);
  const { generateVKAuthUrl, loginWithVK } = useApi();
  const isVKOpen = useSharedValue(false);
  const [status, setStatus] = React.useState('idle');
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const pagerRef = React.useRef<PagerView>(null);
  const pagerPage = useSharedValue(0);

  const handlePagerPage = (page: number) => {
    pagerPage.value = page;
    pagerRef.current?.setPage(page);
  };

  const handleSubmit = () => {
    // Здесь будет логика авторизации
    // router.push('/(tabs)');
    handlePagerPage(1);
    // setStatus('vk-login');

    // const handleVKAuth = async () => {
    //   try {
    //     await wait(2500);
    //     setStatus('success');
    //     await wait(4000);
    //   } catch(error) {  
    //     console.error(error);
    //     // setStatus('idle');
    //   }
    // };

    // handleVKAuth();
  };

  const handleVKAuth = async () => {
    if (isVKOpen.value) {
      return;
    }

    setStatus('vk-open');
    isVKOpen.value = true;

    try {
      const url = await generateVKAuthUrl();
      await ExpoLinking.openURL(url);
    } catch (error) {
      console.error("Не удалось открыть страницу авторизации", error);
      Alert.alert("Что-то пошло не так", "Не удалось открыть страницу авторизации");
    } finally {
      setStatus('idle');
      isVKOpen.value = false;
    }
  };

  React.useEffect(() => {
    ExpoLinking.addEventListener('url', (event) => {
      const {
        code,
        state,
        device_id,
      } = parseQueryParams(event.url);

      if (code === undefined || device_id === undefined) {
        return;
      }

      setStatus('vk-login');

      const handleVKAuth = async () => {
        try {
          await loginWithVK(code, device_id, state);
          await wait(2500);
          setStatus('success');
          await wait(4000);
          router.replace('/(tabs)');
        } catch(error) {  
          console.error(error);
          setStatus('idle');
        }
      };

      handleVKAuth();
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  useEffect(() => {
    setStatusBarBackgroundColor(gradientColors[gradientIndex][0]);
  }, [gradientIndex]);

  useLayoutEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pagerPage.value !== 0) {
        handlePagerPage(pagerPage.value - 1);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <LinearGradient colors={gradientColors[gradientIndex]}>
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
        <PagerView style={{...styles.authContainer}} ref={pagerRef} initialPage={0} scrollEnabled={false}>
          <View key="1" style={styles.authWrapper}>
            {(status === 'idle' || status === 'vk-open') && (
              <View style={styles.authForm}>
              <>
                <Text style={styles.authTitle}>{isLogin ? 'Вход' : 'Регистрация'}</Text>
                <TextInput
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Почта"
                  placeholderTextColor="#ffffff88"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity disabled={status !== 'idle'} style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>
                    Войти с почтой
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={status !== 'idle'} style={styles.vkButton} onPress={handleVKAuth}>
                  <VKLogo width={35} />
                  {status === 'vk-open' && (
                    <ActivityIndicator size="large" color="#ffffff" />
                  )}
                  {status === 'idle' && (
                    <Text style={styles.vkButtonText}>Продолжить с VK</Text>
                  )}
                  <View style={{width: 40}}></View>
                </TouchableOpacity>
              </>
              </View>
            )}
            {status === 'vk-login' && (
              <View style={styles.loadingContainer}>
                <Spinner type={'Bounce'} size={75} color="#ffffff" />
              </View>
            )}
            {status === 'success' && (
              <View style={styles.successContainer}>
                <Success />
              </View>
            )}
          </View>
          <View key="2" style={styles.authWrapper}>
            <View style={styles.authForm}>
              <View style={styles.authFormHeader}>
                <View style={styles.authFormHeaderLeft}>
                  <TouchableOpacity onPress={() => pagerRef.current?.setPage(0)}>
                    <ArrowLeftIcon size={25} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.authTitle}>Регистрация</Text>
              </View>
              <TextInput
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Почта"
                placeholderTextColor="#ffffff88"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
                value={email}
              />
              <TextInput
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#ffffff88"
                secureTextEntry
              />
              <TextInput
                onChangeText={setRepeatPassword}
                style={styles.input}
                placeholder="Повторите пароль"
                placeholderTextColor="#ffffff88"
                secureTextEntry
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View key="3" style={styles.authWrapper}>
            <View style={styles.authForm}>
              <View style={styles.authFormHeader}>
                <View style={styles.authFormHeaderLeft}>
                  <TouchableOpacity onPress={() => pagerRef.current?.setPage(0)}>
                    <ArrowLeftIcon size={25} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.authTitle}>Регистрация</Text>
              </View>
              <TextInput
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Почта"
                placeholderTextColor="#ffffff88"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#ffffff88"
                secureTextEntry
              />
              <TextInput
                onChangeText={setRepeatPassword}
                style={styles.input}
                placeholder="Повторите пароль"
                placeholderTextColor="#ffffff88"
                secureTextEntry
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          </View>
        </PagerView>

        <Neighbourhood
          width={Dimensions.get('screen').width}
          height={Dimensions.get('screen').height}
          onLoad={() => {}}
          styles={styles.neighbourhood}
        />
        <TouchableOpacity style={styles.gradient} onPress={() => updateGradientIndex()}>
          <View style={{}}>
            <LinearGradient colors={[gradientColors[gradientIndex][1], gradientColors[gradientIndex][1]]}>
              <View style={styles.gradientButton} />
            </LinearGradient>
          </View>
        </TouchableOpacity>
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
  authWrapper: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  authContainer: {
    width: '100%',
    position: 'absolute',
    marginTop: 100,
    marginBottom: 50,
    height: 500,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  authFormHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authFormHeaderLeft: {
    position: 'absolute',
    left: 0,
    top: 6,
  },
  authFormHeaderLeftText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authFormHeaderRight: {
    // width: 20,
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
    backgroundColor: '#ffffffff',
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
  loadingContainer: {
    width: '100%',
    maxWidth: 400,
    paddingVertical: 80,
    marginTop: 110,
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    backdropFilter: 'blur(10px)',
  },
  successContainer: {
    width: '100%',
    maxWidth: 400,
    paddingVertical: 80,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    backdropFilter: 'blur(10px)',
  },
  gradient: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '50%',
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    right: 15,
    bottom: 50,
  },
  gradientButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    right: 50,
    bottom: 50,
  },
})

export default App;
