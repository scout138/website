import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './footer.scss?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <div className="Footer">
      Copyright &copy; 2009 - {new Date().getFullYear()} The 138th East Vancouver Scout Group
    </div>
  );
});
