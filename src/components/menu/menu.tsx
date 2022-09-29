import { component$, useStyles$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import styles from './menu.scss?inline';

export interface MenuDefinition {
  link?: string;
  target?: string;
  name?: string;
  children?: MenuDefinition[];
}

export interface MenuProps {
  menu: MenuDefinition;
  child?: boolean;
}

export const Menu = component$(({ menu, child }: MenuProps) => {
  useStyles$(styles);

  return (
    <div className={'MenuItem' + (menu.children ? ' parent' : '') + (!child ? ' top' : '')}>
      {menu.name && (
        <Link
          href={menu.link || 'javascript:void(0)'}
          target={menu.target}
        >
          {menu.name}
        </Link>
      )}

      {menu.children && (
        <div className={'MenuItem-submenu'}>
          {menu.children.map((child, i) => (<Menu menu={child} child={true} />))}
        </div>
      )}
    </div>
  );
});

export default Menu;