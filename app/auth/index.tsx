import React, { useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Linking, Alert, ColorValue, BackHandler } from "react-native";
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
import { setStatusBarBackgroundColor } from "expo-status-bar";
import PagerView from 'react-native-pager-view';
import { ArrowLeftIcon } from "lucide-react-native";
import { AppLogo, CompanyLogo } from "../components/Logo";
import ToastManager, { Toast } from 'toastify-react-native'

const screenHeight = Dimensions.get('window').height;

const gradientColors: [ColorValue, ColorValue][] = [
  ['#f26f8b', '#fdc859'],
  ['#323f94', '#5ab8db'],
  ['#393790', '#df729d'],
];

const App = () => {
  const [gradientIndex, updateGradientIndex] = React.useReducer((state: number) => (state + 1) % gradientColors.length, 2);
  const { generateVKAuthUrl, loginWithVK, checkEmailExists, sendVerificationCode, verifyVerificationCode, register, login } = useApi();
  const isVKOpen = useSharedValue(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isExistingUser, setIsExistingUser] = React.useState(false);
  const [userHasPassword, setUserHasPassword] = React.useState(false);
  const pagerRef = React.useRef<PagerView>(null);
  const pagerPage = useSharedValue(0);
  const [verificationCodeId, setVerificationCodeId] = React.useState('');
  const handlePagerPage = (page: number) => {
    if (pagerPage.value === page) return;

    pagerPage.value = page;
    pagerRef.current?.setPage(page);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailSubmit = async () => {
    setStatus('email-check');
    
    if (!validateEmail(email)) {
      Toast.error('Пожалуйста, введите корректный email', "top");
      setStatus('idle');
      return;
    }

    try {
      const { exists, hasPassword } = await checkEmailExists(email);
      setIsExistingUser(exists);
      setUserHasPassword(hasPassword);
      handlePagerPage(1);
    } catch (error) {
      console.error(error);
      Toast.error('Что-то пошло не так :(', "top");
    } finally {
      setStatus('idle');
    }
  };

  const handleNameSubmit = async () => {
    if (!firstName || !lastName) {
      Toast.error('Пожалуйста, введите имя и фамилию', "top");
      return;
    }

    setStatus('name-action');
    try {
      const response = await sendVerificationCode(email);
      setVerificationCodeId(response.id);

      Toast.success('Код подтверждения отправлен на почту', "top");
      handlePagerPage(3);
    } catch (error) {
      Toast.error('Не удалось отправить код подтверждения :(', "top");
      console.error(error);
    } finally {
      setStatus('idle');
    }
  };

  const handlePasswordSubmit = async () => {

    if (!validatePassword(password)) {
      Toast.error('Пароль должен содержать минимум 6 символов', "top");
      return;
    }

    if (!isExistingUser && password !== repeatPassword) {
      Toast.error('Пароли не совпадают', "top");
      return;
    }

    setStatus('password-action');
    try {
      if (isExistingUser) {
        const response = await login(email, password);
        if (response.ok) {
          handlePagerPage(0);
          setStatus('success');
          await wait(4000);
          router.replace('/(tabs)');
        } else {
          Toast.error(response.message || 'Не удалось войти', "top");
        }
      } else {
        setStatus('idle');
        handlePagerPage(2);
      }
    } catch (error) {
      console.error(error);
      Toast.error('Что-то пошло не так :(', "top");
    } finally {
      setStatus('idle');
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode) {
      Toast.error('Введите код подтверждения', "top");
      return;
    }

    try {
      setStatus('code-verify');
      const response = await verifyVerificationCode(verificationCodeId, email, verificationCode);
      if (response.ok) {
        setStatus('code-success');
      } else {
        Toast.error("Неверный код подтверждения", "top");
        setStatus('idle');
        return;
      }
    } catch (error) {
      console.error(error);
      Toast.error('Не удалось подтвердить код', "top");
      setStatus('idle');
      return;
    }
    
    setStatus('registration');
    try {
      await register(email, password, verificationCodeId, firstName, lastName);
      setStatus('register-success');
      await wait(4000);
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      Toast.error('Не удалось зарегистрироваться', "top");
      handlePagerPage(1);
      setStatus('idle');
    }
  };

  const handleVKAuth = async () => {
    if (isVKOpen.value) {
      return;
    }

    handlePagerPage(0);
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
        <View style={styles.header}>
          <AppLogo />
          <CompanyLogo />
        </View>
        
        {/* Auth Form */}
        <PagerView style={{...styles.authContainer}} ref={pagerRef} initialPage={0} scrollEnabled={false}>
          <View key="1" style={styles.authWrapper}>
            {(status === 'idle' || status === 'vk-open' || status === 'email-check') && (
              <View style={styles.authForm}>
              <>
                <Text style={styles.authTitle}>Вход</Text>
                <TextInput
                  onChangeText={setEmail}
                  value={email}
                  style={styles.input}
                  placeholder="Почта"
                  placeholderTextColor="#ffffff88"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity disabled={status !== 'idle'} style={styles.submitButton} onPress={handleEmailSubmit}>
                  {status === 'email-check' && (
                    <ActivityIndicator size="large" color="#000000" />
                  )}
                  {status !== 'email-check' && (
                    <Text style={styles.submitButtonText}>
                      Войти с почтой
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity disabled={status !== 'idle'} style={styles.vkButton} onPress={handleVKAuth}>
                  <VKLogo width={35} />
                  {status === 'vk-open' && (
                    <ActivityIndicator size="large" color="#ffffff" />
                  )}
                  {status !== 'vk-open' && (
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
                  <TouchableOpacity onPress={() => handlePagerPage(0)}>
                    <ArrowLeftIcon size={25} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.authTitle}>{isExistingUser ? 'Вход' : 'Регистрация'}</Text>
              </View>
              <Text style={styles.emailText}>{email}</Text>
              {(!isExistingUser || userHasPassword) && (
                <TextInput
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor="#ffffff88"
                  secureTextEntry
                />  
              )}
              {isExistingUser && !userHasPassword && (
                <>
                  <Text style={styles.warningText}>У пользователя с такой почтой отсутствует пароль, попробуйте войти с VK</Text>
                  <View style={{height: 10}}></View>
                  <TouchableOpacity style={styles.vkButton} onPress={handleVKAuth}>
                    <VKLogo width={35} />
                    <Text style={styles.vkButtonText}>Продолжить с VK</Text>
                    <View style={{width: 40}}></View>
                  </TouchableOpacity>
                </>
              )}

              {!isExistingUser && (
                <TextInput
                  onChangeText={setRepeatPassword}
                  style={styles.input}
                  placeholder="Повторите пароль"
                  placeholderTextColor="#ffffff88"
                  secureTextEntry
                />
              )}

              {(!isExistingUser || userHasPassword) && (
                <TouchableOpacity style={styles.submitButton} onPress={handlePasswordSubmit}>
                  {status === 'password-action' && (
                    <ActivityIndicator size="large" color="#000000" />
                  )}
                  {status !== 'password-action' && (
                    <Text style={styles.submitButtonText}>{isExistingUser ? 'Войти' : 'Далее'}</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View key="3" style={styles.authWrapper}>
            <View style={styles.authForm}>
              <View style={styles.authFormHeader}>
                <View style={styles.authFormHeaderLeft}>
                  <TouchableOpacity onPress={() => handlePagerPage(1)}>
                    <ArrowLeftIcon size={25} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.authTitle}>Как Вас зовут?</Text>
              </View>
              <TextInput
                onChangeText={setFirstName}
                style={styles.input}
                value={firstName}
                placeholder="Имя"
                placeholderTextColor="#ffffff88"
              />
              <TextInput
                onChangeText={setLastName}
                style={styles.input}
                value={lastName}
                placeholder="Фамилия"
                placeholderTextColor="#ffffff88"
              />

              {(!isExistingUser || userHasPassword) && (
                <TouchableOpacity style={styles.submitButton} onPress={handleNameSubmit}>
                  {status === 'name-action' && (
                    <ActivityIndicator size="large" color="#000000" />
                  )}
                  {status !== 'name-action' && (
                    <Text style={styles.submitButtonText}>Далее</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View key="4" style={styles.authWrapper}>
            { (status === 'code-verify' || status === 'idle') && (
              <View style={styles.authForm}>
                <View style={styles.authFormHeader}>
                  <View style={styles.authFormHeaderLeft}>
                    <TouchableOpacity onPress={() => handlePagerPage(2)}>
                      <ArrowLeftIcon size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.authTitle}>Подтверждение</Text>
                </View>
                <TextInput
                  onChangeText={setVerificationCode}
                  style={styles.input}
                  placeholder="Введите код подтверждения"
                  placeholderTextColor="#ffffff88"
                  keyboardType="numeric"
                  maxLength={6}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleVerificationSubmit}>
                  {status === 'code-verify' && (
                    <ActivityIndicator size="large" color="#000000" />
                  )}
                  {status !== 'code-verify' && (
                    <Text style={styles.submitButtonText}>Подтвердить</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {status === 'registration' && (
              <View style={styles.loadingContainer}>
                <Spinner type={'Bounce'} size={75} color="#ffffff" />
              </View>
            )}
            {status === 'register-success' && (
              <View style={styles.successContainer}>
                <Success />
              </View>
            )}
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
        <ToastManager />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  view: {
    height: Dimensions.get('screen').height,
    paddingTop: 45
  },
  neighbourhood: {
    top: screenHeight*5/13,
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
  emailText: {
    color: '#fff9',
    fontSize: 14,
    marginBottom: 20,
    marginTop: -20,
    textAlign: 'center',
  },
  suggestionText: {
    color: '#ffff',
    fontSize: 14,
    marginBottom: 10,
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
  warningText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#ffffffff',
    height: 48,
    padding: 7,
    borderRadius: 5,
    marginBottom: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
