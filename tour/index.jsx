require('../libs/dragNdrop.js');

import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import i18n from '../i18n/i18n';
import Tour from './Tour';

render(
  <AppContainer>
    <Tour />
  </AppContainer>,
  document.getElementById('root')
);

module.hot && module.hot.accept();
