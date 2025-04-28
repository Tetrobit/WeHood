import React from "react";
import * as THREE from "three";
// import { color, fog, float, positionWorld, triNoise3D, positionView, normalWorld, uniform } from 'three/build/three.tsl';
import { loadObjAsync, Renderer } from "expo-three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSharedValue } from "react-native-reanimated";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from "react-native";
import Cloud from "@/components/cloud";
import { LinearGradient } from "expo-linear-gradient";
import Neighbourhood from "@/components/neighbourhood";

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    // Здесь будет логика авторизации
    console.log('Submit:', { email, password });
  };

  const handleVKAuth = () => {
    // Здесь будет логика авторизации через ВК
    console.log('VK Auth');
  };

  const AuthForm = () => (
    <View style={styles.authContainer}>
      <View style={styles.authForm}>
        <Text style={styles.authTitle}>{isLogin ? 'Вход' : 'Регистрация'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ffffff88"
          value={email}
          // onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#ffffff88"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.vkButton} onPress={handleVKAuth}>
          <Text style={styles.vkButtonText}>Войти через ВКонтакте</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#323f94', '#5ab8db']}>
    {/* <LinearGradient colors={['#f26f8b', '#fdc859']}> */}
    {/* <LinearGradient colors={['#393790', '#df729d']}> */}
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
        <AuthForm />
        <Neighbourhood
          width={Dimensions.get('screen').width}
          height={Dimensions.get('screen').height}
          onLoad={() => setLoading(false)}
          styles={styles.neighbourhood}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const blockWidth = 15;
const blockPad = 3;


const letterBlockWidth = 15;
const letterBlockPad = 3;


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
    borderRadius: 3,
  },
  letterContainer: {
    position: 'relative',
    width: (letterBlockPad + letterBlockWidth) * 3,
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
    backgroundColor: '#4C75A3',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  vkButtonText: {
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
