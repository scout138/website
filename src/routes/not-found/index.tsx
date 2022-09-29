import { component$, useStyles$ } from '@builder.io/qwik';
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div className="NotFound single-column">
      <div className="NotFound-message"></div>
    </div>
  );
});
