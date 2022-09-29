import { component$, useStyles$, Slot } from '@builder.io/qwik';
import Footer from '~/components/footer/footer';
import Header from '../components/header/header';
import styles from './layout.scss?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div className="App">
      <Header />

      <div className="App-content">
        <Slot />
      </div>

      <Footer />
    </div>
  );
});
