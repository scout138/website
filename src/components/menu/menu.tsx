import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
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
  const location = useLocation();
  const editing = !!location.query['__builder_editing__'];
  const selected = location.pathname === menu.link;

  return (
    <div className={'MenuItem' + (menu.children ? ' parent' : '') + (!child ? ' top' : '') + (selected ? ' current' : '')}>
      {menu.name && (
        <Link
          href={(!editing && menu.link) || 'javascript:void(0)'}
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