import { Dimensions, StyleSheet, Text, View } from "react-native";

export function AppLogo() {
  return (
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
  )
}

export function CompanyLogo() {
  return (
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
  )
}

const blockWidth = 15;
const blockPad = 3;


const letterBlockWidth = 12;
const letterBlockPad = 2;

const styles = StyleSheet.create({
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
})

export default {
  AppLogo,
  CompanyLogo,
};
