// Named access to the imported Poocho design-system components.
// The bundle in ./ds-bundle.js registers everything on a window namespace;
// here we surface the pieces this app actually composes with.
import ds from './ds-bundle.js';

export const {
  Logo,
  Watermark,
  Button,
  Card,
  Badge,
  Icon,
  IconButton,
  DropZone,
  ProgressBar,
  ProcessingStatus,
  VideoTimeline,
  PlayerControls,
  MicButton,
  Waveform,
  LanguageIndicator,
  ChatBubble,
  LanguageDivider,
  TimestampChip,
} = ds;

export default ds;
