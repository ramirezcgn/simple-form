import React from 'react';
import { Button as ReactStrapButton } from 'reactstrap';
import cx from 'classnames';
import styles from './button.module.scss';

type Props = {
  type?: any,
  children?: any,
  className?: any,
  [x:string]: any,
};

export const Button = ({
  type,
  children,
  className = '',
  ...rest
}: Props) => {
  return (
    <ReactStrapButton
      {...rest}
      type={type}
      className={cx(styles.buttonControl, styles[type], className)}
    >
      {children}
    </ReactStrapButton>
  );
};
