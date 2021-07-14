import React from 'react';
import { Button as ReactStrapButton } from 'reactstrap';
import cx from 'classnames';
import styles from './button.scss';

type Props = {
  children?: any,
  className?: any,
  [x:string]: any,
};

export const Button = ({
  children,
  className = '',
  ...rest
}: Props) => {
  return (
    <ReactStrapButton
      {...rest}
      className={cx(styles.buttonControl, className)}
    >
      {children}
    </ReactStrapButton>
  );
};
