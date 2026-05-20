import { useLang } from '../../lib/useLang';
import Typewriter from '../tui/Typewriter';

export type HeaderTaglineProps = {
  en: string[];
  es: string[];
};

export default function HeaderTagline({ en, es }: HeaderTaglineProps) {
  const lang = useLang();
  const strings = lang === 'es' ? es : en;
  return <Typewriter strings={strings} />;
}
