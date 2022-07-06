/**
 * @format
 */

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.

import App from '../App';
import renderer from 'react-test-renderer';
import CardListingScreen from '../src/screens/CardListingScreen';
import CardDetailsScreen from '../src/screens/CardDetailsScreen';

describe('Screen smoke tests', () => {
  it('tests App renders', () => {
    renderer.create(<App />);
  });
  it('tests Card Listing Screen renders', () => {
    renderer.create(<CardListingScreen />);
  });
  it('tests Card Details Screen renders', () => {
    renderer.create(<CardDetailsScreen route={{params: '123'}} />);
  });
});
