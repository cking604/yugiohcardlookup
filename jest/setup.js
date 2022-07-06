import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

global.fetch = jest.fn(() =>
  Promise.resolve({json: () => Promise.resolve({data: []})}),
);
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

jest.mock('../src/services/useRxSubject', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    pipe: jest.fn().mockReturnThis(),
    subscribe: jest.fn(() => ({unsubscribe: jest.fn()})),
  })),
}));
jest.mock('../src/services/getBackgroundStyle', () => ({
  __esModule: true,
  default: () => ({
    container: {
      backgroundColor: '#222222',
      bar: 'light-content',
    },
  }),
}));
