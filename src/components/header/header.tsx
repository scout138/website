import { component$, Resource, useResource$, useStyles$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { DataResult, getData } from '~/libs/cms';
import Menu from '../menu/menu';
import styles from './header.scss?inline';

export interface SubMenuDefinition {
  name: string;
  link?: string;
  children?: SubMenuDefinition[];
}

export type MenuDefinition = DataResult<{
  link?: string;
  children?: SubMenuDefinition[];
}>;

export default component$(() => {
  useStyles$(styles);

  const menu = useResource$<SubMenuDefinition[] | undefined>(async () => {
    return (await getData<Omit<SubMenuDefinition, 'name'>>('menu'))?.map((result) => ({ name: result.name, ...result.data }));
  });

  return (
    <div className="Header">
      <Link href="/" className="group-logo" />
      <div className="Header-menu">
        <Resource
          value={menu}
          onResolved={(menu) => (<Menu menu={{ children: menu || [] }} />)}
        />
      </div>
    </div>
  );
});
