require('../../libs/dragNdrop.js');

// Custom Sounds
import sounds from '../../libs/sounds';

function initialize() {
  sounds.preload();
  sounds.play('STARTUP');
}

initialize();
